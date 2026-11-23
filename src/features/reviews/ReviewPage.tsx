import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, MessageSquareHeart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { inputCls, Honeypot } from '@/features/for-sale/ContactFields'
import { readSavedContact } from '@/lib/savedContact'
import { StarRating } from './StarRating'

type Load = { state: 'loading' } | { state: 'invalid'; message: string } | { state: 'ready'; item: string; reviewed: boolean }

/**
 * /review?t=…: the buyer's review of a purchase, from the link Leblanc sends after a trade. One per
 * purchase; it shows on the site once Leblanc approves it.
 */
export function ReviewPage() {
  const [params] = useSearchParams()
  const token = params.get('t') ?? ''
  const [load, setLoad] = useState<Load>({ state: 'loading' })
  const [rating, setRating] = useState(5)
  const [name, setName] = useState(() => readSavedContact().name)
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const [openedAt] = useState(() => Date.now())
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [failure, setFailure] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    fetch(`/api/review?t=${encodeURIComponent(token)}`)
      .then(async (r) => {
        const body = await r.json().catch(() => ({}))
        if (!live) return
        setLoad(r.ok ? { state: 'ready', item: body.item, reviewed: !!body.reviewed } : { state: 'invalid', message: body.message ?? 'This review link is invalid.' })
      })
      .catch(() => { if (live) setLoad({ state: 'invalid', message: "Couldn't reach the server. Try again in a moment." }) })
    return () => { live = false }
  }, [token])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (name.trim().length < 2) errs.name = 'Your name or Discord name.'
    if (message.trim().length < 3) errs.message = 'A few words about the trade.'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({}); setFailure(null); setStatus('sending')
    try {
      const res = await fetch('/api/review', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ t: token, rating, name, message, website, openedAt }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (body.errors) setErrors(body.errors)
        setFailure(body.message ?? 'Something went wrong. Please try again.')
        setStatus('idle')
        return
      }
      setStatus('sent')
    } catch {
      setFailure("Couldn't reach the server. Please try again.")
      setStatus('idle')
    }
  }

  return (
    <div className="px-4 py-16 sm:px-6">
      <Card className="mx-auto flex max-w-lg flex-col gap-5 p-6 sm:p-8">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-300">
          <MessageSquareHeart className="size-4" /> Leave a review
        </p>

        {load.state === 'loading' && <div className="h-40 animate-pulse rounded-lg bg-ink-800" />}

        {load.state === 'invalid' && <p className="text-ink-300">{load.message}</p>}

        {load.state === 'ready' && (load.reviewed || status === 'sent') && (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
            <div>
              <p className="font-semibold text-emerald-200">Thank you!</p>
              <p className="mt-0.5 text-sm text-emerald-200/80">
                {status === 'sent' ? 'Your review was sent. It shows on the site once Leblanc has seen it.' : 'This purchase has already been reviewed.'}
              </p>
            </div>
          </div>
        )}

        {load.state === 'ready' && !load.reviewed && status !== 'sent' && (
          <form onSubmit={submit} noValidate className="flex flex-col gap-4">
            <div>
              <h1 className="font-display text-3xl text-ink-50">How was your trade?</h1>
              <p className="mt-1 text-sm text-ink-300">You got <span className="text-ink-100">{load.item}</span> from Leblanc.</p>
            </div>

            <StarRating value={rating} onChange={setRating} size="lg" />

            <label className="flex flex-col gap-1">
              <span className="text-xs text-ink-300">Your name <span className="text-ink-500">(shown as first name only)</span></span>
              <input value={name} onChange={(e) => { setName(e.target.value); setErrors((x) => ({ ...x, name: undefined })) }}
                maxLength={40} className={inputCls} placeholder="e.g. Shiroe" />
              {errors.name && <span className="text-xs text-red-300">{errors.name}</span>}
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-ink-300">Your review</span>
              <textarea value={message} onChange={(e) => { setMessage(e.target.value); setErrors((x) => ({ ...x, message: undefined })) }}
                maxLength={400} rows={4} className={inputCls} placeholder="Fast, safe, would trade again…" />
              <span className="flex justify-between text-xs">
                <span className="text-red-300">{errors.message ?? errors.rating}</span>
                <span className="text-ink-500">{message.length}/400</span>
              </span>
            </label>

            <Honeypot value={website} onChange={setWebsite} />
            {failure && <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-300">{failure}</p>}

            <Button type="submit" loading={status === 'sending'}>Send review</Button>
          </form>
        )}
      </Card>
    </div>
  )
}
