import { Card } from '@/components/ui/Card'
import type { Listing } from '@/types'
import { ListingThumbnail } from './ListingThumbnail'

interface ListingCardProps {
  listing: Listing
  onSelect: (listing: Listing) => void
}

export function ListingCard({ listing, onSelect }: ListingCardProps) {
  return (
    <Card interactive className="overflow-hidden animate-slide-up">
      <button
        type="button"
        onClick={() => onSelect(listing)}
        className="block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
      >
        <ListingThumbnail listing={listing} showSlots />
      </button>
    </Card>
  )
}
