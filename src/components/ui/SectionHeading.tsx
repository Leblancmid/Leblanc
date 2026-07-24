import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-medium text-ink-100 sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-balance text-ink-300">{description}</p>}
    </div>
  )
}
