import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

export function Card({ className, interactive, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-ink-700 bg-ink-900/60 backdrop-blur-sm',
        interactive &&
          'transition-all duration-200 hover:border-gold-500/40 hover:bg-ink-800/60 hover:shadow-[0_0_0_1px_rgba(212,165,74,0.15),0_12px_32px_-12px_rgba(0,0,0,0.6)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
