import type { GoldConfig } from '@/lib/orders'
import goldData from './gold.json'
import statsData from './site-stats.json'

/**
 * Data published by the Budget Tracker app with the listings (Listing Kit → Publish to website).
 * Don't edit the JSON files by hand: the next publish replaces them.
 */

/** Gold rates, per 1KK gold */
export const gold = goldData as GoldConfig

/** Trust numbers from Leblanc's own sales records */
export const siteStats = statsData as {
  accounts_sold: number
  gold_trades: number
  avg_days_to_sell: number | null
  /** "2026-07": the month the records start */
  tracking_since: string | null
  /** The last accounts sold (level, build and day only) */
  recent_sold?: { level: number; category: 'Melee' | 'Distance' | 'Magic'; sold_on: string }[]
  /** Typical minutes from a request to Leblanc's reply; null when there's too little to go on */
  reply_minutes?: number | null
}

/** "within an hour" / "within 3 hours" / "within 2 days", or null when unknown */
export function replyTimeLabel(minutes: number | null | undefined): string | null {
  if (minutes == null || minutes < 0) return null
  if (minutes <= 60) return 'within an hour'
  if (minutes < 24 * 60) { const h = Math.ceil(minutes / 60); return `within ${h} hours` }
  const d = Math.ceil(minutes / (24 * 60))
  return d === 1 ? 'within a day' : `within ${d} days`
}

/** "Usually replies within 2 hours" (null when there's no reply time yet) */
export const replyTime = replyTimeLabel(siteStats.reply_minutes)

/** "Jul 2026" */
export const trackingSinceLabel = siteStats.tracking_since
  ? new Date(`${siteStats.tracking_since}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
  : null
