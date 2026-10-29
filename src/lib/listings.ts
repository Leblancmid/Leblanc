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

/** Deep link that opens a listing's detail dialog on the For Sale page. */
export const listingPath = (id: string) => `/for-sale?listing=${encodeURIComponent(id)}`
