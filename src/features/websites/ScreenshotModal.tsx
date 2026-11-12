import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, MessageCircle, Phone } from 'lucide-react'
import { Modal } from '@/components/modals/Modal'
import { buttonClasses } from '@/components/ui/Button'
import { DISCORD_URL, WHATSAPP_URL } from '@/lib/links'
import type { WebsiteProject } from '@/data/websites'

type Screenshot = NonNullable<WebsiteProject['images']>[number]

interface Props {
  project: WebsiteProject
  images: Screenshot[]
  /** Which screenshot is open; null when closed */
  index: number | null
  onChange: (index: number | null) => void
}

/** One screenshot of a project, shown like a listing: big image, what it shows, and how to ask for one. */
export function ScreenshotModal({ project, images, index, onChange }: Props) {
  const img = index === null ? null : images[index]
  const count = images.length
  const go = (step: number) => index !== null && onChange((index + step + count) % count)

  // Left/right arrows flip through the screenshots (Escape is handled by Modal).
  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onChange((index - 1 + count) % count)
      if (e.key === 'ArrowRight') onChange((index + 1) % count)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, count, onChange])

  if (!img || index === null) return null

  return (
    <Modal
      isOpen
      onClose={() => onChange(null)}
      size="lg"
      title={img.caption}
      description={`${project.title} · Sample data`}
      footer={
        <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => go(-1)} className={buttonClasses('ghost', 'sm')} aria-label="Previous screenshot" title="Previous (←)">
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-xs tabular-nums text-ink-400">
              {index + 1} / {count}
            </span>
            <button type="button" onClick={() => go(1)} className={buttonClasses('ghost', 'sm')} aria-label="Next screenshot" title="Next (→)">
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={buttonClasses('secondary', 'md', 'flex-1 sm:flex-none')}>
              <Phone className="size-4" />
              WhatsApp
            </a>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className={buttonClasses('primary', 'md', 'flex-1 sm:flex-none')}>
              <MessageCircle className="size-4" />
              Get a quote
            </a>
          </div>
        </div>
      }
    >
      <a href={img.src} target="_blank" rel="noopener noreferrer" className="group relative block" title="Open full size">
        <img src={img.src} alt={img.alt} className="w-full rounded-lg border border-ink-700" />
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-ink-950/80 px-2 py-1 text-[11px] text-ink-200 opacity-0 transition-opacity group-hover:opacity-100">
          <ExternalLink className="size-3" />
          Full size
        </span>
      </a>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.4fr]">
        <div className="grid grid-cols-2 gap-2 self-start sm:grid-cols-1">
          <Fact label="Project" value={project.kind} />
          <Fact label="Screen" value={`${index + 1} of ${count}`} />
          <Fact label="Data" value="Made up for this demo" />
        </div>
        <div className="rounded-lg border border-ink-700 bg-ink-800/40 p-4">
          <p className="text-[11px] uppercase tracking-wider text-ink-400">What it does</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-200">{img.highlight}</p>
        </div>
      </div>
    </Modal>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-800/40 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wider text-ink-400">{label}</p>
      <p className="mt-0.5 text-sm text-ink-100">{value}</p>
    </div>
  )
}
