export type ListingCategory = 'Vehicle' | 'Property' | 'Collectible' | 'Service'

export interface Listing {
  id: string
  title: string
  category: ListingCategory
  price: number
  location: string
  seller: string
  condition: string
  description: string
  tags: string[]
  featured?: boolean
  postedAt: string
}

export interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'offline'
  latencyMs: number
}

export interface ServerStatusData {
  online: boolean
  players: number
  maxPlayers: number
  uptimePercent: number
  ping: number
  ip: string
  version: string
  region: string
  services: ServiceStatus[]
}

export interface FaqItem {
  question: string
  answer: string
}

export interface GuidelineSection {
  title: string
  points: string[]
}
