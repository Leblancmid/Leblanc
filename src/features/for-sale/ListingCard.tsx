import { Car, Building2, Gem, Sparkles, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Listing } from '@/types'

const categoryIcon = {
  Vehicle: Car,
  Property: Building2,
  Collectible: Gem,
  Service: Sparkles,
} as const

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

interface ListingCardProps {
  listing: Listing
  onSelect: (listing: Listing) => void
}

export function ListingCard({ listing, onSelect }: ListingCardProps) {
  const Icon = categoryIcon[listing.category]

  return (
    <Card interactive className="flex flex-col p-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-lg border border-ink-600 bg-ink-800 text-gold-400">
          <Icon className="size-5" />
        </span>
        <Badge tone="gold">{listing.category}</Badge>
      </div>

      <h3 className="mt-4 text-lg font-medium text-ink-100">{listing.title}</h3>
      <p className="mt-1 flex items-center gap-1 text-sm text-ink-400">
        <MapPin className="size-3.5" />
        {listing.location}
      </p>
      <p className="mt-3 line-clamp-2 text-sm text-ink-300">{listing.description}</p>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xl font-medium text-gold-300">{currency.format(listing.price)}</p>
        <button
          type="button"
          onClick={() => onSelect(listing)}
          className="text-sm font-medium text-ink-200 underline decoration-ink-600 underline-offset-4 transition-colors hover:text-gold-300 hover:decoration-gold-400"
        >
          View details
        </button>
      </div>
    </Card>
  )
}
