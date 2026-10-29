export type ListingCategory = 'Melee' | 'Distance' | 'Magic'

export type SkillKey = 'melee' | 'distance' | 'magic' | 'defense'

/** Base skill levels as shown on the in-game Stats screen (equipment bonuses excluded). */
export type SkillStats = Record<SkillKey, number>

export interface Listing {
  id: string
  category: ListingCategory
  level: number
  hp?: number
  stats?: SkillStats
  featured?: boolean
  image?: string
  /** Free-form asking price, e.g. "€450" or "2B gold". Shown as "On request" when absent. */
  price?: string
}
