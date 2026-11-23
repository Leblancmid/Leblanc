import type { Env } from './http'

/**
 * Buyer reviews. The Budget Tracker app gives each sale a review link, /review?t=<token>, signed
 * with the STATS_TOKEN both sides share, so only real sales can be reviewed, each once. Reviews wait
 * for approval in the app before they show on the site.
 *
 * Token: base64url(JSON {s: sale id, l: what was bought, e: expiry ms}) + "." + base64url(HMAC-SHA256).
 */
export interface ReviewTicket {
  /** The sale in the app (one review per sale) */
  saleId: number
  /** What was bought, e.g. "Lv 650 Melee" or "Gold" */
  label: string
}

export const REVIEW_STATUSES = ['pending', 'approved', 'hidden'] as const
export type ReviewStatus = (typeof REVIEW_STATUSES)[number]

const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const fromB64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))

/** The sale a review link is for, or null when it's forged, damaged or expired. */
export async function readTicket(token: unknown, env: Env): Promise<ReviewTicket | null> {
  const secret = env.STATS_TOKEN
  if (typeof token !== 'string' || token.length > 600 || !secret || secret.length < 32) return null
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null

  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const expected = b64url(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))))
  // Compare without stopping at the first difference
  if (expected.length !== sig.length) return null
  let diff = 0
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i)
  if (diff !== 0) return null

  try {
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as { s?: unknown; l?: unknown; e?: unknown }
    if (!Number.isInteger(data.s) || typeof data.l !== 'string' || typeof data.e !== 'number' || data.e < Date.now()) return null
    return { saleId: data.s as number, label: data.l.slice(0, 60) }
  } catch {
    return null
  }
}

/** How a reviewer's name shows publicly: first name, plus the next word's initial ("John S.") */
export function publicName(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return 'A buyer'
  return words.length > 1 ? `${words[0]} ${words[1][0].toUpperCase()}.` : words[0]
}
