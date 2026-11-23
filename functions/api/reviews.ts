/**
 * GET /api/reviews: the approved reviews for the site (newest first, first names only) and the
 * average rating. With the Budget Tracker app's token and ?all=1: every review, for approving.
 */
import { authorized, json, type Context } from '../../server/http'
import { publicName } from '../../server/reviews'

interface ReviewRow {
  id: number
  sale_id: number
  item: string
  name: string
  rating: number
  message: string
  status: string
  created_at: number
}

export const onRequestGet = async ({ request, env }: Context) => {
  const all = new URL(request.url).searchParams.get('all') === '1'
  if (all && !authorized(request, env)) return json({ message: 'Not allowed.' }, 401)
  // Not set up yet (no database or no reviews table): no reviews, never an error on the site
  if (!env.DB) return json(all ? { reviews: [] } : { reviews: [], count: 0, average: null })

  if (all) {
    const rows = await env.DB.prepare('SELECT * FROM reviews ORDER BY created_at DESC LIMIT 300').all<ReviewRow>()
      .catch(() => ({ results: [] as ReviewRow[] }))
    return json({ reviews: rows.results })
  }

  const [rows, stats] = await Promise.all([
    env.DB.prepare("SELECT id, item, name, rating, message, created_at FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT 30")
      .all<ReviewRow>().catch(() => ({ results: [] as ReviewRow[] })),
    env.DB.prepare("SELECT COUNT(*) AS n, AVG(rating) AS avg FROM reviews WHERE status = 'approved'")
      .first<{ n: number; avg: number | null }>().catch(() => null),
  ])
  return new Response(JSON.stringify({
    reviews: rows.results.map((r) => ({ id: r.id, item: r.item, name: publicName(r.name), rating: r.rating, message: r.message, created_at: r.created_at })),
    count: stats?.n ?? 0,
    average: stats?.avg != null ? Math.round(stats.avg * 10) / 10 : null,
  }), { headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=300' } })
}
