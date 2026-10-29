import { Link, type To } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { categoryMeta } from '@/lib/listings'
import type { Listing } from '@/types'
import { ListingThumbnail } from './ListingThumbnail'
import { SkillBars } from './SkillBars'

interface ListingCardProps {
  listing: Listing
  to: To
}

export function ListingCard({ listing, to }: ListingCardProps) {
  return (
    <Card interactive className="group overflow-hidden animate-slide-up">
      <Link
        to={to}
        preventScrollReset
        className="flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold-400"
      >
        <ListingThumbnail listing={listing} />

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                {listing.category} build
              </p>
              <p className="mt-1 font-display text-2xl leading-none text-ink-100">
                Level {listing.level}
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-gold-300 opacity-80 transition-opacity group-hover:opacity-100">
              {listing.price ?? 'View details'}
              <ArrowUpRight className="size-3.5" />
            </span>
          </div>

          {listing.stats && (
            <SkillBars stats={listing.stats} highlight={categoryMeta[listing.category].skill} />
          )}
        </div>
      </Link>
    </Card>
  )
}
