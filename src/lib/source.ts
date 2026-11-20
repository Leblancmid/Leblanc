/**
 * Which Discord server a visitor came from: your listing posts link here with ?from=<tag> (one
 * tag per server, set by the Budget Tracker app). The tag is kept in this browser for 30 days, so
 * a request sent on a later visit still counts for that server. The newest tag wins. Nothing
 * personal: just the server's tag.
 */

const KEY = 'lb_from'
const KEEP_MS = 30 * 86_400_000
export const SOURCE_TAG = /^[a-z0-9-]{1,24}$/

/** On load: remember ?from= and take it out of the address (so shared links don't carry it). */
export function captureSource(): void {
  try {
    const url = new URL(location.href)
    const tag = url.searchParams.get('from')?.toLowerCase() ?? ''
    if (!SOURCE_TAG.test(tag)) return
    localStorage.setItem(KEY, JSON.stringify({ tag, at: Date.now() }))
    url.searchParams.delete('from')
    history.replaceState(history.state, '', url.pathname + url.search + url.hash)
  } catch { /* storage or history blocked: not counted */ }
}

/** The server this visitor came from in the last 30 days, or null. */
export function currentSource(): string | null {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') as { tag?: unknown; at?: unknown } | null
    if (!saved || typeof saved.tag !== 'string' || !SOURCE_TAG.test(saved.tag)) return null
    if (typeof saved.at !== 'number' || Date.now() - saved.at > KEEP_MS) return null
    return saved.tag
  } catch {
    return null
  }
}

/** Header for the request forms, so a request counts for the server the buyer came from. */
export function sourceHeader(): Record<string, string> {
  const tag = currentSource()
  return tag ? { 'x-lb-from': tag } : {}
}
