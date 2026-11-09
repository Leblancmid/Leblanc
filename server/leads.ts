import type { Env } from './http'

export type LeadType = 'account' | 'gold' | 'sell'
export const LEAD_STATUSES = ['new', 'contacted', 'won', 'lost'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

/**
 * Remember a lead (an inquiry, gold order or account offer) so the Budget Tracker app can track
 * it: new → contacted → won / lost. Never throws: Discord still gets it if this fails.
 */
export async function saveLead(env: Env, lead: {
  type: LeadType
  name: string
  method: string
  contact: string
  listingId?: string | null
  details: Record<string, unknown>
}): Promise<boolean> {
  if (!env.DB) return false
  try {
    const now = Date.now()
    await env.DB.prepare(
      'INSERT INTO leads (type, status, name, method, contact, listing_id, details, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    ).bind(lead.type, 'new', lead.name, lead.method, lead.contact, lead.listingId ?? null, JSON.stringify(lead.details), now, now).run()
    return true
  } catch {
    return false
  }
}
