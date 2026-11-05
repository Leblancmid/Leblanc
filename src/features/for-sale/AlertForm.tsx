import { useState, type FormEvent } from 'react'
import { BellRing, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { ALERT_CATEGORIES, ALERT_DAYS, describeAlert, validateAlert, type AlertCategory, type AlertErrors } from '@/lib/alerts'
import type { ContactMethod } from '@/lib/inquiry'
import { readSavedContact, saveContact } from '@/lib/savedContact'
import { ContactFields, Honeypot, inputCls } from './ContactFields'

/**
 * "Notify me": a buyer says what they're after (build + level range). When Leblanc lists a
 * match, they get a message. Starts as a small banner; opens into the form.
 */
export function AlertForm({ defaultCategory }: { defaultCategory: AlertCategory | null }) {
  const [open, setOpen]         = useState(false)
  const [saved]                 = useState(readSavedContact)
  const [category, setCategory] = useState<AlertCategory | null>(defaultCategory)
  const [minLevel, setMinLevel] = useState('')
  const [maxLevel, setMaxLevel] = useState('')
  const [name, setName]         = useState(saved.name)
  const [method, setMethod]     = useState<ContactMethod>(saved.method)
  const [contact, setContact]   = useState(saved.contact)
  const [website, setWebsite]   = useState('')
  const [openedAt, setOpenedAt] = useState(0)
  const [errors, setErrors]     = useState<AlertErrors>({})
  const [status, setStatus]     = useState<'idle' | 'sending' | 'sent'>('idle')
  const [failure, setFailure]   = useState<string | null>(null)

  const numberOnly = (v: string) => v.replace(/\D/g, '').slice(0, 4)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const check = validateAlert({ name, method, contact, category, minLevel, maxLevel })
    if (!check.ok) { setErrors(check.errors); return }
    setErrors({})
    setFailure(null)
    setStatus('sending')
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...check.value, website, openedAt }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (body.errors) setErrors(body.errors)
        setFailure(body.message ?? 'Something went wrong. Please message Leblanc on Discord instead.')
        setStatus('idle')
        return
      }
      saveContact({ name: check.value.name, method, contact: check.value.contact })
      setStatus('sent')
    } catch {
      setFailure("Couldn't reach the server. Please message Leblanc on Discord instead.")
      setStatus('idle')
    }
  }

  if (status === 'sent') {
    const v = validateAlert({ name, method, contact, category, minLevel, maxLevel })
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
        <div>
          <p className="text-sm font-semibold text-emerald-200">You're on the list.</p>
          <p className="mt-0.5 text-sm text-emerald-200/80">
            When a {v.ok ? describeAlert(v.value) : 'matching'} account is listed, Leblanc will message you on{' '}
            {method === 'discord' ? 'Discord' : 'WhatsApp'}. Your request stays active for {ALERT_DAYS} days.
          </p>
        </div>
      </div>
    )
  }

  if (!open) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-ink-700 bg-ink-900/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <BellRing className="mt-0.5 size-5 shrink-0 text-gold-400" />
          <div>
            <p className="font-medium text-ink-100">Not seeing the account you want?</p>
            <p className="text-sm text-ink-400">Tell Leblanc what you're after and get a message when one is listed.</p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => { setOpen(true); setOpenedAt(Date.now()) }}>
          <BellRing className="size-4" /> Notify me
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="relative flex flex-col gap-4 rounded-xl border border-gold-500/30 bg-gold-500/5 p-5">
      <div className="flex items-center gap-2">
        <BellRing className="size-5 text-gold-400" />
        <p className="font-semibold text-gold-300">Notify me when this is listed</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-ink-300">Build</span>
            <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Build">
              {([null, ...ALERT_CATEGORIES] as const).map((c) => (
                <button key={c ?? 'any'} type="button" role="radio" aria-checked={category === c} onClick={() => setCategory(c)}
                  className={cn('rounded-full border px-3 py-1 text-sm font-medium transition-colors',
                    category === c ? 'border-gold-500/60 bg-gold-500/10 text-gold-300' : 'border-ink-600 text-ink-300 hover:text-ink-100')}>
                  {c ?? 'Any'}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-ink-300">Level from</span>
              <input value={minLevel} onChange={(e) => setMinLevel(numberOnly(e.target.value))} inputMode="numeric" className={inputCls} placeholder="e.g. 600" />
              {errors.minLevel && <span className="text-xs text-red-300">{errors.minLevel}</span>}
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-ink-300">to <span className="text-ink-500">(optional)</span></span>
              <input value={maxLevel} onChange={(e) => setMaxLevel(numberOnly(e.target.value))} inputMode="numeric" className={inputCls} placeholder="no limit" />
              {errors.maxLevel && <span className="text-xs text-red-300">{errors.maxLevel}</span>}
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <ContactFields
            name={name} onName={setName}
            method={method} onMethod={(m) => { setMethod(m); setErrors((x) => ({ ...x, contact: undefined })) }}
            contact={contact} onContact={setContact}
            errors={errors}
          />
        </div>
      </div>

      <Honeypot value={website} onChange={setWebsite} />

      {failure && <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-300">{failure}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={status === 'sending'}>Cancel</Button>
        <Button type="submit" loading={status === 'sending'}>
          {status !== 'sending' && <BellRing className="size-4" />} Notify me
        </Button>
      </div>
    </form>
  )
}
