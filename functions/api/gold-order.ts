/**
 * POST /api/gold-order: a buyer wants gold at your published rate. Saved as a lead and posted
 * to #inquiries with the total worked out.
 */
import gold from '../../src/data/gold.json'
import { contactMarkdown } from '../../src/lib/inquiry'
import { formatKk, formatMoney, formatRate, orderTotal, validateGoldOrder, type GoldConfig } from '../../src/lib/orders'
import { json, looksLikeBot, postToDiscord, readJson, sameOrigin, type Context } from '../../server/http'
import { saveLead } from '../../server/leads'

const FALLBACK = 'Please message Leblanc on Discord instead.'

export const onRequestPost = async ({ request, env }: Context) => {
  if (!env.DISCORD_WEBHOOK_URL && !env.DB) return json({ message: `Gold orders aren't switched on yet. ${FALLBACK}` }, 503)
  if (!sameOrigin(request)) return json({ message: 'Not allowed.' }, 403)

  const raw = await readJson(request, 3000)
  if (!raw) return json({ message: 'Invalid request.' }, 400)
  if (looksLikeBot(raw)) return json({ ok: true })

  const result = validateGoldOrder(raw, gold as GoldConfig)
  if (!result.ok) return json({ message: 'Please check the form.', errors: result.errors }, 422)
  const { value: o, rate } = result
  const total = orderTotal(o.amountKk, rate)

  const saved = await saveLead(env, {
    type: 'gold', name: o.name, method: o.method, contact: o.contact,
    details: { amount_kk: o.amountKk, payment: rate.method, currency: rate.currency, per_kk: rate.per_kk, total, message: o.message || null },
  })
  const posted = await postToDiscord(env, {
    embeds: [{
      title: `💰 Gold order: ${formatKk(o.amountKk)} via ${rate.method}`,
      description: `${formatKk(o.amountKk)} × ${formatRate(rate)}/KK = **${formatMoney(total, rate.currency)}**`,
      color: 0xf59e0b,
      fields: [
        { name: 'Buyer', value: o.name, inline: true },
        { name: 'Contact', value: contactMarkdown(o.method, o.contact), inline: true },
        ...(o.message ? [{ name: 'Message', value: o.message }] : []),
      ],
      timestamp: new Date().toISOString(),
    }],
  }).catch(() => false)

  if (!saved && !posted) return json({ message: `Couldn't send right now. ${FALLBACK}` }, 502)
  return json({ ok: true, total, currency: rate.currency })
}
