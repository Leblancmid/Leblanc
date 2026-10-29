import { ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { buttonClasses } from '@/components/ui/Button'
import type { Community } from '@/data/site'
import { formatNumber } from '@/lib/format'

export function CommunityCard({ community }: { community: Community }) {
  const { name, href, iconSrc, online, members, established } = community

  return (
    <Card className="flex items-center gap-4 p-4">
      <img
        src={iconSrc}
        alt=""
        className="size-12 shrink-0 rounded-xl border border-ink-600 object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink-100">{name}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink-400">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            {formatNumber(online)} online
          </span>
          <span>{formatNumber(members)} members</span>
          <span>Est. {established}</span>
        </p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Join ${name} on Discord`}
        className={buttonClasses('secondary', 'sm', 'shrink-0')}
      >
        Join
        <ArrowUpRight className="size-3.5" />
      </a>
    </Card>
  )
}
