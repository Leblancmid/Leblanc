/**
 * GET /api/stats: visitor numbers for the Budget Tracker app (private: needs STATS_TOKEN).
 * Online now, visitors / page views per day, views per listing, and active "notify me" requests.
 */
import { authorized, json, manilaDay, type Context } from '../../server/http'

/** Seen within this long = online (tabs ping every minute). */
const ONLINE_MS = 90_000

export const onRequestGet = async ({ request, env }: Context) => {
  if (!authorized(request, env)) return json({ message: 'Not allowed.' }, 401)
  if (!env.DB) return json({ message: 'The database is not connected yet.' }, 503)
  const db = env.DB

  const now = Date.now()
  const day = (daysAgo: number) => manilaDay(now - daysAgo * 86_400_000)

  const [online, pages, daily, totals, unique, views, alerts] = await Promise.all([
    db.prepare('SELECT COUNT(*) AS n FROM presence WHERE last_seen > ?').bind(now - ONLINE_MS).first<{ n: number }>(),
    db.prepare('SELECT path, COUNT(*) AS n FROM presence WHERE last_seen > ? GROUP BY path ORDER BY n DESC LIMIT 5')
      .bind(now - ONLINE_MS).all<{ path: string | null; n: number }>(),
    db.prepare(
      'SELECT s.day AS day, s.pageviews AS pageviews, (SELECT COUNT(*) FROM daily_visitors v WHERE v.day = s.day) AS visitors ' +
      'FROM daily_stats s WHERE s.day >= ? ORDER BY s.day',
    ).bind(day(29)).all<{ day: string; pageviews: number; visitors: number }>(),
    db.prepare('SELECT COALESCE(SUM(pageviews), 0) AS n FROM daily_stats').first<{ n: number }>(),
    db.prepare('SELECT COUNT(DISTINCT visitor) AS n FROM daily_visitors').first<{ n: number }>(),
    db.prepare(
      'SELECT listing_id, SUM(views) AS total, COALESCE(SUM(CASE WHEN day >= ? THEN views END), 0) AS last7 ' +
      'FROM listing_views GROUP BY listing_id',
    ).bind(day(6)).all<{ listing_id: string; total: number; last7: number }>(),
    db.prepare('SELECT id, name, method, contact, category, min_level, max_level, created_at, expires_at FROM alerts WHERE expires_at > ? ORDER BY created_at DESC LIMIT 100')
      .bind(now).all(),
  ])

  const sum = (from: string, key: 'visitors' | 'pageviews') =>
    daily.results.filter((d) => d.day >= from).reduce((s, d) => s + d[key], 0)
  const today = daily.results.find((d) => d.day === day(0))

  return json({
    online: online?.n ?? 0,
    online_pages: pages.results,
    today: { visitors: today?.visitors ?? 0, pageviews: today?.pageviews ?? 0 },
    // Visitors summed per day (someone who comes back on 3 days counts 3 times)
    last7: { visitors: sum(day(6), 'visitors'), pageviews: sum(day(6), 'pageviews') },
    last30: { visitors: sum(day(29), 'visitors'), pageviews: sum(day(29), 'pageviews') },
    all_time: { unique_visitors: unique?.n ?? 0, pageviews: totals?.n ?? 0 },
    daily: daily.results,
    listing_views: views.results,
    alerts: alerts.results,
  })
}
