import { Check, Copy, Heart, Layers, MessageCircle, Phone, Tag } from 'lucide-react'
import { Modal } from '@/components/modals/Modal'
import { buttonClasses } from '@/components/ui/Button'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { DISCORD_URL, WHATSAPP_URL } from '@/lib/links'
import { categoryMeta, listingReference, listingTitle } from '@/lib/listings'
import { formatNumber } from '@/lib/format'
import type { Listing } from '@/types'
import { SkillBars } from './SkillBars'

interface ListingModalProps {
  listing: Listing | null
  onClose: () => void
}

export function ListingModal({ listing, onClose }: ListingModalProps) {
  const { copied, copy } = useCopyToClipboard()

  if (!listing) return null

  const reference = listingReference(listing)
  const facts = [
    { icon: Layers, label: 'Level', value: String(listing.level) },
    { icon: Heart, label: 'HP', value: listing.hp ? formatNumber(listing.hp) : '—' },
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
              className={buttonClasses('secondary', 'md', 'flex-1 sm:flex-none')}
            >
              <Phone className="size-4" />
              WhatsApp
            </a>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses('primary', 'md', 'flex-1 sm:flex-none')}
            >
              <MessageCircle className="size-4" />
              Inquire on Discord
            </a>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
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
