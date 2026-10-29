import { REFERENCES_DISCORD_URL, SERVER_DISCORD_URL, SERVER_DISCORD_LABEL } from '@/lib/links'

// Single source of truth for every public number on the site.
export const HIGHEST_TRADE = '€9,000'
export const YOUTUBE_SUBSCRIBERS = '1.5K'
export const BUYING_LEVEL_RANGE = '600–800+'
export const PAYMENT_METHODS = ['Rucoy gold', 'Binance', 'PayPal']

export interface Community {
  name: string
  href: string
  iconSrc: string
  online: number
  members: number
  established: string
}

export const communities: Community[] = [
  {
    name: 'Leblanc',
    href: REFERENCES_DISCORD_URL,
    iconSrc: '/leblancmid.png',
    online: 150,
    members: 2000,
    established: 'Nov 2024',
  },
  {
    name: SERVER_DISCORD_LABEL,
    href: SERVER_DISCORD_URL,
    iconSrc: '/asian-market.svg',
    online: 450,
    members: 5000,
    established: 'Sep 2023',
  },
]

export const totalDiscordMembers = communities.reduce((sum, c) => sum + c.members, 0)
