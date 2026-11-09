import { useState, type FormEvent } from 'react'
import { CheckCircle2, HandCoins, ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { BUYING_LEVEL_RANGE } from '@/data/site'
import type { ContactMethod } from '@/lib/inquiry'
import { OFFER_CATEGORIES, OFFER_STATS, screenshotError, validateOffer, type AccountOfferErrors } from '@/lib/orders'
import { readSavedContact, saveContact } from '@/lib/savedContact'
import { ContactFields, Honeypot, inputCls } from './ContactFields'

/**
 * "Sell me your account": level, build, stats, asking price and a screenshot of the Stats
 * screen. Leblanc gets it in #inquiries with the screenshot. Starts as a banner.
 */
export function SellOfferForm() {
  const [open, setOpen]         = useState(false)
  const [saved]                 = useState(readSavedContact)
  const [level, setLevel]       = useState('')
  const [category, setCategory] = useState<(typeof OFFER_CATEGORIES)[number] | null>(null)
  const [stats, setStats]       = useState<Record<string, string>>({})
  const [asking, setAsking]     = useState('')
  const [shot, setShot]         = useState<File | null>(null)
  const [name, setName]         = useState(saved.name)
  const [method, setMethod]     = useState<ContactMethod>(saved.method)
  const [contact, setContact]   = useState(saved.contact)
  const [message, setMessage]   = useState('')
  const [website, setWebsite]   = useState('')
  const [openedAt, setOpenedAt] = useState(0)
  const [errors, setErrors]     = useState<AccountOfferErrors>({})
  const [status, setStatus]     = useState<'idle' | 'sending' | 'sent'>('idle')
  const [failure, setFailure]   = useState<string | null>(null)

  const digits = (v: string) => v.replace(/\D/g, '').slice(0, 4)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const fields: Record<string, string> = { name, method, contact, level, category: category ?? '', asking, message, ...stats }
    const check = validateOffer(fields)
    const shotErr = screenshotError(shot)
    if (!check.ok || shotErr) {
      setErrors({ ...(check.ok ? {} : check.errors), ...(shotErr ? { screenshot: shotErr } : {}) })
      return
    }
    setErrors({}); setFailure(null); setStatus('sending')
    const form = new FormData()
    Object.entries({ ...fields, website, openedAt: String(openedAt) }).forEach(([k, v]) => form.append(k, v))
    form.append('screenshot', shot!)
    try {
      const res = await fetch('/api/sell-offer', { method: 'POST', body: form })
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
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
        <div>
          <p className="text-sm font-semibold text-emerald-200">Offer sent!</p>
          <p className="mt-0.5 text-sm text-emerald-200/80">Leblanc will look at it and message you on {method === 'discord' ? 'Discord' : 'WhatsApp'} with an offer.</p>
        </div>
      </div>
    )
  }

  if (!open) {
    return (
      <div id="sell" className="flex scroll-mt-24 flex-col items-start gap-3 rounded-xl border border-ink-700 bg-ink-900/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <HandCoins className="mt-0.5 size-5 shrink-0 text-gold-400" />
          <div>
            <p className="font-medium text-ink-100">Selling an account?</p>
            <p className="text-sm text-ink-400">Leblanc is buying Lv. {BUYING_LEVEL_RANGE} accounts. Send its stats and get an offer.</p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => { setOpen(true); setOpenedAt(Date.now()) }}>
          <HandCoins className="size-4" /> Get an offer
        </Button>
      </div>
    )
  }

  return (
    <form id="sell" onSubmit={submit} noValidate className="relative flex scroll-mt-24 flex-col gap-4 rounded-xl border border-gold-500/30 bg-gold-500/5 p-5">
      <p className="flex items-center gap-2 font-semibold text-gold-300"><HandCoins className="size-5" /> Sell your account to Leblanc</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[1fr_2fr] gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-ink-300">Level</span>
              <input value={level} onChange={(e) => setLevel(digits(e.target.value))} inputMode="numeric" className={inputCls} placeholder="e.g. 650" />
              {errors.level && <span className="text-xs text-red-300">{errors.level}</span>}
            </label>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-ink-300">Build</span>
              <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Build">
                {OFFER_CATEGORIES.map((c) => (
                  <button key={c} type="button" role="radio" aria-checked={category === c} onClick={() => setCategory(c)}
                    className={cn('rounded-full border px-3 py-1 text-sm font-medium transition-colors',
                      category === c ? 'border-gold-500/60 bg-gold-500/10 text-gold-300' : 'border-ink-600 text-ink-300 hover:text-ink-100')}>
                    {c}
                  </button>
                ))}
              </div>
              {errors.category && <span className="text-xs text-red-300">{errors.category}</span>}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {OFFER_STATS.map((k) => (
              <label key={k} className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-xs capitalize text-ink-300">{k}</span>
                <input value={stats[k] ?? ''} onChange={(e) => setStats((s) => ({ ...s, [k]: digits(e.target.value) }))}
                  inputMode="numeric" className={inputCls} aria-label={`${k} (optional)`} />
              </label>
            ))}
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-ink-300">Asking price <span className="text-ink-500">(optional)</span></span>
            <input value={asking} onChange={(e) => setAsking(e.target.value)} maxLength={40} className={inputCls} placeholder="e.g. 2KKK, $300, or make me an offer" />
          </label>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-ink-300">Screenshot of the Stats screen</span>
            <label className={cn('flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 py-2.5 text-sm transition-colors',
              errors.screenshot ? 'border-red-400/70 text-red-300' : 'border-ink-600 text-ink-300 hover:border-gold-500/60 hover:text-gold-300')}>
              <ImagePlus className="size-4 shrink-0" />
              <span className="truncate">{shot ? shot.name : 'Choose an image (PNG, JPG or WebP, max 5 MB)'}</span>
              <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0] ?? null; setShot(f); setErrors((x) => ({ ...x, screenshot: screenshotError(f) ?? undefined })) }} />
            </label>
            {errors.screenshot && <span className="text-xs text-red-300">{errors.screenshot}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <ContactFields name={name} onName={setName}
            method={method} onMethod={(m) => { setMethod(m); setErrors((x) => ({ ...x, contact: undefined })) }}
            contact={contact} onContact={setContact} errors={errors} />
          <label className="flex flex-col gap-1">
            <span className="text-xs text-ink-300">Message <span className="text-ink-500">(optional)</span></span>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} rows={3} className={inputCls}
              placeholder="Accessories, items, how you want to be paid…" />
          </label>
        </div>
      </div>

      <Honeypot value={website} onChange={setWebsite} />
      {failure && <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-300">{failure}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={status === 'sending'}>Cancel</Button>
        <Button type="submit" loading={status === 'sending'}>{status !== 'sending' && <HandCoins className="size-4" />} Send offer</Button>
      </div>
    </form>
  )
}
