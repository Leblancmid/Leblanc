export type ListingCategory = 'Melee' | 'Distance' | 'Magic'

export type SkillKey = 'melee' | 'distance' | 'magic' | 'defense'

/** Base skill levels as shown on the in-game Stats screen (equipment bonuses excluded). */
export type SkillStats = Record<SkillKey, number>

export interface Listing {
  id: string
  category: ListingCategory
  level: number
  stats?: SkillStats
  featured?: boolean
  image?: string
  /** Free-form asking price, e.g. "€450" or "2B gold". Shown as "On request" when absent. */
  price?: string
  /** Day it was listed (Y-m-d), for the "New" badge */
  listed_at?: string
  /** The price before it went down, and the day it did (Y-m-d): the "Price dropped" badge */
  price_was?: string
  price_dropped_at?: string
}
