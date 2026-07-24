import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn('group flex items-center gap-2.5', className)}>
      <span className="flex size-8 items-center justify-center rounded-md border border-gold-500/40 bg-gradient-to-br from-ink-800 to-ink-900 font-display text-lg text-gold-400 transition-colors group-hover:border-gold-400">
        L
      </span>
      <span className="font-display text-xl tracking-wide text-ink-100">
        Leblanc
      </span>
    </Link>
  )
}
