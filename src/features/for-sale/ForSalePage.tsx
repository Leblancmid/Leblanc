import { useState } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Pagination } from '@/components/pagination/Pagination'
import { ConfirmDialog } from '@/components/confirmation/ConfirmDialog'
import { usePagination } from '@/hooks/usePagination'
import { useDisclosure } from '@/hooks/useDisclosure'
import { listings } from '@/data/listings'
import type { Listing } from '@/types'
import { ListingCard } from './ListingCard'
import { ListingModal } from './ListingModal'

const PAGE_SIZE = 6

export function ForSalePage() {
  const [selected, setSelected] = useState<Listing | null>(null)
  const confirm = useDisclosure()

  const { page, totalPages, pageItems, goTo } = usePagination(listings, PAGE_SIZE)

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Marketplace"
        title="For Sale"
        description="Melee, distance, and magic-build accounts, listed by members and vetted by the house."
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((listing) => (
          <ListingCard key={listing.id} listing={listing} onSelect={setSelected} />
        ))}
      </div>

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
