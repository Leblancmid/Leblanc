export type ListingCategory = 'Melee' | 'Distance' | 'Magic'

export interface Listing {
  id: string
  title: string
  category: ListingCategory
  level: number
  featured?: boolean
  image?: string
  price?: number
  server?: string
  seller?: string
  standing?: string
  postedAt?: string
}

