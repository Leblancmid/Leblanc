/**
 * PATCH /api/reviews/:id { status: approved | hidden | pending }: approve a review for the site, or
 * hide it, from the Budget Tracker app (private: needs STATS_TOKEN).
 */
import { authorized, json, readJson, type Context } from '../../../server/http'
import { REVIEW_STATUSES } from '../../../server/reviews'

export const onRequestPatch = async ({ request, env, params }: Context & { params: { id?: string } }) => {
  if (!authorized(request, env)) return json({ message: 'Not allowed.' }, 401)
  if (!env.DB) return json({ message: 'The database is not connected yet.' }, 503)

  const id = Number(params.id)
  const body = await readJson(request, 300)
  const status = body?.status
  if (!Number.isInteger(id) || id < 1 || !(REVIEW_STATUSES as readonly unknown[]).includes(status)) {
    return json({ message: 'Invalid request.' }, 400)
  }

  const found = await env.DB.prepare('SELECT id FROM reviews WHERE id = ?').bind(id).first<{ id: number }>()
  if (!found) return json({ message: 'That review no longer exists.' }, 404)

  await env.DB.prepare('UPDATE reviews SET status = ? WHERE id = ?').bind(status, id).run()
  return json({ ok: true })
}
