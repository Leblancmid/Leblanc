import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { ListingThumbnail } from '@/features/for-sale/ListingThumbnail'
import type { Listing } from '@/types'

interface ListingsMarqueeProps {
  listings: Listing[]
}

export function ListingsMarquee({ listings }: ListingsMarqueeProps) {
  const track = [...listings, ...listings]

  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <div className="flex w-max animate-marquee gap-5 group-hover:[animation-play-state:paused]">
        {track.map((listing, i) => (
          <Card
            key={`${listing.id}-${i}`}
            interactive
            className="w-72 shrink-0 overflow-hidden"
          >
            <Link
              to="/for-sale"
              className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
            >
              <ListingThumbnail listing={listing} />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
