export type ListingCategory = 'Melee' | 'Distance' | 'Magic'

export interface Listing {
  id: string
  title: string
  category: ListingCategory
  level: number
  price: number
  server: string
  seller: string
  standing: string
  description: string
  featured?: boolean
  postedAt: string
  image?: string
}

