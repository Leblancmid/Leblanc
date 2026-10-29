import type { ReactNode } from 'react'
import { ShieldAlert } from 'lucide-react'
import { DISCORD_HANDLE } from '@/lib/links'
import { cn } from '@/lib/cn'

interface TrustNoticeProps {
  action?: ReactNode
  className?: string
}

/** Anti-impersonation warning. Shown on Home and Information so nobody misses it. */
export function TrustNotice({ action, className }: TrustNoticeProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-gold-500/30 bg-gold-500/[0.06] p-5 sm:flex-row sm:items-center',
        className,
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300">
        <ShieldAlert className="size-5" />
      </span>
      <div className="flex-1">
        <p className="font-medium text-ink-100">
          Only trust <span className="text-gold-300">{DISCORD_HANDLE}</span> on Discord
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-300">
          Leblanc trades exclusively through this one account. If anyone else claims to be
          Leblanc, it isn't — verify before you send anything.
        </p>
      </div>
      {action}
    </div>
  )
}
