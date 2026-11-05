/**
 * Anonymous visit counting for the owner's stats (functions/api/track.ts). The visitor ID is
 * random and kept in this browser; the session ID lasts while the tab is open. No cookies,
 * names or IPs.
 */

type TrackType = 'pageview' | 'ping' | 'listing'

const newId = () => (crypto.randomUUID?.() ?? `${Date.now()}${Math.random()}`).replace(/[^a-z0-9]/gi, '').slice(0, 32)

const memory: Record<string, string> = {}
function storedId(area: 'local' | 'session', key: string): string {
  try {
    const store = area === 'local' ? localStorage : sessionStorage
    let id = store.getItem(key)
    if (!id) { id = newId(); store.setItem(key, id) }
    return id
  } catch {
    // Storage blocked: count this page load only
    return (memory[key] ??= newId())
  }
}

export function track(type: TrackType, extra: Record<string, string> = {}): void {
  const body = JSON.stringify({
    type,
    visitor: storedId('local', 'lb_visitor'),
    session: storedId('session', 'lb_session'),
    path: location.pathname,
    ...extra,
  })
  // keepalive: still sent if the visitor is leaving the page
  fetch('/api/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {})
}

/** Count a listing's details being opened, once per tab. */
export function trackListingView(listingId: string): void {
  const key = `lb_viewed_${listingId}`
  try {
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
  } catch { /* count it anyway */ }
  track('listing', { listing: listingId })
}
