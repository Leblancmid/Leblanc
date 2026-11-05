/**
 * DELETE /api/alerts/:id: remove a "Notify me" request (e.g. the buyer already bought, or
 * changed their mind). Called by the Budget Tracker app; private: needs STATS_TOKEN.
 */
import { authorized, json, type Context } from '../../../server/http'

export const onRequestDelete = async ({ request, env, params }: Context & { params: { id?: string } }) => {
  if (!authorized(request, env)) return json({ message: 'Not allowed.' }, 401)
  if (!env.DB) return json({ message: 'The database is not connected yet.' }, 503)

  const id = Number(params.id)
  if (!Number.isInteger(id) || id < 1) return json({ message: 'Invalid request.' }, 400)

  const found = await env.DB.prepare('SELECT id FROM alerts WHERE id = ?').bind(id).first<{ id: number }>()
  if (!found) return json({ message: 'That request no longer exists.' }, 404)

  await env.DB.batch([
    env.DB.prepare('DELETE FROM alert_hits WHERE alert_id = ?').bind(id),
    env.DB.prepare('DELETE FROM alerts WHERE id = ?').bind(id),
  ])
  return json({ ok: true })
}
