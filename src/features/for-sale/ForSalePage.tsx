import { useMemo, useState } from 'react'
import { SearchX } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Pagination } from '@/components/pagination/Pagination'
import { ConfirmDialog } from '@/components/confirmation/ConfirmDialog'
import { usePagination } from '@/hooks/usePagination'
import { useDisclosure } from '@/hooks/useDisclosure'
import { listings } from '@/data/listings'
import type { Listing, ListingCategory } from '@/types'
import { ListingCard } from './ListingCard'
import { ListingModal } from './ListingModal'
import { CategoryFilter } from './CategoryFilter'

const PAGE_SIZE = 6

export function ForSalePage() {
  const [category, setCategory] = useState<ListingCategory | 'All'>('All')
  const [selected, setSelected] = useState<Listing | null>(null)
  const confirm = useDisclosure()

  const filtered = useMemo(
    () => (category === 'All' ? listings : listings.filter((l) => l.category === category)),
    [category],
  )

  const { page, totalPages, pageItems, goTo } = usePagination(filtered, PAGE_SIZE)

  const handleCategoryChange = (next: ListingCategory | 'All') => {
    setCategory(next)
    goTo(1)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Marketplace"
        title="For Sale"
        description="Vehicles, properties, collectibles, and standing retainers, listed by members and vetted by the house."
      />

      <div className="mt-8">
        <CategoryFilter active={category} onChange={handleCategoryChange} />
      </div>

      {pageItems.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 py-16 text-center text-ink-400">
          <SearchX className="size-8" />
          <p>No listings in this category right now.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onSelect={setSelected} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={goTo} className="mt-12" />

      <ListingModal
        listing={selected}
        onClose={() => setSelected(null)}
        onInquire={() => confirm.open()}
      />

      <ConfirmDialog
        isOpen={confirm.isOpen}
        onClose={confirm.close}
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 900))
        }}
        title={selected ? `Inquire about ${selected.title}?` : 'Send inquiry?'}
        description="The house will pass your details to the seller and arrange a private introduction. No payment is taken now."
        confirmLabel="Send inquiry"
        successMessage="Your inquiry has been sent. The seller will be in touch through the house."
      />
    </div>
  )
}
