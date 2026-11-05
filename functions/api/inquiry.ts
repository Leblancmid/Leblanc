/**
 * POST /api/inquiry: a buyer clicked "I want this" on a listing. Checks the request, then
 * posts it to your private Discord #inquiries channel through a webhook.
 *
 * The webhook URL is a secret set in Cloudflare (Pages project → Settings → Variables and
 * Secrets → DISCORD_WEBHOOK_URL). It never reaches the browser.
 */
import listings from '../../src/data/listings.json'
import { validateInquiry, whatsappDigits } from '../../src/lib/inquiry'

interface Env {
  DISCORD_WEBHOOK_URL?: string
}

interface PublishedListing {
  id: string
  category: string
  level: number
  price?: string
  image?: string
}

const FALLBACK = 'Please message Leblanc on Discord or WhatsApp instead.'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!env.DISCORD_WEBHOOK_URL) {
    return json({ message: `Inquiries aren't switched on yet. ${FALLBACK}` }, 503)
  }

  // Only this website's own pages may send inquiries
  const origin = request.headers.get('origin')
  const self = new URL(request.url)
  if (origin && new URL(origin).host !== self.host) {
    return json({ message: 'Not allowed.' }, 403)
  }

  const text = await request.text()
  if (text.length > 5000) return json({ message: 'Message is too long.' }, 413)
  let raw: Record<string, unknown>
  try {
    raw = JSON.parse(text)
  } catch {
    return json({ message: 'Invalid request.' }, 400)
  }

  // Spam bots: they fill the hidden "website" field or submit instantly. Pretend it worked.
  const openedAt = typeof raw.openedAt === 'number' ? raw.openedAt : 0
  if (raw.website || (openedAt && Date.now() - openedAt < 2500)) {
    return json({ ok: true })
  }

  const result = validateInquiry(raw)
  if (!result.ok) return json({ message: 'Please check the form.', errors: result.errors }, 422)
  const inquiry = result.value

  const listing = (listings as PublishedListing[]).find((l) => l.id === inquiry.listingId)
  if (!listing) {
    return json({ message: 'This account was just sold or removed.', errors: { listingId: 'No longer listed.' } }, 422)
  }

  const contact = inquiry.method === 'whatsapp'
    ? `WhatsApp: [${inquiry.contact}](https://wa.me/${whatsappDigits(inquiry.contact)})`
    : `Discord: **${inquiry.contact}**`

  const webhook = await fetch(env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: 'Leblanc Website',
      // Never ping anyone, whatever the buyer typed
      allowed_mentions: { parse: [] },
      embeds: [{
        title: `🛒 Lv ${listing.level} ${listing.category}${listing.price ? ` · ${listing.price}` : ''}`,
        url: `${self.origin}/for-sale?listing=${encodeURIComponent(listing.id)}`,
        color: 0xd4a54a,
        fields: [
          { name: 'Buyer', value: inquiry.name, inline: true },
          { name: 'Contact', value: contact, inline: true },
          ...(inquiry.message ? [{ name: 'Message', value: inquiry.message }] : []),
        ],
        thumbnail: listing.image ? { url: `${self.origin}${listing.image}` } : undefined,
        footer: { text: `Ref ${listing.id.toUpperCase()}` },
        timestamp: new Date().toISOString(),
      }],
    }),
  })

  if (!webhook.ok) {
    return json({ message: `Couldn't send right now. ${FALLBACK}` }, 502)
  }
  return json({ ok: true })
}
