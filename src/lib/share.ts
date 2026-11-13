import type { Listing } from '@/types'
import { listingPath } from './listings'

/** The full link to a listing. Pasted in a chat, it shows a preview with the stats screen. */
export const listingShareUrl = (listing: Listing) => `${location.origin}${listingPath(listing.id)}`

/** The message that goes with the link. */
export const listingShareText = (listing: Listing) =>
  `Lv ${listing.level} ${listing.category} account for sale${listing.price ? ` · ${listing.price}` : ''} on Leblanc`

/** Phones (and some browsers) have their own share sheet: Messenger, Discord, WhatsApp… */
export const canShareNatively = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function'

/** Share links for when there's no share sheet (most computers). */
export function shareLinks(listing: Listing) {
  const url = listingShareUrl(listing)
  const text = listingShareText(listing)
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text}: ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  }
}
