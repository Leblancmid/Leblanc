import { Link } from 'react-router-dom'
import { MessageCircle, Phone } from 'lucide-react'
import { Logo } from './Logo'
import { navItems } from '@/lib/nav'
import { DISCORD_URL, DISCORD_HANDLE, WHATSAPP_URL, WHATSAPP_NUMBER } from '@/lib/links'
import { HIGHEST_TRADE, YOUTUBE_SUBSCRIBERS, totalDiscordMembers } from '@/data/site'
import { formatCompactPlus } from '@/lib/format'

const contactLinks = [
  { label: `Discord — ${DISCORD_HANDLE}`, href: DISCORD_URL, icon: MessageCircle },
  { label: `WhatsApp — ${WHATSAPP_NUMBER}`, href: WHATSAPP_URL, icon: Phone },
]

export function Footer() {
  return (
    <footer className="border-t border-ink-700/80 bg-ink-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              Trusted middleman for Rucoy accounts, gold, and items.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink-400">
              Also building websites for businesses and projects — this site is an example.
              Payable in Rucoy gold, $, or €.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Explore</p>
            <div className="mt-3 flex flex-col gap-2">
              {navItems.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-ink-300 transition-colors hover:text-gold-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Contact</p>
            <div className="mt-3 flex flex-col gap-2">
              {contactLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-ink-300 transition-colors hover:text-gold-300"
                >
                  <link.icon className="size-4 text-ink-400" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse items-center justify-between gap-3 border-t border-ink-700/80 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-ink-400">
            &copy; {new Date().getFullYear()} Leblanc. All rights reserved.
          </p>
          <p className="text-xs text-ink-400">
            {HIGHEST_TRADE} highest trade · {formatCompactPlus(totalDiscordMembers)} Discord members
            · {YOUTUBE_SUBSCRIBERS} YouTube subscribers
          </p>
        </div>
      </div>
    </footer>
  )
}
