/**
 * POST /api/alerts: a buyer asks to be told about accounts they want ("Notify me").
 * Saved for ALERT_DAYS days; you also get a heads-up in #inquiries.
 */
import { ALERT_DAYS, describeAlert, validateAlert } from '../../src/lib/alerts'
import { contactMarkdown } from '../../src/lib/inquiry'
import { json, looksLikeBot, postToDiscord, readJson, sameOrigin, type Context } from '../../server/http'

/** One person can't have more than this many requests open. */
const MAX_PER_CONTACT = 3

export const onRequestPost = async ({ request, env }: Context) => {
  if (!env.DB) return json({ message: "Alerts aren't switched on yet. Please message Leblanc on Discord instead." }, 503)
  if (!sameOrigin(request)) return json({ message: 'Not allowed.' }, 403)

  const raw = await readJson(request, 3000)
  if (!raw) return json({ message: 'Invalid request.' }, 400)
  if (looksLikeBot(raw)) return json({ ok: true })

  const result = validateAlert(raw)
  if (!result.ok) return json({ message: 'Please check the form.', errors: result.errors }, 422)
  const a = result.value

  const now = Date.now()
  const expires = now + ALERT_DAYS * 86_400_000

  // Asked for the same thing again: just keep the request active longer
  const same = await env.DB.prepare(
    'SELECT id FROM alerts WHERE method = ? AND lower(contact) = lower(?) AND category IS ? AND min_level = ? AND max_level IS ? AND expires_at > ?',
  ).bind(a.method, a.contact, a.category, a.minLevel, a.maxLevel, now).first<{ id: number }>()
  if (same) {
    await env.DB.prepare('UPDATE alerts SET name = ?, expires_at = ? WHERE id = ?').bind(a.name, expires, same.id).run()
    return json({ ok: true })
  }

  const open = await env.DB.prepare('SELECT COUNT(*) AS n FROM alerts WHERE method = ? AND lower(contact) = lower(?) AND expires_at > ?')
    .bind(a.method, a.contact, now).first<{ n: number }>()
  if ((open?.n ?? 0) >= MAX_PER_CONTACT) {
    return json({ message: `You already have ${MAX_PER_CONTACT} alerts. Message Leblanc on Discord to change them.` }, 429)
  }

  await env.DB.prepare(
    'INSERT INTO alerts (name, method, contact, category, min_level, max_level, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  ).bind(a.name, a.method, a.contact, a.category, a.minLevel, a.maxLevel, now, expires).run()

  // A heads-up: someone's looking for this, maybe you can source it
  await postToDiscord(env, {
    embeds: [{
      title: `🔔 Wants: ${describeAlert(a)}`,
      color: 0x5865f2,
      fields: [
        { name: 'Buyer', value: a.name, inline: true },
        { name: 'Contact', value: contactMarkdown(a.method, a.contact), inline: true },
      ],
      footer: { text: `You'll be told here when you publish a match · active ${ALERT_DAYS} days` },
      timestamp: new Date(now).toISOString(),
    }],
  }).catch(() => false)

  return json({ ok: true })
}
