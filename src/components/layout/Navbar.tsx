import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, MessageCircle, X } from 'lucide-react'
import { Logo } from './Logo'
import { buttonClasses } from '@/components/ui/Button'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { DISCORD_URL } from '@/lib/links'
import { navItems } from '@/lib/nav'
import { cn } from '@/lib/cn'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const close = () => setMobileOpen(false)

  useEscapeKey(mobileOpen, close)

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/80 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Logo />

        <nav aria-label="Main" className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'relative rounded-md px-4 py-2 text-sm font-medium tracking-wide transition-colors',
                  isActive
                    ? 'text-gold-300 after:absolute after:inset-x-4 after:-bottom-[13px] after:h-px after:bg-gold-400'
                    : 'text-ink-300 hover:text-ink-100',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses('secondary', 'sm', 'hidden md:inline-flex')}
        >
          <MessageCircle className="size-3.5" />
          Contact
        </a>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-md text-ink-200 md:hidden"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-ink-700 bg-ink-950 px-4 pb-4 pt-2 animate-fade-in md:hidden"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={close}
              className={({ isActive }) =>
                cn(
                  'block rounded-md px-3 py-2.5 text-sm font-medium',
                  isActive ? 'bg-ink-800 text-gold-300' : 'text-ink-300',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses('primary', 'md', 'mt-3 w-full')}
          >
            <MessageCircle className="size-4" />
            Contact on Discord
          </a>
        </nav>
      )}
    </header>
  )
}
