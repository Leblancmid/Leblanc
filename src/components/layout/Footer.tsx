import { Link } from 'react-router-dom'
import { Circle } from 'lucide-react'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-ink-700/80 bg-ink-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-ink-400">
              A private house for rare listings, quiet arrangements, and the people who know
              where to look.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Navigate
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ink-300">
                <li>
                  <Link to="/for-sale" className="transition-colors hover:text-gold-300">
                    For Sale
                  </Link>
                </li>
                <li>
                  <Link to="/information" className="transition-colors hover:text-gold-300">
                    Information
                  </Link>
                </li>
                <li>
                  <Link to="/server" className="transition-colors hover:text-gold-300">
                    Server
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                House
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ink-300">
                <li>
                  <Link to="/information" className="transition-colors hover:text-gold-300">
                    Guidelines
                  </Link>
                </li>
                <li>
                  <Link to="/information" className="transition-colors hover:text-gold-300">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/server" className="transition-colors hover:text-gold-300">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse items-center justify-between gap-4 border-t border-ink-700/80 pt-6 sm:flex-row">
          <p className="text-xs text-ink-500">&copy; {new Date().getFullYear()} Leblanc House. All rights reserved.</p>
          <Link
            to="/server"
            className="flex items-center gap-1.5 text-xs text-ink-400 transition-colors hover:text-gold-300"
          >
            <Circle className="size-2 fill-emerald-400 text-emerald-400" />
            All systems operational
          </Link>
        </div>
      </div>
    </footer>
  )
}
