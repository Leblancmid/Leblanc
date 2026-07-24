import { MapPin, User, CalendarDays, Tag } from 'lucide-react'
import { Modal } from '@/components/modals/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Listing } from '@/types'
import { ListingThumbnail } from './ListingThumbnail'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

interface ListingModalProps {
  listing: Listing | null
  onClose: () => void
  onInquire: (listing: Listing) => void
}

export function ListingModal({ listing, onClose, onInquire }: ListingModalProps) {
  if (!listing) return null

  return (
    <Modal
      isOpen={Boolean(listing)}
      onClose={onClose}
      size="lg"
      title={listing.title}
      description={
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          {listing.location}
        </span>
      }
      footer={
        <div className="flex items-center justify-between gap-4">
          <p className="text-2xl font-medium text-gold-300">{currency.format(listing.price)}</p>
          <Button onClick={() => onInquire(listing)}>Inquire with seller</Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <ListingThumbnail listing={listing} size="hero" showPrice={false} className="rounded-lg" />

        <p className="text-sm leading-relaxed text-ink-300">{listing.description}</p>

        <div className="grid grid-cols-2 gap-4 rounded-lg border border-ink-700 bg-ink-800/40 p-4 text-sm">
          <div className="flex items-center gap-2 text-ink-300">
            <User className="size-4 text-ink-500" />
            <span>{listing.seller}</span>
          </div>
          <div className="flex items-center gap-2 text-ink-300">
            <Tag className="size-4 text-ink-500" />
            <span>{listing.condition}</span>
          </div>
          <div className="flex items-center gap-2 text-ink-300">
            <CalendarDays className="size-4 text-ink-500" />
            <span>Listed {dateFormatter.format(new Date(listing.postedAt))}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {listing.tags.map((tag) => (
            <Badge key={tag} tone="neutral">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Modal>
  )
}
