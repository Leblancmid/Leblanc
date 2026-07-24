import { Swords, Target, Wand2, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import type { Listing } from '@/types'

const categoryIcon: Record<Listing['category'], LucideIcon> = {
  Melee: Swords,
  Distance: Target,
  Magic: Wand2,
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

interface ListingThumbnailProps {
  listing: Listing
  size?: 'card' | 'hero'
  showPrice?: boolean
  className?: string
}

export function ListingThumbnail({
  listing,
  size = 'card',
  showPrice = true,
  className,
}: ListingThumbnailProps) {
  const Icon = categoryIcon[listing.category]

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950',
        size === 'card' ? 'aspect-[16/10]' : 'aspect-[16/9]',
        className,
      )}
    >
      {listing.image ? (
        <img
          src={listing.image}
          alt={listing.title}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <>
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, white 0, white 1px, transparent 1px, transparent 14px)',
            }}
          />
          <div aria-hidden className="absolute -right-8 -top-8 size-32 rounded-full bg-gold-500/10 blur-2xl" />
          <Icon
            aria-hidden
            strokeWidth={1}
            className={cn(
              'absolute inset-0 m-auto text-ink-600/50',
              size === 'card' ? 'size-14' : 'size-20',
            )}
          />
        </>
      )}

      <div className="absolute left-3 top-3">
        <Badge tone="neutral">LV {listing.level}</Badge>
      </div>

      <div className="absolute right-3 top-3">
        <Badge tone="gold">{listing.category}</Badge>
      </div>

      {showPrice && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent px-4 pb-3 pt-10">
          <p className={cn('font-medium text-gold-300', size === 'card' ? 'text-lg' : 'text-2xl')}>
            {currency.format(listing.price)}
          </p>
        </div>
      )}
    </div>
  )
}
