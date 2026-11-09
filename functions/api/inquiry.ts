/**
 * POST /api/inquiry: a buyer clicked "I want this" on a listing. Checks the request, saves it
 * as a lead (Budget app → Leads) and posts it to your private Discord #inquiries channel.
 *
 * The webhook URL is a secret set in Cloudflare (Pages project → Settings → Variables and
 * Secrets → DISCORD_WEBHOOK_URL). It never reaches the browser.
 */
import listings from '../../src/data/listings.json'
import { contactMarkdown, validateInquiry } from '../../src/lib/inquiry'
import { json, looksLikeBot, postToDiscord, readJson, sameOrigin, type Context } from '../../server/http'
import { saveLead } from '../../server/leads'

interface PublishedListing {
  id: string
  category: string
  level: number
  price?: string
  image?: string
}

const FALLBACK = 'Please message Leblanc on Discord or WhatsApp instead.'

export const onRequestPost = async ({ request, env }: Context) => {
  if (!env.DISCORD_WEBHOOK_URL && !env.DB) {
    return json({ message: `Inquiries aren't switched on yet. ${FALLBACK}` }, 503)
  }
  if (!sameOrigin(request)) return json({ message: 'Not allowed.' }, 403)

  const raw = await readJson(request, 5000)
  if (!raw) return json({ message: 'Invalid request.' }, 400)
  // Spam bots: pretend it worked
  if (looksLikeBot(raw)) return json({ ok: true })

  const result = validateInquiry(raw)
  if (!result.ok) return json({ message: 'Please check the form.', errors: result.errors }, 422)
  const inquiry = result.value

  const listing = (listings as PublishedListing[]).find((l) => l.id === inquiry.listingId)
  if (!listing) {
    return json({ message: 'This account was just sold or removed.', errors: { listingId: 'No longer listed.' } }, 422)
  }

  const self = new URL(request.url)
  const title = `Lv ${listing.level} ${listing.category}${listing.price ? ` · ${listing.price}` : ''}`
  const saved = await saveLead(env, {
    type: 'account', name: inquiry.name, method: inquiry.method, contact: inquiry.contact, listingId: listing.id,
    details: { title, message: inquiry.message || null },
  })
  const posted = await postToDiscord(env, {
    embeds: [{
      title: `🛒 ${title}`,
      url: `${self.origin}/for-sale?listing=${encodeURIComponent(listing.id)}`,
      color: 0xd4a54a,
      fields: [
        { name: 'Buyer', value: inquiry.name, inline: true },
        { name: 'Contact', value: contactMarkdown(inquiry.method, inquiry.contact), inline: true },
        ...(inquiry.message ? [{ name: 'Message', value: inquiry.message }] : []),
      ],
      thumbnail: listing.image ? { url: `${self.origin}${listing.image}` } : undefined,
      footer: { text: `Ref ${listing.id.toUpperCase()}` },
      timestamp: new Date().toISOString(),
    }],
  }).catch(() => false)

  if (!saved && !posted) return json({ message: `Couldn't send right now. ${FALLBACK}` }, 502)
  return json({ ok: true })
}
