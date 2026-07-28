interface YoutubeChannelCardProps {
  href: string
  name: string
  tagline: string
  subtext?: string
  avatarSrc: string
}

export function YoutubeChannelCard({ href, name, tagline, subtext, avatarSrc }: YoutubeChannelCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-4 rounded-lg border border-ink-700 border-l-4 border-l-gold-500 bg-ink-800/40 p-4 transition-colors hover:border-ink-600 hover:bg-ink-800/60"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">YouTube</p>
        <p className="mt-1 font-medium text-gold-300">{name}</p>
        <p className="mt-1 text-sm text-ink-300">{tagline}</p>
        {subtext && <p className="text-sm text-ink-400">{subtext}</p>}
      </div>
      <img src={avatarSrc} alt={name} className="size-16 shrink-0 rounded-lg object-cover" />
    </a>
  )
}
