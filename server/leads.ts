import type { Env } from './http'

/**
 * account: wants one of your accounts · gold: buying gold · sell: selling you an account ·
 * sell_gold: selling you gold · project: wants a website built
 */
export type LeadType = 'account' | 'gold' | 'sell' | 'sell_gold' | 'project'
export const LEAD_STATUSES = ['new', 'contacted', 'won', 'lost'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

/** A Discord server's tag, e.g. "d-3fa9c2" (see src/lib/source.ts) */
const SOURCE_TAG = /^[a-z0-9-]{1,24}$/

/** The Discord server a request came through (the forms send it as x-lb-from), or null. */
export function sourceOf(request: Request): string | null {
  const tag = (request.headers.get('x-lb-from') ?? '').toLowerCase()
  return SOURCE_TAG.test(tag) ? tag : null
}

/**
 * Remember a lead (an inquiry, gold order or account offer) so the Budget Tracker app can track
 * it: new → contacted → won / lost. Never throws: Discord still gets it if this fails.
 * source: the Discord server the buyer came from, kept in details as "from".
 */
export async function saveLead(env: Env, lead: {
  type: LeadType
  name: string
  method: string
  contact: string
  listingId?: string | null
  details: Record<string, unknown>
  source?: string | null
}): Promise<boolean> {
  if (!env.DB) return false
  try {
    const now = Date.now()
    const details = lead.source ? { ...lead.details, from: lead.source } : lead.details
    await env.DB.prepare(
      'INSERT INTO leads (type, status, name, method, contact, listing_id, details, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    ).bind(lead.type, 'new', lead.name, lead.method, lead.contact, lead.listingId ?? null, JSON.stringify(details), now, now).run()
    return true
  } catch {
    return false
  }
}
