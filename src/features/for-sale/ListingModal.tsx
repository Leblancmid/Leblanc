import { useEffect, useState } from 'react'
import { Check, Copy, Layers, MessageCircle, Phone, ShoppingCart, Tag } from 'lucide-react'
import { Modal } from '@/components/modals/Modal'
import { buttonClasses } from '@/components/ui/Button'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { DISCORD_URL, WHATSAPP_URL } from '@/lib/links'
import { categoryMeta, listingReference, listingTitle } from '@/lib/listings'
import type { Listing } from '@/types'
import { SkillBars } from './SkillBars'
import { InquiryForm } from './InquiryForm'
import { trackListingView } from '@/lib/track'

interface ListingModalProps {
  listing: Listing | null
  onClose: () => void
}

export function ListingModal({ listing, onClose }: ListingModalProps) {
  const { copied, copy } = useCopyToClipboard()
  // Which listing the "I want this" form is open for (another listing starts closed)
  const [askingFor, setAskingFor] = useState<string | null>(null)

  // Count the view for the owner's stats (once per tab per listing)
  const listingId = listing?.id
  useEffect(() => { if (listingId) trackListingView(listingId) }, [listingId])

  if (!listing) return null
  const asking = askingFor === listing.id

  const reference = listingReference(listing)
  const facts = [
    { icon: Layers, label: 'Level', value: String(listing.level) },
    { icon: Tag, label: 'Price', value: listing.price ?? 'On request' },
  ]

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="lg"
      title={listingTitle(listing)}
      description={`${listing.category} build · Listed by Leblanc`}
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => copy(reference)}
            className="flex items-center justify-center gap-1.5 text-xs text-ink-400 transition-colors hover:text-gold-300"
          >
            {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
            {copied ? 'Reference copied' : `Mention ${reference} when you message`}
          </button>
          <div className="flex gap-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Message on WhatsApp"
              aria-label="Message on WhatsApp"
              className={buttonClasses('secondary', 'md', 'flex-1 sm:flex-none')}
            >
              <Phone className="size-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Message on Discord"
              aria-label="Message on Discord"
              className={buttonClasses('secondary', 'md', 'flex-1 sm:flex-none')}
            >
              <MessageCircle className="size-4" />
              <span className="hidden sm:inline">Discord</span>
            </a>
            {!asking && (
              <button
                type="button"
                onClick={() => setAskingFor(listing.id)}
                className={buttonClasses('primary', 'md', 'flex-[2] sm:flex-none')}
              >
                <ShoppingCart className="size-4" />
                I want this
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {asking && <InquiryForm key={listing.id} listing={listing} onCancel={() => setAskingFor(null)} />}

        {listing.image && (
          <a href={listing.image} target="_blank" rel="noopener noreferrer" title="Open full-size screenshot">
            <img
              src={listing.image}
              alt={`${listingTitle(listing)} stats screen`}
              className="w-full rounded-lg border border-ink-700"
            />
          </a>
        )}

        <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
          <dl className="grid grid-cols-3 gap-2 sm:grid-cols-1">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex flex-col gap-0.5 rounded-lg border border-ink-700 bg-ink-800/40 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink-400">
                  <fact.icon className="size-3.5" />
                  {fact.label}
                </dt>
                <dd className="text-sm font-semibold text-ink-100">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {listing.stats && (
            <div className="rounded-lg border border-ink-700 bg-ink-800/40 p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                Base skills
              </p>
              <SkillBars stats={listing.stats} highlight={categoryMeta[listing.category].skill} />
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
