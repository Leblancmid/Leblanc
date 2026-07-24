import { Store } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

const numberFormatter = new Intl.NumberFormat('en-US')

interface DiscordServerCardProps {
  name: string
  href: string
  online: number
  members: number
  established?: string
  iconSrc?: string
  bannerClassName: string
}

export function DiscordServerCard({
  name,
  href,
  online,
  members,
  established,
  iconSrc,
  bannerClassName,
}: DiscordServerCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className={cn('h-16', bannerClassName)} />

      <div className="px-4">
        <div className="-mt-8 flex size-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-ink-900 bg-ink-800">
          {iconSrc ? (
            <img src={iconSrc} alt={name} className="size-full object-cover" />
          ) : (
            <Store className="size-6 text-ink-400" />
          )}
        </div>
      </div>

      <div className="px-4 pb-4 pt-3">
        <h4 className="font-medium text-ink-100">{name}</h4>
        <div className="mt-2 flex items-center gap-3 text-xs text-ink-400">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400" />
            {numberFormatter.format(online)} Online
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-ink-500" />
            {numberFormatter.format(members)} Members
          </span>
        </div>
        {established && <p className="mt-1 text-xs text-ink-500">Est. {established}</p>}

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex h-9 items-center justify-center rounded-md bg-emerald-600 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Go to Server
        </a>
      </div>
    </Card>
  )
}
