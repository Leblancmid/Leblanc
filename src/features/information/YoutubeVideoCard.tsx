interface YoutubeVideoCardProps {
  href: string
  channelName: string
  title: string
  thumbnailSrc: string
  views?: string
  uploadedAgo?: string
}

export function YoutubeVideoCard({
  href,
  channelName,
  title,
  thumbnailSrc,
  views,
  uploadedAgo,
}: YoutubeVideoCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full flex-col overflow-hidden rounded-lg border border-ink-700 border-l-4 border-l-gold-500 bg-ink-800/40 transition-colors hover:border-ink-600 hover:bg-ink-800/60"
    >
      <div className="p-4 pb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">YouTube</p>
        <p className="mt-1 text-sm font-medium text-gold-300">{channelName}</p>
        <p className="mt-1 font-medium text-ink-100">{title}</p>
        {(views || uploadedAgo) && (
          <p className="mt-1 text-xs text-ink-500">
            {views && `${views} views`}
            {views && uploadedAgo && ' • '}
            {uploadedAgo}
          </p>
        )}
      </div>
      <img src={thumbnailSrc} alt={title} className="aspect-video w-full object-cover" />
    </a>
  )
}
