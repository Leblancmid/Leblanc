/**
 * The review form behind a review link (/review?t=…, made in the Budget Tracker app for a sale):
 *   GET  ?t=  → what was bought, and whether it's already been reviewed
 *   POST { t, rating 1–5, name, message } → saved as pending until you approve it in the app
 * One review per sale. Posts a heads-up to your private #inquiries channel.
 */
import { json, looksLikeBot, postToDiscord, readJson, sameOrigin, type Context } from '../../server/http'
import { readTicket } from '../../server/reviews'

const INVALID = 'This review link is invalid or has expired. Ask Leblanc for a new one.'

export const onRequestGet = async ({ request, env }: Context) => {
  const ticket = await readTicket(new URL(request.url).searchParams.get('t'), env)
  if (!ticket) return json({ message: INVALID }, 404)
  if (!env.DB) return json({ message: 'Reviews aren\'t switched on yet.' }, 503)
  const done = await env.DB.prepare('SELECT 1 AS x FROM reviews WHERE sale_id = ?').bind(ticket.saleId).first().catch(() => null)
  return json({ item: ticket.label, reviewed: !!done })
}

export const onRequestPost = async ({ request, env }: Context) => {
  if (!sameOrigin(request)) return json({ message: 'Not allowed.' }, 403)
  if (!env.DB) return json({ message: 'Reviews aren\'t switched on yet.' }, 503)
  const raw = await readJson(request, 3000)
  if (!raw) return json({ message: 'Invalid request.' }, 400)
  if (looksLikeBot(raw)) return json({ ok: true })

  const ticket = await readTicket(raw.t, env)
  if (!ticket) return json({ message: INVALID }, 404)

  const rating = Number(raw.rating)
  const name = typeof raw.name === 'string' ? raw.name.trim().replace(/\s+/g, ' ') : ''
  const message = typeof raw.message === 'string' ? raw.message.trim() : ''
  const errors: Record<string, string> = {}
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = 'Pick 1 to 5 stars.'
  if (name.length < 2 || name.length > 40) errors.name = 'Your name or Discord name (2 to 40 characters).'
  if (message.length < 3 || message.length > 400) errors.message = 'A few words about the trade (up to 400 characters).'
  if (Object.keys(errors).length) return json({ message: 'Please check the form.', errors }, 422)

  try {
    await env.DB.prepare('INSERT INTO reviews (sale_id, item, name, rating, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(ticket.saleId, ticket.label, name, rating, message, 'pending', Date.now()).run()
  } catch (e) {
    // sale_id is unique: this sale was already reviewed. Anything else: the table isn't there yet.
    return /unique/i.test(String(e))
      ? json({ message: 'Thanks, this purchase has already been reviewed.' }, 409)
      : json({ message: 'Reviews aren\'t switched on yet. Please send your review to Leblanc on Discord.' }, 503)
  }

  await postToDiscord(env, {
    embeds: [{
      title: `${'⭐'.repeat(rating)} New review waiting for approval`,
      description: `**${ticket.label}**\n“${message}”\n— ${name}`,
      color: 0xf5c542,
      footer: { text: 'Approve it in Budget → Storefront → Reviews' },
      timestamp: new Date().toISOString(),
    }],
  }).catch(() => false)

  return json({ ok: true })
}
