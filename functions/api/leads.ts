/**
 * GET /api/leads: leads for the Budget Tracker app, newest first (private: needs STATS_TOKEN).
 */
import { authorized, json, type Context } from '../../server/http'

interface LeadRow {
  id: number
  type: string
  status: string
  name: string
  method: string
  contact: string
  listing_id: string | null
  details: string | null
  created_at: number
  updated_at: number
}

export const onRequestGet = async ({ request, env }: Context) => {
  if (!authorized(request, env)) return json({ message: 'Not allowed.' }, 401)
  if (!env.DB) return json({ message: 'The database is not connected yet.' }, 503)

  const { results } = await env.DB.prepare(
    'SELECT id, type, status, name, method, contact, listing_id, details, created_at, updated_at FROM leads ORDER BY created_at DESC LIMIT 300',
  ).all<LeadRow>()

  return json({
    leads: results.map((l) => {
      let details: unknown = {}
      try { details = l.details ? JSON.parse(l.details) : {} } catch { /* keep {} */ }
      return { ...l, details }
    }),
  })
}
