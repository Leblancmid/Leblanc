import { useState } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { listings } from '@/data/listings'
import type { Listing } from '@/types'
import { ListingCard } from './ListingCard'
import { ListingModal } from './ListingModal'

export function ForSalePage() {
  const [selected, setSelected] = useState<Listing | null>(null)

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Marketplace"
        title="For Sale"
        description="Melee, distance, and magic-build accounts, listed by Leblanc."
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} onSelect={setSelected} />
        ))}
      </div>

      <ListingModal listing={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
