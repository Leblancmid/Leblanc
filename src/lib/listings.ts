import { Swords, Target, Wand2, type LucideIcon } from 'lucide-react'
import type { BadgeTone } from '@/components/ui/Badge'
import type { Listing, ListingCategory, SkillKey } from '@/types'

export const LISTING_CATEGORIES: ListingCategory[] = ['Melee', 'Distance', 'Magic']

export const categoryMeta: Record<
  ListingCategory,
  { icon: LucideIcon; tone: BadgeTone; skill: SkillKey }
> = {
  Melee: { icon: Swords, tone: 'blue', skill: 'melee' },
  Distance: { icon: Target, tone: 'green', skill: 'distance' },
  Magic: { icon: Wand2, tone: 'purple', skill: 'magic' },
}

export type ListingSort = 'level-desc' | 'level-asc'

export const SORT_OPTIONS: { value: ListingSort; label: string }[] = [
  { value: 'level-desc', label: 'Highest level' },
  { value: 'level-asc', label: 'Lowest level' },
]

export function parseCategory(value: string | null): ListingCategory | null {
  if (!value) return null
  return LISTING_CATEGORIES.find((c) => c.toLowerCase() === value.toLowerCase()) ?? null
}

export function parseSort(value: string | null): ListingSort {
  return SORT_OPTIONS.some((o) => o.value === value) ? (value as ListingSort) : 'level-desc'
}

export function filterAndSortListings(
  items: Listing[],
  category: ListingCategory | null,
  sort: ListingSort,
): Listing[] {
  const filtered = category ? items.filter((l) => l.category === category) : items
  const dir = sort === 'level-asc' ? 1 : -1
  return [...filtered].sort((a, b) => (a.level - b.level) * dir)
}

export const listingTitle = (listing: Listing) =>
  `${listing.category} account — Lv. ${listing.level}`

export const listingReference = (listing: Listing) => listing.id.toUpperCase()

/** Badges: how long a listing counts as new, and a price drop stays flagged */
export const NEW_DAYS = 7
export const PRICE_DROP_DAYS = 14

/** Today in Manila (Y-m-d), the zone the listing dates are written in */
export const todayManila = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })

/** Whole days from a Y-m-d date to today (Y-m-d) */
export const daysSince = (date: string, today = todayManila()) =>
  Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${date}T00:00:00Z`)) / 86_400_000)

export const isNewListing = (l: Listing, today?: string) =>
  !!l.listed_at && daysSince(l.listed_at, today) >= 0 && daysSince(l.listed_at, today) < NEW_DAYS

export const hasPriceDrop = (l: Listing, today?: string) =>
  !!l.price_was && !!l.price_dropped_at && daysSince(l.price_dropped_at, today) < PRICE_DROP_DAYS

/** "today", "yesterday", "3 days ago", "2 weeks ago" */
export function soldAgo(date: string, today?: string): string {
  const d = Math.max(0, daysSince(date, today))
  if (d === 0) return 'today'
  if (d === 1) return 'yesterday'
  if (d < 14) return `${d} days ago`
  return `${Math.floor(d / 7)} weeks ago`
}

/** Deep link that opens a listing's detail dialog on the For Sale page. */
export const listingPath = (id: string) => `/for-sale?listing=${encodeURIComponent(id)}`
