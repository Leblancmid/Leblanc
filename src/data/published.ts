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
}

/** "Jul 2026" */
export const trackingSinceLabel = siteStats.tracking_since
  ? new Date(`${siteStats.tracking_since}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
  : null
