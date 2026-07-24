import { useState, type ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { Modal } from '@/components/modals/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

type Tone = 'default' | 'danger'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  title: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  tone?: Tone
  successMessage?: string
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  successMessage = 'Done. We’ll be in touch shortly.',
}: ConfirmDialogProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleConfirm = async () => {
    setStatus('loading')
    await onConfirm()
    setStatus('success')
  }

  const handleClose = () => {
    onClose()
    window.setTimeout(() => setStatus('idle'), 200)
  }

  const Icon = tone === 'danger' ? AlertTriangle : Info

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm">
      {status === 'success' ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center animate-fade-in">
          <CheckCircle2 className="size-10 text-emerald-400" />
          <p className="text-base font-medium text-ink-100">{successMessage}</p>
          <Button variant="secondary" size="sm" className="mt-2" onClick={handleClose}>
            Close
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full border',
                tone === 'danger'
                  ? 'border-red-500/30 bg-red-500/10 text-red-300'
                  : 'border-gold-500/30 bg-gold-500/10 text-gold-300',
              )}
            >
              <Icon className="size-4" />
            </span>
            <div>
              <h3 className="text-lg font-medium text-ink-100">{title}</h3>
              {description && <p className="mt-1 text-sm text-ink-300">{description}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={handleClose} disabled={status === 'loading'}>
              {cancelLabel}
            </Button>
            <Button
              variant={tone === 'danger' ? 'danger' : 'primary'}
              size="sm"
              onClick={handleConfirm}
              loading={status === 'loading'}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
