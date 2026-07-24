import { Swords, Target, Wand2, type LucideIcon } from 'lucide-react'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import type { Listing } from '@/types'

const categoryIcon: Record<Listing['category'], LucideIcon> = {
  Melee: Swords,
  Distance: Target,
  Magic: Wand2,
}

const categoryTone: Record<Listing['category'], BadgeTone> = {
  Melee: 'blue',
  Magic: 'purple',
  Distance: 'green',
}

interface ListingThumbnailProps {
  listing: Listing
  size?: 'card' | 'hero'
  showSlots?: boolean
  className?: string
}

export function ListingThumbnail({
  listing,
  size = 'card',
  showSlots = false,
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

      {showSlots && (
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          <Badge tone={categoryTone[listing.category]}>{listing.category} Ring</Badge>
          <Badge tone={categoryTone[listing.category]}>{listing.category} Neck</Badge>
        </div>
      )}
    </div>
  )
}
