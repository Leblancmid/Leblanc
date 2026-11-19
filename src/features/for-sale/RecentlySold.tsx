import { BadgeCheck } from 'lucide-react'
import { siteStats } from '@/data/published'
import { categoryMeta, soldAgo } from '@/lib/listings'
import { cn } from '@/lib/cn'

/**
 * Proof that accounts really sell: the last few sold (level, build and when; never the price or
 * who bought it). Published from the back office; hidden when there's nothing recent.
 */
export function RecentlySold({ className }: { className?: string }) {
  const sold = siteStats.recent_sold ?? []
  if (sold.length === 0) return null

  return (
    <div className={cn('rounded-xl border border-ink-700 bg-ink-900/60 p-4 sm:p-5', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="flex items-center gap-2 font-medium text-ink-100">
          <BadgeCheck className="size-5 text-emerald-400" />
          Recently sold
        </p>
        <p className="text-xs text-ink-400">Handed over to their new owners through Leblanc</p>
      </div>
      <ul className="scroll-thin -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
        {sold.map((s, i) => {
          const { icon: Icon } = categoryMeta[s.category]
          return (
            <li key={`${s.sold_on}-${s.level}-${i}`}
              className="flex shrink-0 items-center gap-2.5 rounded-lg border border-ink-700 bg-ink-800/50 px-3 py-2">
              <Icon className="size-4 text-ink-400" />
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-medium text-ink-100">Lv {s.level} {s.category}</span>
                <span className="text-[11px] text-emerald-300/80">Sold {soldAgo(s.sold_on)}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
