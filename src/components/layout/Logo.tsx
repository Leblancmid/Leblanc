import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn('group flex items-center gap-2.5', className)}>
      <img
        src="/icons/icon-64.png"
        alt=""
        width={36}
        height={36}
        className="size-9 rounded-full transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.45)]"
      />
      <span className="font-display text-xl tracking-wide text-ink-100">
        Leblanc
      </span>
    </Link>
  )
}
