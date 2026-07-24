import { Server, User, CalendarDays, ShieldCheck, Star } from 'lucide-react'
import { Modal } from '@/components/modals/Modal'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Listing, ListingCategory } from '@/types'
import { ListingThumbnail } from './ListingThumbnail'

const categoryTone: Record<ListingCategory, BadgeTone> = {
  Melee: 'blue',
  Magic: 'purple',
  Distance: 'green',
}

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
          <Server className="size-3.5" />
          {listing.server}
        </span>
      }
      footer={
        <div className="flex justify-end">
          <Button onClick={() => onInquire(listing)}>Inquire with seller</Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <ListingThumbnail listing={listing} size="hero" className="rounded-lg" />

        <p className="text-sm leading-relaxed text-ink-300">{listing.description}</p>

        <div className="grid grid-cols-2 gap-4 rounded-lg border border-ink-700 bg-ink-800/40 p-4 text-sm">
          <div className="flex items-center gap-2 text-ink-300">
            <Star className="size-4 text-ink-500" />
            <span>Level {listing.level}</span>
          </div>
          <div className="flex items-center gap-2 text-ink-300">
            <User className="size-4 text-ink-500" />
            <span>{listing.seller}</span>
          </div>
          <div className="flex items-center gap-2 text-ink-300">
            <ShieldCheck className="size-4 text-ink-500" />
            <span>{listing.standing}</span>
          </div>
          <div className="flex items-center gap-2 text-ink-300">
            <CalendarDays className="size-4 text-ink-500" />
            <span>Listed {dateFormatter.format(new Date(listing.postedAt))}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge tone={categoryTone[listing.category]}>{listing.category} Ring</Badge>
          <Badge tone={categoryTone[listing.category]}>{listing.category} Neck</Badge>
        </div>
      </div>
    </Modal>
  )
}
