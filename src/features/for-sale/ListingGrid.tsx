import type { To } from 'react-router-dom'
import { Pagination } from '@/components/pagination/Pagination'
import { usePagination } from '@/hooks/usePagination'
import type { Listing } from '@/types'
import { ListingCard } from './ListingCard'

const PAGE_SIZE = 9

interface ListingGridProps {
  listings: Listing[]
  linkTo: (listing: Listing) => To
}

/** Give it a `key` tied to the active filter so pagination restarts at page 1 when it changes. */
export function ListingGrid({ listings, linkTo }: ListingGridProps) {
  const { page, totalPages, pageItems, goTo } = usePagination(listings, PAGE_SIZE)

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((listing) => (
          <ListingCard key={listing.id} listing={listing} to={linkTo(listing)} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={goTo} className="mt-10" />
    </>
  )
}
