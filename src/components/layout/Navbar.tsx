import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Circle } from 'lucide-react'
import { Logo } from './Logo'
import { cn } from '@/lib/cn'

const navItems = [
  { label: 'For Sale', to: '/for-sale' },
  { label: 'Information', to: '/information' },
  { label: 'Server', to: '/server' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/80 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-4 py-2 text-sm font-medium tracking-wide transition-colors',
                  isActive
                    ? 'text-gold-300'
                    : 'text-ink-300 hover:text-ink-100',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <span className="flex items-center gap-1.5 rounded-full border border-ink-600 px-3 py-1.5 text-xs text-ink-300">
            <Circle className="size-2 fill-emerald-400 text-emerald-400" />
            Network online
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-md text-ink-200 md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-ink-700 bg-ink-950 px-4 pb-4 pt-2 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'block rounded-md px-3 py-2.5 text-sm font-medium',
                  isActive ? 'text-gold-300' : 'text-ink-300',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
