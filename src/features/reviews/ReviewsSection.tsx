import { useEffect, useState } from 'react'
import { Quote } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/cn'
import { StarRating } from './StarRating'

interface PublicReview { id: number; item: string; name: string; rating: number; message: string; created_at: number }
interface ReviewsData { reviews: PublicReview[]; count: number; average: number | null }

/** "3 weeks ago" style, for a review's date */
function ago(ms: number): string {
  const days = Math.floor((Date.now() - ms) / 86_400_000)
  if (days < 1) return 'today'
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  if (days < 60) return `${Math.floor(days / 7)} week${days < 14 ? '' : 's'} ago`
  return `${Math.floor(days / 30)} months ago`
}

/**
 * "What buyers say": approved reviews from buyers (via the review links Leblanc sends after a
 * trade), with the average rating. Hidden until there's at least one.
 */
export function ReviewsSection({ className }: { className?: string }) {
  const [data, setData] = useState<ReviewsData | null>(null)

  useEffect(() => {
    let live = true
    fetch('/api/reviews').then((r) => (r.ok ? r.json() : null)).then((d) => { if (live && d) setData(d) }).catch(() => {})
    return () => { live = false }
  }, [])

  if (!data || data.reviews.length === 0) return null

  return (
    <section className={cn('px-4 py-20 sm:px-6', className)}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Reviews" title="What buyers say" description="From buyers after their trade, through a review link only real buyers get." />
          {data.average != null && (
            <div className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-900 px-4 py-3">
              <span className="font-display text-4xl text-gold-300">{data.average.toFixed(1)}</span>
              <div>
                <StarRating value={data.average} />
                <p className="mt-0.5 text-xs text-ink-400">{data.count} review{data.count === 1 ? '' : 's'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {data.reviews.map((r) => (
            <figure key={r.id} className="mb-5 break-inside-avoid rounded-xl border border-ink-700 bg-ink-900/60 p-5">
              <div className="flex items-center justify-between gap-2">
                <StarRating value={r.rating} />
                <Quote className="size-5 text-gold-500/40" />
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-ink-200">“{r.message}”</blockquote>
              <figcaption className="mt-4 flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-ink-100">{r.name}</span>
                <span className="text-ink-500">{r.item} · {ago(r.created_at)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
