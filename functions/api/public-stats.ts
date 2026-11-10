/**
 * GET /api/public-stats: a few public numbers about the shop, for the owner's portfolio
 * ("Systems I run"). Only counts that are safe to show anyone: no prices, buyers or profit.
 * Cached for a minute so it's cheap however often it's read.
 */
import listings from '../../src/data/listings.json'
import siteStats from '../../src/data/site-stats.json'
import { json, manilaDay, type Context } from '../../server/http'

/** Seen within this long = online (tabs ping every minute). Same as /api/stats. */
const ONLINE_MS = 90_000

export const onRequestGet = async ({ env }: Context) => {
  const now = Date.now()
  let online: number | null = null
  let visitors30: number | null = null

  if (env.DB) {
    const [o, v] = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) AS n FROM presence WHERE last_seen > ?').bind(now - ONLINE_MS).first<{ n: number }>(),
      env.DB.prepare('SELECT COUNT(*) AS n FROM daily_visitors WHERE day >= ?').bind(manilaDay(now - 29 * 86_400_000)).first<{ n: number }>(),
    ]).catch(() => [null, null] as const)
    online = o?.n ?? null
    visitors30 = v?.n ?? null
  }

  const res = json({
    listed: (listings as unknown[]).length,
    accounts_sold: siteStats.accounts_sold,
    gold_trades: siteStats.gold_trades,
    tracking_since: siteStats.tracking_since,
    online_now: online,
    visitors_30d: visitors30,
  })
  res.headers.set('cache-control', 'public, max-age=60')
  return res
}
