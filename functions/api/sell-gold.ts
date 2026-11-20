/**
 * POST /api/sell-gold: someone wants to sell you their gold. Saved as a lead (the Budget app's
 * Leads page and phone alerts pick it up) and posted to #inquiries.
 */
import { contactMarkdown } from '../../src/lib/inquiry'
import { formatKk, validateGoldSell } from '../../src/lib/orders'
import { json, looksLikeBot, postToDiscord, readJson, sameOrigin, type Context } from '../../server/http'
import { saveLead, sourceOf } from '../../server/leads'

const FALLBACK = 'Please message Leblanc on Discord instead.'

export const onRequestPost = async ({ request, env }: Context) => {
  if (!env.DISCORD_WEBHOOK_URL && !env.DB) return json({ message: `Gold offers aren't switched on yet. ${FALLBACK}` }, 503)
  if (!sameOrigin(request)) return json({ message: 'Not allowed.' }, 403)

  const raw = await readJson(request, 3000)
  if (!raw) return json({ message: 'Invalid request.' }, 400)
  if (looksLikeBot(raw)) return json({ ok: true })

  const result = validateGoldSell(raw)
  if (!result.ok) return json({ message: 'Please check the form.', errors: result.errors }, 422)
  const o = result.value

  const saved = await saveLead(env, {
    source: sourceOf(request),
    type: 'sell_gold', name: o.name, method: o.method, contact: o.contact,
    details: { amount_kk: o.amountKk, rate: o.rate || null, message: o.message || null },
  })
  const posted = await postToDiscord(env, {
    embeds: [{
      title: `🪙 Gold for sale: ${formatKk(o.amountKk)}${o.rate ? ` at ${o.rate}` : ''}`,
      description: o.rate ? `They're asking **${o.rate}**.` : 'No rate given: make them an offer.',
      color: 0x10b981,
      fields: [
        { name: 'Seller', value: o.name, inline: true },
        { name: 'Contact', value: contactMarkdown(o.method, o.contact), inline: true },
        ...(o.message ? [{ name: 'Message', value: o.message }] : []),
      ],
      timestamp: new Date().toISOString(),
    }],
  }).catch(() => false)

  if (!saved && !posted) return json({ message: `Couldn't send right now. ${FALLBACK}` }, 502)
  return json({ ok: true })
}
