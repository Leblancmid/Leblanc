import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'

/** 1–5 stars, shown (read-only) or picked (onChange) */
export function StarRating({ value, onChange, size = 'sm', className }: {
  value: number
  onChange?: (v: number) => void
  size?: 'sm' | 'lg'
  className?: string
}) {
  const px = size === 'lg' ? 'size-8' : 'size-4'
  if (!onChange) {
    return (
      <span className={cn('inline-flex gap-0.5', className)} role="img" aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={cn(px, n <= Math.round(value) ? 'fill-gold-400 text-gold-400' : 'text-ink-600')} />
        ))}
      </span>
    )
  }
  return (
    <div className={cn('flex gap-1', className)} role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} star${n === 1 ? '' : 's'}`}
          onClick={() => onChange(n)}
          className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400">
          <Star className={cn(px, n <= value ? 'fill-gold-400 text-gold-400' : 'text-ink-500')} />
        </button>
      ))}
    </div>
  )
}
