import type { Listing } from '@/types'
import data from './listings.json'

/**
 * Accounts for sale. listings.json is written by the Budget Tracker app
 * (Business → Listing Kit → Publish to website), so don't edit it by hand:
 * the next publish replaces it.
 */
export const listings = data as Listing[]
