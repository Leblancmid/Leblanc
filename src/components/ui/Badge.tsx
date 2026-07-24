import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type BadgeTone =
  | 'gold'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'blue'
  | 'purple'
  | 'green'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

const toneClasses: Record<BadgeTone, string> = {
  gold: 'bg-gold-500/10 text-gold-300 border-gold-500/30',
  neutral: 'bg-ink-700/60 text-ink-200 border-ink-500/40',
  success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  danger: 'bg-red-500/10 text-red-300 border-red-500/30',
  blue: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  purple: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  green: 'bg-green-500/10 text-green-300 border-green-500/30',
}

export function Badge({ className, tone = 'neutral', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider',
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
