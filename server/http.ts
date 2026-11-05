/**
 * Helpers shared by the Cloudflare Pages Functions in functions/. Kept outside functions/
 * so Cloudflare doesn't turn them into URLs.
 */

/** The parts of Cloudflare's D1 database API the functions use. */
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = Record<string, unknown>>(): Promise<T | null>
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>
  run(): Promise<unknown>
}
export interface D1Database {
  prepare(sql: string): D1PreparedStatement
  batch(statements: D1PreparedStatement[]): Promise<unknown[]>
}

export interface Env {
  /** D1 database binding (Pages project → Settings → Bindings → D1, name "DB") */
  DB?: D1Database
  /** Private #inquiries webhook */
  DISCORD_WEBHOOK_URL?: string
  /** Shared with the Budget Tracker app: lets it read stats and send "notify me" matches */
  STATS_TOKEN?: string
}

export interface Context {
  request: Request
  env: Env
}

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

/** Requests from this website's own pages (a browser always sends Origin on POST). */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  return !origin || new URL(origin).host === new URL(request.url).host
}

/** The JSON body, or null if it's too big or not JSON. */
export async function readJson(request: Request, maxBytes: number): Promise<Record<string, unknown> | null> {
  const text = await request.text()
  if (text.length > maxBytes) return null
  try {
    const v = JSON.parse(text)
    return v && typeof v === 'object' ? (v as Record<string, unknown>) : null
  } catch {
    return null
  }
}

/** "Bearer <STATS_TOKEN>" from the Budget Tracker app, compared in constant time. */
export function authorized(request: Request, env: Env): boolean {
  const token = env.STATS_TOKEN
  const given = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  if (!token || token.length < 32 || given.length !== token.length) return false
  let diff = 0
  for (let i = 0; i < token.length; i++) diff |= token.charCodeAt(i) ^ given.charCodeAt(i)
  return diff === 0
}

/** Today's date (Y-m-d) in Manila. The server clock is UTC, so shift it by +8h first. */
export const manilaDay = (ms: number) => new Date(ms + 8 * 3600_000).toISOString().slice(0, 10)

/** Post to the private Discord channel; never pings anyone. */
export async function postToDiscord(env: Env, payload: Record<string, unknown>): Promise<boolean> {
  if (!env.DISCORD_WEBHOOK_URL) return false
  const res = await fetch(env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: 'Leblanc Website', allowed_mentions: { parse: [] }, ...payload }),
  })
  return res.ok
}

/** Spam bots fill the hidden "website" field or submit within a couple of seconds. */
export function looksLikeBot(raw: Record<string, unknown>): boolean {
  const openedAt = typeof raw.openedAt === 'number' ? raw.openedAt : 0
  return !!raw.website || (openedAt > 0 && Date.now() - openedAt < 2500)
}
