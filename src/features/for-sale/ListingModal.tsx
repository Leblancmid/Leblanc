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
        <ListingThumbnail listing={listing} size="hero" className="rounded-lg" />

        <div className="flex flex-wrap items-center gap-6 rounded-lg border border-ink-700 bg-ink-800/40 p-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-500">{listing.category} build</p>
            <p className="mt-1 flex items-center gap-2 font-display text-3xl text-gold-300">
              <Star className="size-6 text-gold-400" />
              Level {listing.level}
            </p>
          </div>

          {(listing.seller || listing.standing || listing.postedAt) && (
            <div className="flex flex-1 flex-wrap justify-end gap-4 text-sm text-ink-300">
              {listing.seller && (
                <div className="flex items-center gap-2">
                  <User className="size-4 text-ink-500" />
                  <span>{listing.seller}</span>
                </div>
              )}
              {listing.standing && (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-ink-500" />
                  <span>{listing.standing}</span>
                </div>
              )}
              {listing.postedAt && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-ink-500" />
                  <span>Listed {dateFormatter.format(new Date(listing.postedAt))}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
