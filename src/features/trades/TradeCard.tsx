import { useState } from 'react'
import { Images, Quote } from 'lucide-react'
import { formatTradeValue, type ProofTrade } from '@/data/published'
import { cn } from '@/lib/cn'
import { Lightbox } from './Lightbox'

const MEDALS: Record<number, { emoji: string; ring: string; label: string }> = {
  1: { emoji: '🥇', ring: 'border-gold-400/70 shadow-[0_20px_60px_-25px_rgba(212,165,74,0.55)]', label: 'Biggest trade' },
  2: { emoji: '🥈', ring: 'border-slate-300/50', label: '2nd biggest' },
  3: { emoji: '🥉', ring: 'border-amber-700/60', label: '3rd biggest' },
}

/** "May 20, 2025" from Y-m-d (a calendar date, no timezone shift) */
const tradeDate = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

/**
 * One proven trade: the cover screenshot, its medal and value, the date, a quote, and the rest of
 * the screenshots (tap to see them full screen).
 */
export function TradeCard({ trade, featured = false }: { trade: ProofTrade; featured?: boolean }) {
  const [open, setOpen] = useState<number | null>(null)
  const medal = MEDALS[trade.rank]
  const cover = trade.images[0]
  const more = trade.images.slice(1, featured ? 5 : 4)

  return (
    <article className={cn('flex flex-col overflow-hidden rounded-2xl border bg-ink-900/70', medal?.ring ?? 'border-ink-700')}>
      {cover && (
        <button type="button" onClick={() => setOpen(0)} className="group relative block overflow-hidden bg-ink-950" aria-label={`See the screenshots of ${trade.title}`}>
          <img src={cover.thumb} srcSet={`${cover.thumb} 600w, ${cover.src} 1600w`} sizes={featured ? '(min-width: 1024px) 600px, 100vw' : '(min-width: 1024px) 400px, 100vw'}
            alt={`${trade.title}: screenshot`} width={cover.width} height={cover.height} loading="lazy"
            className={cn('w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]', featured ? 'aspect-[16/10]' : 'aspect-[4/3]')} />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <div>
              {medal && <p className="text-xs font-semibold uppercase tracking-widest text-gold-300">{medal.emoji} {medal.label}</p>}
              <p className={cn('font-display text-ink-50', featured ? 'text-5xl' : 'text-4xl')}>{formatTradeValue(trade)}</p>
            </div>
            {trade.images.length > 1 && (
              <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-ink-100"><Images className="size-3.5" /> {trade.images.length}</span>
            )}
          </div>
        </button>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-medium text-ink-100">{trade.title}</h3>
          {trade.traded_on && <span className="shrink-0 text-xs text-ink-400">{tradeDate(trade.traded_on)}</span>}
        </div>

        {trade.quote && (
          <blockquote className="flex gap-2 rounded-lg border border-ink-700 bg-ink-950/60 p-3 text-sm italic text-ink-200">
            <Quote className="mt-0.5 size-4 shrink-0 text-gold-500/60" />
            <span>{trade.quote}{trade.quote_by && <span className="not-italic text-ink-400"> — {trade.quote_by}</span>}</span>
          </blockquote>
        )}

        {more.length > 0 && (
          <div className="mt-auto grid grid-cols-4 gap-2">
            {more.map((im, i) => (
              <button key={im.thumb} type="button" onClick={() => setOpen(i + 1)} aria-label={`Screenshot ${i + 2}`}
                className="relative aspect-square overflow-hidden rounded-md border border-ink-700 hover:border-gold-500/60">
                <img src={im.thumb} alt="" loading="lazy" className="size-full object-cover" />
                {i === more.length - 1 && trade.images.length > more.length + 1 && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-semibold text-white">+{trade.images.length - more.length - 1}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {open !== null && <Lightbox images={trade.images} start={open} title={`${formatTradeValue(trade)} · ${trade.title}`} onClose={() => setOpen(null)} />}
    </article>
  )
}
