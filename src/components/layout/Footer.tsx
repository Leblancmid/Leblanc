import { MessageCircle, Phone } from 'lucide-react'
import { Logo } from './Logo'
import { DISCORD_URL, DISCORD_HANDLE, WHATSAPP_URL, WHATSAPP_NUMBER } from '@/lib/links'

export function Footer() {
  return (
    <footer className="border-t border-ink-700/80 bg-ink-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-ink-400">
              Looking for a trusted middleman, or have an inquiry? Reach out directly.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-500">
              Also making websites for businesses, projects, or anything else — payable in Rucoy
              gold, $, or €.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-ink-300 transition-colors hover:text-gold-300"
              >
                <MessageCircle className="size-4 text-ink-500" />
                Discord — {DISCORD_HANDLE}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-ink-300 transition-colors hover:text-gold-300"
              >
                <Phone className="size-4 text-ink-500" />
                WhatsApp — {WHATSAPP_NUMBER}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse items-center justify-between gap-4 border-t border-ink-700/80 pt-6 sm:flex-row">
          <p className="text-xs text-ink-500">&copy; {new Date().getFullYear()} Leblanc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
