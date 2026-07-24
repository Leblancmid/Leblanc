import { useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  footer?: ReactNode
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({ isOpen, onClose, title, description, children, size = 'md', footer }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEscapeKey(isOpen, onClose)
  useClickOutside(panelRef, isOpen, onClose)
  useLockBodyScroll(isOpen)

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-4">
      <div className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm animate-fade-in" aria-hidden />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={cn(
          'relative w-full rounded-t-2xl border border-ink-600 bg-ink-900 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.7)] animate-scale-in sm:rounded-2xl',
          sizeClasses[size],
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 z-10 rounded-full bg-ink-950/60 p-1.5 text-ink-300 backdrop-blur-sm transition-colors hover:bg-ink-700 hover:text-gold-300"
        >
          <X className="size-4" />
        </button>

        {(title || description) && (
          <div className="border-b border-ink-700 px-6 py-5">
            {title && (
              <h3 id="modal-title" className="pr-8 text-xl font-medium text-ink-100">
                {title}
              </h3>
            )}
            {description && <p className="mt-1 text-sm text-ink-300">{description}</p>}
          </div>
        )}

        <div className="scroll-thin max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>

        {footer && <div className="border-t border-ink-700 px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
