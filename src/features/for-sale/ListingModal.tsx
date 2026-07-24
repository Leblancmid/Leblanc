import { User, CalendarDays, ShieldCheck, Star } from 'lucide-react'
import { Modal } from '@/components/modals/Modal'
import { buttonClasses } from '@/components/ui/Button'
import { DISCORD_URL } from '@/lib/links'
import type { Listing } from '@/types'
import { ListingThumbnail } from './ListingThumbnail'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

interface ListingModalProps {
  listing: Listing | null
  onClose: () => void
}

export function ListingModal({ listing, onClose }: ListingModalProps) {
  if (!listing) return null

  return (
    <Modal
      isOpen={Boolean(listing)}
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex justify-end">
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses('primary', 'md')}
          >
            Inquire with seller
          </a>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <ListingThumbnail listing={listing} size="hero" showSlots className="rounded-lg" />

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
      </div>
    </Modal>
  )
}
