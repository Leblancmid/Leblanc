import { useEffect, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { BellRing, SearchX, Zap } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { listings } from '@/data/listings'
import { BUYING_LEVEL_RANGE } from '@/data/site'
import {
  LISTING_CATEGORIES,
  SORT_OPTIONS,
  filterAndSortListings,
  parseCategory,
  parseSort,
} from '@/lib/listings'
import { cn } from '@/lib/cn'
import type { Listing, ListingCategory } from '@/types'
import { ListingGrid } from './ListingGrid'
import { ListingModal } from './ListingModal'
import { AlertForm } from './AlertForm'
import { RecentlySold } from './RecentlySold'
import { SellOfferForm } from './SellOfferForm'
import { replyTime, siteStats, trackingSinceLabel } from '@/data/published'

const filters: { label: string; value: ListingCategory | null }[] = [
  { label: 'All', value: null },
  ...LISTING_CATEGORIES.map((c) => ({ label: c, value: c })),
]

const countFor = (category: ListingCategory | null) =>
  category ? listings.filter((l) => l.category === category).length : listings.length

export function ForSalePage() {
  const [params, setParams] = useSearchParams()
  const category = parseCategory(params.get('build'))
  const sort = parseSort(params.get('sort'))
  const selected = listings.find((l) => l.id === params.get('listing')) ?? null

  const visible = useMemo(() => filterAndSortListings(listings, category, sort), [category, sort])

  // "/for-sale#sell" (the home page's "Get an offer") jumps to the sell form
  const { hash } = useLocation()
  useEffect(() => {
    if (hash === '#sell') document.getElementById('sell')?.scrollIntoView({ behavior: 'smooth' })
    if (hash === '#notify') document.getElementById('notify')?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  // "Get notified": open the alert form and bring it into view
  const [alertRequest, setAlertRequest] = useState(() => (hash === '#notify' ? 1 : 0))
  const notifyMe = () => {
    setAlertRequest((n) => n + 1)
    requestAnimationFrame(() => document.getElementById('notify')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const updateParams = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    Object.entries(changes).forEach(([key, value]) => {
      if (value === null) next.delete(key)
      else next.set(key, value)
    })
    setParams(next, { replace: true, preventScrollReset: true })
  }

  // Opening a listing pushes history, so the browser Back button closes the dialog.
  const linkTo = (listing: Listing) => {
    const next = new URLSearchParams(params)
    next.set('listing', listing.id)
    return { search: `?${next}` }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Marketplace"
        title="Accounts for sale"
        description={`Melee, distance, and magic builds listed by Leblanc. Selling instead? Leblanc is buying Lv. ${BUYING_LEVEL_RANGE} accounts.`}
      />
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-400">
        {siteStats.accounts_sold > 0 && (
          <p>
            <span className="font-semibold text-gold-300">{siteStats.accounts_sold} accounts sold</span>
            {trackingSinceLabel && <> since {trackingSinceLabel}</>}
            {siteStats.gold_trades > 0 && <> · {siteStats.gold_trades} gold trades</>}
          </p>
        )}
        {replyTime && (
          <p className="flex items-center gap-1.5"><Zap className="size-3.5 text-gold-400" /> Usually replies {replyTime}</p>
        )}
        <button type="button" onClick={notifyMe} className="flex items-center gap-1.5 font-medium text-gold-300 transition-colors hover:text-gold-200">
          <BellRing className="size-3.5" /> Get notified when your build is listed
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-y border-ink-700/80 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Filter by build"
          className="scroll-thin -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5"
        >
          {filters.map((filter) => {
            const active = filter.value === category
            return (
              <button
                key={filter.label}
                type="button"
                aria-pressed={active}
                onClick={() => updateParams({ build: filter.value?.toLowerCase() ?? null })}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'border-gold-500/60 bg-gold-500/10 text-gold-300'
                    : 'border-ink-600 text-ink-300 hover:border-ink-500 hover:text-ink-100',
                )}
              >
                {filter.label}
                <span
                  className={cn('text-xs tabular-nums', active ? 'text-gold-400' : 'text-ink-400')}
                >
                  {countFor(filter.value)}
                </span>
              </button>
            )
          })}
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-400">
          Sort
          <select
            value={sort}
            onChange={(e) =>
              updateParams({ sort: e.target.value === 'level-desc' ? null : e.target.value })
            }
            className="h-9 rounded-md border border-ink-600 bg-ink-800 px-3 text-sm text-ink-100 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8">
        {visible.length > 0 ? (
          <ListingGrid key={`${category}-${sort}`} listings={visible} linkTo={linkTo} />
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-ink-600 px-6 py-16 text-center">
            <SearchX className="size-8 text-ink-400" />
            <p className="font-medium text-ink-100">
              No {category?.toLowerCase()} accounts listed right now
            </p>
            <p className="max-w-sm text-sm text-ink-400">
              New accounts are listed regularly. Ask on Discord if you're after a specific build.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => updateParams({ build: null })}>
                Show all accounts
              </Button>
              <Button size="sm" onClick={notifyMe}>
                <BellRing className="size-3.5" /> Notify me when one is listed
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-col gap-4">
        <RecentlySold />
        <div id="notify" className="scroll-mt-24">
          <AlertForm defaultCategory={category} openRequest={alertRequest} />
        </div>
        <SellOfferForm />
      </div>

      <ListingModal listing={selected} onClose={() => updateParams({ listing: null })} />
    </div>
  )
}
