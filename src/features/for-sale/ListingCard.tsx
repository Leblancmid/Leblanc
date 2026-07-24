import { MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { Listing } from '@/types'
import { ListingThumbnail } from './ListingThumbnail'

interface ListingCardProps {
  listing: Listing
  onSelect: (listing: Listing) => void
}

export function ListingCard({ listing, onSelect }: ListingCardProps) {
  return (
    <Card interactive className="flex flex-col overflow-hidden animate-slide-up">
      <ListingThumbnail listing={listing} />

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-medium text-ink-100">{listing.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-ink-400">
          <MapPin className="size-3.5" />
          {listing.location}
        </p>
        <p className="mt-3 flex-1 line-clamp-2 text-sm text-ink-300">{listing.description}</p>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => onSelect(listing)}
            className="text-sm font-medium text-ink-200 underline decoration-ink-600 underline-offset-4 transition-colors hover:text-gold-300 hover:decoration-gold-400"
          >
            View details
          </button>
        </div>
      </div>
    </Card>
  )
}
