interface YoutubeChannelCardProps {
  href: string
  name: string
  handle: string
  subscribers?: string
  avatarSrc: string
  bannerSrc: string
}

export function YoutubeChannelCard({
  href,
  name,
  handle,
  subscribers,
  avatarSrc,
  bannerSrc,
}: YoutubeChannelCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-lg border border-ink-700 bg-ink-800/40 transition-colors hover:border-ink-600 hover:bg-ink-800/60"
    >
      <img src={bannerSrc} alt="" className="aspect-[3/1] w-full object-cover" />

      <div className="flex items-center gap-3 px-4 pb-4">
        <img
          src={avatarSrc}
          alt={name}
          className="-mt-7 size-14 shrink-0 rounded-full border-4 border-ink-900 object-cover"
        />
        <div className="pt-1">
          <p className="font-medium text-ink-100">{name}</p>
          <p className="text-sm text-ink-400">{handle}</p>
          {subscribers && <p className="text-xs text-ink-500">{subscribers} subscribers</p>}
        </div>
      </div>
    </a>
  )
}
