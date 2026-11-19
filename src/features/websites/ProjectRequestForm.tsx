import { useState, type FormEvent } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import type { ContactMethod } from '@/lib/inquiry'
import { PROJECT_DETAILS_MAX, PROJECT_KINDS, validateProject, type ProjectErrors, type ProjectKind } from '@/lib/project'
import { readSavedContact, saveContact } from '@/lib/savedContact'
import { ContactFields, Honeypot, inputCls } from '@/features/for-sale/ContactFields'

/**
 * "Tell me about your project": what they need, budget and timeline, and how to reach them.
 * preset: an offer card's "Get a quote" picks the kind (n changes on each click).
 */
export function ProjectRequestForm({ preset }: { preset: { kind: ProjectKind; n: number } | null }) {
  const [saved]                 = useState(readSavedContact)
  const [kind, setKind]         = useState<ProjectKind | null>(preset?.kind ?? null)
  const [seenPreset, setSeenPreset] = useState(preset?.n ?? 0)
  const [details, setDetails]   = useState('')
  const [budget, setBudget]     = useState('')
  const [timeline, setTimeline] = useState('')
  const [name, setName]         = useState(saved.name)
  const [method, setMethod]     = useState<ContactMethod>(saved.method)
  const [contact, setContact]   = useState(saved.contact)
  const [website, setWebsite]   = useState('')
  const [openedAt]              = useState(() => Date.now())
  const [errors, setErrors]     = useState<ProjectErrors>({})
  const [status, setStatus]     = useState<'idle' | 'sending' | 'sent'>('idle')
  const [failure, setFailure]   = useState<string | null>(null)

  // A "Get a quote" button was pressed: take its kind (adjusted during render, not in an effect)
  if (preset && preset.n !== seenPreset) {
    setSeenPreset(preset.n)
    setKind(preset.kind)
    setErrors((x) => ({ ...x, kind: undefined }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const check = validateProject({ name, method, contact, kind, details, budget, timeline })
    if (!check.ok) { setErrors(check.errors); return }
    setErrors({}); setFailure(null); setStatus('sending')
    try {
      const res = await fetch('/api/project-request', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...check.value, website, openedAt }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (body.errors) setErrors(body.errors)
        setFailure(body.message ?? 'Something went wrong. Please message me on Discord instead.')
        setStatus('idle')
        return
      }
      saveContact({ name: check.value.name, method, contact: check.value.contact })
      setStatus('sent')
    } catch {
      setFailure("Couldn't reach the server. Please message me on Discord instead.")
      setStatus('idle')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-5">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
        <div>
          <p className="font-semibold text-emerald-200">Thanks, got it!</p>
          <p className="mt-0.5 text-sm text-emerald-200/80">
            I'll message you on {method === 'discord' ? 'Discord' : 'WhatsApp'} ({contact}) with a few questions, then a fixed quote before any work starts.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-ink-300">What do you need?</span>
        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="What do you need?">
          {(Object.entries(PROJECT_KINDS) as [ProjectKind, string][]).map(([k, label]) => (
            <button key={k} type="button" role="radio" aria-checked={kind === k}
              onClick={() => { setKind(k); setErrors((x) => ({ ...x, kind: undefined })) }}
              className={cn('rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                kind === k ? 'border-gold-500/60 bg-gold-500/10 text-gold-300' : 'border-ink-600 text-ink-300 hover:text-ink-100')}>
              {label}
            </button>
          ))}
        </div>
        {errors.kind && <span className="text-xs text-red-300">{errors.kind}</span>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-ink-300">Tell me about it</span>
            <textarea value={details} onChange={(e) => { setDetails(e.target.value); setErrors((x) => ({ ...x, details: undefined })) }}
              maxLength={PROJECT_DETAILS_MAX} rows={5} className={inputCls}
              placeholder="What it's for, what it should do, any site you like the look of…" />
            {errors.details && <span className="text-xs text-red-300">{errors.details}</span>}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-ink-300">Budget <span className="text-ink-500">(optional)</span></span>
              <input value={budget} onChange={(e) => setBudget(e.target.value)} maxLength={40} className={inputCls} placeholder="e.g. ₱20k" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-ink-300">Needed by <span className="text-ink-500">(optional)</span></span>
              <input value={timeline} onChange={(e) => setTimeline(e.target.value)} maxLength={40} className={inputCls} placeholder="e.g. March" />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <ContactFields name={name} onName={setName}
            method={method} onMethod={(m) => { setMethod(m); setErrors((x) => ({ ...x, contact: undefined })) }}
            contact={contact} onContact={setContact} errors={errors} />
        </div>
      </div>

      <Honeypot value={website} onChange={setWebsite} />
      {failure && <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-300">{failure}</p>}

      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-400">Free to ask. You'll get questions and a fixed quote before any work starts.</p>
        <Button type="submit" loading={status === 'sending'}>{status !== 'sending' && <Send className="size-4" />} Send request</Button>
      </div>
    </form>
  )
}
