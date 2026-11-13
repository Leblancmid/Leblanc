import { useCallback, useRef, useState, type MouseEvent } from 'react'
import { Check, Link2, Phone, Share2, ThumbsUp } from 'lucide-react'
import { buttonClasses } from '@/components/ui/Button'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { cn } from '@/lib/cn'
import { canShareNatively, listingShareText, listingShareUrl, shareLinks } from '@/lib/share'
import type { Listing } from '@/types'

/**
 * Share a listing with a friend. On phones it opens the phone's own share sheet; elsewhere a small
 * menu with Copy link (for Discord), WhatsApp and Facebook.
 *
 * `compact`: just the icon, for the corner of a listing card. `up`: the menu opens upward (in a footer).
 */
export function ShareButton({ listing, compact = false, up = false, className }: { listing: Listing; compact?: boolean; up?: boolean; className?: string }) {
  const [open, setOpen] = useState(false)
  const { copied, copy } = useCopyToClipboard()
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useClickOutside(ref, open, close)
  useEscapeKey(open, close)

  const onClick = async (e: MouseEvent) => {
    // On a card, don't also open the listing behind the button
    e.preventDefault()
    e.stopPropagation()
    if (canShareNatively()) {
      try {
        await navigator.share({ title: listingShareText(listing), text: listingShareText(listing), url: listingShareUrl(listing) })
        return
      } catch (err) {
        // Closed the share sheet: nothing to do. Anything else: fall back to the menu.
        if (err instanceof DOMException && err.name === 'AbortError') return
      }
    }
    setOpen((v) => !v)
  }

  const links = shareLinks(listing)
  const item = 'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-ink-200 transition-colors hover:bg-ink-800 hover:text-gold-300'

  return (
    <div ref={ref} className={cn('relative', className)} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={onClick}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Share this account"
        title="Share this account"
        className={compact
          ? 'flex size-9 items-center justify-center rounded-full border border-ink-600/80 bg-ink-950/85 text-ink-200 backdrop-blur-sm transition-colors hover:border-gold-500/60 hover:text-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400'
          : buttonClasses('secondary', 'md', 'w-full px-0 sm:w-10')}
      >
        <Share2 className="size-4" />

      </button>

      {open && (
        <div role="menu" className={cn('absolute right-0 z-30 w-60', up ? 'bottom-full mb-2' : 'top-full mt-2', 'rounded-lg border border-ink-700 bg-ink-900 p-1 shadow-xl shadow-black/50')}>
          <button
            type="button"
            role="menuitem"
            className={item}
            onClick={(e) => { e.preventDefault(); copy(listingShareUrl(listing)) }}
          >
            {copied ? <Check className="size-4 text-emerald-400" /> : <Link2 className="size-4" />}
            {copied ? 'Link copied' : 'Copy link (for Discord)'}
          </button>
          <a role="menuitem" href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={item} onClick={close}>
            <Phone className="size-4" />
            WhatsApp
          </a>
          <a role="menuitem" href={links.facebook} target="_blank" rel="noopener noreferrer" className={item} onClick={close}>
            <ThumbsUp className="size-4" />
            Facebook
          </a>
        </div>
      )}
    </div>
  )
}
