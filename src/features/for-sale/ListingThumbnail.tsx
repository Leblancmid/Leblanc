import { Badge } from '@/components/ui/Badge'
import { categoryMeta, listingTitle } from '@/lib/listings'
import { cn } from '@/lib/cn'
import type { Listing } from '@/types'

interface ListingThumbnailProps {
  listing: Listing
  className?: string
}

/** Cropped to the right half of the in-game Stats screen, where the skill levels are. */
export function ListingThumbnail({ listing, className }: ListingThumbnailProps) {
  const { icon: Icon, tone } = categoryMeta[listing.category]

  return (
    <div
      className={cn(
        'relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950',
        className,
      )}
    >
      {listing.image ? (
        <img
          src={listing.image}
          alt={`${listingTitle(listing)} stats screen`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-right transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <Icon aria-hidden strokeWidth={1} className="absolute inset-0 m-auto size-14 text-ink-600" />
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent"
      />

      <div className="absolute left-3 top-3 flex gap-1.5">
        <Badge tone={tone} className="bg-ink-950/85 backdrop-blur-sm">
          <Icon className="size-3" />
          {listing.category}
        </Badge>
        {listing.featured && (
          <Badge tone="gold" className="bg-ink-950/85 backdrop-blur-sm">
            Featured
          </Badge>
        )}
      </div>
    </div>
  )
}
