/**
 * PATCH /api/leads/:id { status }: new → contacted → won / lost, set from the Budget Tracker
 * app (private: needs STATS_TOKEN).
 */
import { authorized, json, readJson, type Context } from '../../../server/http'
import { LEAD_STATUSES } from '../../../server/leads'

export const onRequestPatch = async ({ request, env, params }: Context & { params: { id?: string } }) => {
  if (!authorized(request, env)) return json({ message: 'Not allowed.' }, 401)
  if (!env.DB) return json({ message: 'The database is not connected yet.' }, 503)

  const id = Number(params.id)
  const body = await readJson(request, 500)
  const status = body?.status
  if (!Number.isInteger(id) || id < 1 || !(LEAD_STATUSES as readonly unknown[]).includes(status)) {
    return json({ message: 'Invalid request.' }, 400)
  }

  const found = await env.DB.prepare('SELECT id FROM leads WHERE id = ?').bind(id).first<{ id: number }>()
  if (!found) return json({ message: 'That lead no longer exists.' }, 404)

  await env.DB.prepare('UPDATE leads SET status = ?, updated_at = ? WHERE id = ?').bind(status, Date.now(), id).run()
  return json({ ok: true })
}
