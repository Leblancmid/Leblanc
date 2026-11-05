/**
 * POST /api/alerts/dispatch: called by the Budget Tracker app right after "Publish to website"
 * (private: needs STATS_TOKEN). Body: { listings: [{ id, category, level, price? }] }.
 * For each listing that matches someone's "Notify me" request (and hasn't been matched with
 * them before), posts who to message to #inquiries.
 */
import { alertMatches, describeAlert } from '../../../src/lib/alerts'
import { contactMarkdown, parseMethod } from '../../../src/lib/inquiry'
import { authorized, json, postToDiscord, readJson, type Context } from '../../../server/http'

interface AlertRow {
  id: number
  name: string
  method: string
  contact: string
  category: string | null
  min_level: number
  max_level: number | null
}

interface IncomingListing {
  id: string
  category: string
  level: number
  price?: string
}

const asListing = (v: unknown): IncomingListing | null => {
  const l = v as Record<string, unknown>
  return l && typeof l.id === 'string' && /^[a-z0-9-]{1,40}$/i.test(l.id) && typeof l.category === 'string' && typeof l.level === 'number'
    ? { id: l.id, category: l.category, level: l.level, price: typeof l.price === 'string' ? l.price : undefined }
    : null
}

export const onRequestPost = async ({ request, env }: Context) => {
  if (!authorized(request, env)) return json({ message: 'Not allowed.' }, 401)
  if (!env.DB) return json({ message: 'The database is not connected yet.' }, 503)

  const body = await readJson(request, 200_000)
  const listings = Array.isArray(body?.listings) ? body.listings.map(asListing).filter((l): l is IncomingListing => !!l) : []

  const now = Date.now()
  const { results: alerts } = await env.DB.prepare(
    'SELECT id, name, method, contact, category, min_level, max_level FROM alerts WHERE expires_at > ?',
  ).bind(now).all<AlertRow>()
  const { results: hits } = await env.DB.prepare('SELECT alert_id, listing_id FROM alert_hits').all<{ alert_id: number; listing_id: string }>()
  const seen = new Set(hits.map((h) => `${h.alert_id}:${h.listing_id}`))

  let matched = 0
  const origin = new URL(request.url).origin
  for (const listing of listings) {
    const fresh = alerts.filter((a) => alertMatches(a, listing) && !seen.has(`${a.id}:${listing.id}`))
    if (fresh.length === 0) continue

    // One line per buyer, even if they asked in more than one way
    const byBuyer = new Map<string, AlertRow>()
    for (const a of fresh) byBuyer.set(`${a.method}:${a.contact.toLowerCase()}`, byBuyer.get(`${a.method}:${a.contact.toLowerCase()}`) ?? a)
    const buyers = [...byBuyer.values()]
    const lines = buyers.map((a) =>
      `• **${a.name}** (wants ${describeAlert({ category: a.category as never, minLevel: a.min_level, maxLevel: a.max_level })}) · ${contactMarkdown(parseMethod(a.method), a.contact)}`)
    let description = ''
    for (const line of lines) {
      if (description.length + line.length > 3800) { description += `\n…and ${lines.length - lines.indexOf(line)} more`; break }
      description += (description ? '\n' : '') + line
    }
    const posted = await postToDiscord(env, {
      embeds: [{
        title: `🔔 Lv ${listing.level} ${listing.category}${listing.price ? ` · ${listing.price}` : ''}: ${buyers.length} buyer${buyers.length === 1 ? '' : 's'} asked for this`,
        url: `${origin}/for-sale?listing=${encodeURIComponent(listing.id)}`,
        description: `Message them:\n${description}`,
        color: 0x22c55e,
        footer: { text: `Ref ${listing.id.toUpperCase()}` },
        timestamp: new Date(now).toISOString(),
      }],
    })
    // Only remember it once you were actually told, so a failed post is retried next publish
    if (posted) {
      await env.DB.batch(fresh.map((a) => env.DB!.prepare('INSERT OR IGNORE INTO alert_hits (alert_id, listing_id) VALUES (?, ?)').bind(a.id, listing.id)))
      matched += fresh.length
    }
  }

  // Tidy up requests that expired a while ago
  await env.DB.prepare('DELETE FROM alerts WHERE expires_at < ?').bind(now - 30 * 86_400_000).run()

  return json({ matched })
}
