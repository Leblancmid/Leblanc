import { useState } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Pagination } from '@/components/pagination/Pagination'
import { usePagination } from '@/hooks/usePagination'
import { listings } from '@/data/listings'
import type { Listing } from '@/types'
import { ListingCard } from './ListingCard'
import { ListingModal } from './ListingModal'

const PAGE_SIZE = 6

export function ForSalePage() {
  const [selected, setSelected] = useState<Listing | null>(null)

  const { page, totalPages, pageItems, goTo } = usePagination(listings, PAGE_SIZE)

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Marketplace"
        title="For Sale"
        description="Melee, distance, and magic-build accounts, listed by Leblanc."
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((listing) => (
          <ListingCard key={listing.id} listing={listing} onSelect={setSelected} />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={goTo} className="mt-12" />

      <ListingModal listing={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
