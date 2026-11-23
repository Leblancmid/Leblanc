import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface LightboxImage { src: string; thumb: string; width: number; height: number }

/**
 * Full-screen screenshots: arrows, keyboard (← → Esc) and swipe to move, thumbnails to jump.
 * Mount only while open.
 */
export function Lightbox({ images, start = 0, title, onClose }: {
  images: LightboxImage[]
  start?: number
  title: string
  onClose: () => void
}) {
  const [index, setIndex] = useState(start)
  const touchX = useRef<number | null>(null)
  const count = images.length
  const go = (step: number) => setIndex((i) => (i + step + count) % count)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % count)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + count) % count)
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow }
  }, [count, onClose])

  const img = images[index]
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`${title}: screenshot ${index + 1} of ${count}`}
      className="fixed inset-0 z-[100] flex flex-col bg-ink-950/95 backdrop-blur-sm"
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
        touchX.current = null
      }}>
      <div className="flex items-center gap-3 px-4 py-3 text-sm text-ink-300">
        <span className="min-w-0 flex-1 truncate font-medium text-ink-100">{title}</span>
        <span className="tabular-nums">{index + 1} / {count}</span>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-2 text-ink-200 hover:bg-white/10"><X className="size-5" /></button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
        <img key={img.src} src={img.src} alt={`${title}, screenshot ${index + 1}`} width={img.width} height={img.height}
          className="max-h-full max-w-full rounded-lg object-contain shadow-2xl" />
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous screenshot"
              className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/70 sm:block"><ChevronLeft className="size-6" /></button>
            <button type="button" onClick={() => go(1)} aria-label="Next screenshot"
              className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/70 sm:block"><ChevronRight className="size-6" /></button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto px-4 py-3">
          {images.map((im, i) => (
            <button key={im.thumb} type="button" onClick={() => setIndex(i)} aria-label={`Screenshot ${i + 1}`} aria-current={i === index}
              className={cn('h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-opacity', i === index ? 'border-gold-400' : 'border-transparent opacity-50 hover:opacity-100')}>
              <img src={im.thumb} alt="" className="size-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  )
}
