/**
 * POST /api/track: anonymous visit counting.
 *   pageview → today's page views and unique visitors, and "online now"
 *   ping     → still online (sent every minute while the tab is open)
 *   listing  → someone opened an account's details
 * A pageview with "from" (the Discord server the visitor came from) also counts for that server.
 * Visitor / session IDs are random strings the browser makes; nothing personal is stored.
 */
import { json, manilaDay, readJson, sameOrigin, type Context } from '../../server/http'

const ID = /^[a-z0-9]{8,40}$/i
const LISTING = /^[a-z0-9-]{1,40}$/i
/** A Discord server's tag, e.g. "d-3fa9c2" (see src/lib/source.ts) */
const SOURCE = /^[a-z0-9-]{1,24}$/

export const onRequestPost = async ({ request, env }: Context) => {
  // Not set up yet (no database): accept quietly so the site never shows an error
  if (!env.DB) return new Response(null, { status: 204 })
  if (!sameOrigin(request)) return json({ message: 'Not allowed.' }, 403)

  const body = await readJson(request, 1000)
  const visitor = typeof body?.visitor === 'string' ? body.visitor : ''
  const session = typeof body?.session === 'string' ? body.session : ''
  const type = body?.type
  if (!body || !ID.test(visitor) || !ID.test(session) || !['pageview', 'ping', 'listing'].includes(type as string)) {
    return json({ message: 'Invalid request.' }, 400)
  }
  const path = typeof body.path === 'string' ? body.path.slice(0, 100) : null

  const now = Date.now()
  const day = manilaDay(now)
  const db = env.DB
  const statements = [
    db.prepare(
      'INSERT INTO presence (session, last_seen, path) VALUES (?, ?, ?) ' +
      'ON CONFLICT(session) DO UPDATE SET last_seen = excluded.last_seen, path = excluded.path',
    ).bind(session, now, path),
  ]

  if (type === 'pageview') {
    statements.push(
      db.prepare('INSERT OR IGNORE INTO daily_visitors (day, visitor) VALUES (?, ?)').bind(day, visitor),
      db.prepare('INSERT INTO daily_stats (day, pageviews) VALUES (?, 1) ON CONFLICT(day) DO UPDATE SET pageviews = pageviews + 1').bind(day),
    )
  }
  if (type === 'listing') {
    const listing = typeof body.listing === 'string' ? body.listing : ''
    if (!LISTING.test(listing)) return json({ message: 'Invalid listing.' }, 400)
    statements.push(
      db.prepare('INSERT INTO listing_views (listing_id, day, views) VALUES (?, ?, 1) ON CONFLICT(listing_id, day) DO UPDATE SET views = views + 1').bind(listing, day),
    )
  }
  // Now and then, forget tabs closed more than a day ago
  if (Math.random() < 0.02) {
    statements.push(db.prepare('DELETE FROM presence WHERE last_seen < ?').bind(now - 86_400_000))
  }

  await db.batch(statements)

  // Which Discord server sent this visitor (?from= on your listing posts). Its own write, so a
  // database without the source_visitors table yet still counts the visit above.
  const from = typeof body.from === 'string' ? body.from.toLowerCase() : ''
  if (type === 'pageview' && SOURCE.test(from)) {
    await db.prepare('INSERT OR IGNORE INTO source_visitors (day, source, visitor) VALUES (?, ?, ?)')
      .bind(day, from, visitor).run().catch(() => {})
  }
  return new Response(null, { status: 204 })
}
