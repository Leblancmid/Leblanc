import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { track } from '@/lib/track'

/** While the tab is visible, say "still here" this often (for "online now"). */
const HEARTBEAT_MS = 60_000

/** Counts page views and keeps "online now" up to date. Renders nothing. */
export function VisitTracker() {
  const { pathname } = useLocation()

  useEffect(() => { track('pageview') }, [pathname])

  useEffect(() => {
    const beat = () => { if (document.visibilityState === 'visible') track('ping') }
    const timer = window.setInterval(beat, HEARTBEAT_MS)
    document.addEventListener('visibilitychange', beat)
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', beat) }
  }, [])

  return null
}
