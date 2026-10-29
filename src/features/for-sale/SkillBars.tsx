import { cn } from '@/lib/cn'
import type { SkillKey, SkillStats } from '@/types'

const SKILLS: { key: SkillKey; label: string }[] = [
  { key: 'melee', label: 'Melee' },
  { key: 'distance', label: 'Distance' },
  { key: 'magic', label: 'Magic' },
  { key: 'defense', label: 'Defense' },
]

// Bars are drawn against a fixed ceiling so accounts compare visually across cards.
const SKILL_SCALE = 700

interface SkillBarsProps {
  stats: SkillStats
  highlight?: SkillKey
  className?: string
}

export function SkillBars({ stats, highlight, className }: SkillBarsProps) {
  return (
    <dl className={cn('flex flex-col gap-1.5', className)}>
      {SKILLS.map(({ key, label }) => {
        const isMain = key === highlight
        return (
          <div key={key} className="grid grid-cols-[4.5rem_1fr] items-center gap-3 text-xs">
            <dt className={isMain ? 'font-medium text-gold-300' : 'text-ink-400'}>{label}</dt>
            <dd className="flex items-center gap-2.5">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-700">
                <span
                  className={cn('block h-full rounded-full', isMain ? 'bg-gold-400' : 'bg-ink-500')}
                  style={{ width: `${Math.min(100, (stats[key] / SKILL_SCALE) * 100)}%` }}
                />
              </span>
              <span
                className={cn(
                  'w-8 text-right tabular-nums',
                  isMain ? 'font-semibold text-ink-100' : 'text-ink-300',
                )}
              >
                {stats[key]}
              </span>
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
