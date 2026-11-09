/**
 * POST /api/sell-offer (multipart form): someone offers you their account, with a screenshot
 * of its Stats screen. Saved as a lead; posted to #inquiries with the screenshot attached
 * (Discord stores the image, so no extra storage is needed).
 */
import { contactMarkdown } from '../../src/lib/inquiry'
import { screenshotError, validateOffer } from '../../src/lib/orders'
import { imageKind, json, looksLikeBot, postToDiscordWithFile, sameOrigin, type Context } from '../../server/http'
import { saveLead } from '../../server/leads'

const FALLBACK = 'Please message Leblanc on Discord instead.'

export const onRequestPost = async ({ request, env }: Context) => {
  if (!env.DISCORD_WEBHOOK_URL) return json({ message: `Offers aren't switched on yet. ${FALLBACK}` }, 503)
  if (!sameOrigin(request)) return json({ message: 'Not allowed.' }, 403)
  if (Number(request.headers.get('content-length') ?? 0) > 6 * 1024 * 1024) return json({ message: 'The screenshot must be under 5 MB.' }, 413)

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return json({ message: 'Invalid request.' }, 400)
  }
  const raw: Record<string, unknown> = {}
  form.forEach((v, k) => { if (typeof v === 'string') raw[k] = v })
  raw.openedAt = Number(raw.openedAt) || 0
  if (looksLikeBot(raw)) return json({ ok: true })

  const result = validateOffer(raw)
  const file = form.get('screenshot')
  const shot = file instanceof File ? file : null
  let shotErr = screenshotError(shot)
  // Never trust the name or type the browser sent: check the file's own bytes
  const bytes = shot && !shotErr ? new Uint8Array(await shot.arrayBuffer()) : null
  const kind = bytes ? imageKind(bytes) : null
  if (bytes && !kind) shotErr = 'Use a PNG, JPG or WebP image.'
  if (!result.ok || shotErr || !bytes || !kind) {
    return json({ message: 'Please check the form.', errors: { ...(result.ok ? {} : result.errors), ...(shotErr ? { screenshot: shotErr } : {}) } }, 422)
  }
  const o = result.value

  const statLine = (['melee', 'distance', 'magic', 'defense'] as const)
    .filter((k) => o.stats[k] !== undefined).map((k) => `${k[0].toUpperCase()}${k.slice(1)} ${o.stats[k]}`).join(' · ')

  const saved = await saveLead(env, {
    type: 'sell', name: o.name, method: o.method, contact: o.contact,
    details: { level: o.level, category: o.category, stats: o.stats, asking: o.asking || null, message: o.message || null },
  })
  const fileName = `stats.${kind.ext}`
  const posted = await postToDiscordWithFile(env, {
    embeds: [{
      title: `🏷️ Offered to you: Lv ${o.level} ${o.category}${o.asking ? ` · asking ${o.asking}` : ''}`,
      description: statLine || undefined,
      color: 0x14b8a6,
      fields: [
        { name: 'Seller', value: o.name, inline: true },
        { name: 'Contact', value: contactMarkdown(o.method, o.contact), inline: true },
        ...(o.message ? [{ name: 'Message', value: o.message }] : []),
      ],
      image: { url: `attachment://${fileName}` },
      footer: { text: 'Check the price guide in Budget → Leads before you reply' },
      timestamp: new Date().toISOString(),
    }],
  }, { name: fileName, type: kind.type, bytes }).catch(() => false)

  if (!saved && !posted) return json({ message: `Couldn't send right now. ${FALLBACK}` }, 502)
  return json({ ok: true })
}
