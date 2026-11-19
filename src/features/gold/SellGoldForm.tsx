import { useState, type FormEvent } from 'react'
import { CheckCircle2, HandCoins } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { amountInKk } from '@/lib/gold'
import type { ContactMethod } from '@/lib/inquiry'
import { formatKk, validateGoldSell, type GoldSellErrors } from '@/lib/orders'
import { readSavedContact, saveContact } from '@/lib/savedContact'
import { ContactFields, Honeypot, inputCls } from '@/features/for-sale/ContactFields'

/** Sell your gold to Leblanc: how much, at what rate, and how to reach you. Lands in #inquiries. */
export function SellGoldForm({ onCancel }: { onCancel: () => void }) {
  const [saved]               = useState(readSavedContact)
  const [amount, setAmount]   = useState('')
  const [rate, setRate]       = useState('')
  const [name, setName]       = useState(saved.name)
  const [method, setMethod]   = useState<ContactMethod>(saved.method)
  const [contact, setContact] = useState(saved.contact)
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const [openedAt]            = useState(() => Date.now())
  const [errors, setErrors]   = useState<GoldSellErrors>({})
  const [status, setStatus]   = useState<'idle' | 'sending' | 'sent'>('idle')
  const [failure, setFailure] = useState<string | null>(null)

  const kk = amountInKk(amount)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const check = validateGoldSell({ name, method, contact, amountKk: kk ?? 0, rate, message })
    if (!check.ok) { setErrors(check.errors); return }
    setErrors({}); setFailure(null); setStatus('sending')
    try {
      const res = await fetch('/api/sell-gold', {
        method: 'POST', headers: { 'content-type': 'application/json' },
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
    return (
      <div className="flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
        <div>
          <p className="text-sm font-semibold text-emerald-200">Offer sent!</p>
          <p className="mt-0.5 text-xs text-emerald-200/80">
            {kk && formatKk(kk)}{rate.trim() && <> at {rate.trim()}</>}. Leblanc will message you on{' '}
            {method === 'discord' ? 'Discord' : 'WhatsApp'} ({contact}) with an answer.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="relative flex flex-col gap-4 rounded-xl border border-gold-500/30 bg-gold-500/5 p-4 sm:p-5">
      <p className="flex items-center gap-2 font-semibold text-gold-300"><HandCoins className="size-5" /> Sell your gold to Leblanc</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-ink-300">How much gold</span>
            <input value={amount} onChange={(e) => { setAmount(e.target.value); setErrors((x) => ({ ...x, amountKk: undefined })) }}
              className={inputCls} placeholder="e.g. 500kk or 1.5kkk" inputMode="text" />
            {errors.amountKk
              ? <span className="text-xs text-red-300">{errors.amountKk}</span>
              : kk !== null && kk > 0 && <span className="text-xs text-ink-400">That's {formatKk(kk)} ({Math.round(kk * 1_000_000).toLocaleString()} gold)</span>}
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-ink-300">Your rate <span className="text-ink-500">(optional)</span></span>
            <input value={rate} onChange={(e) => setRate(e.target.value)} maxLength={40} className={inputCls}
              placeholder="e.g. $0.17/KK or make me an offer" />
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <ContactFields name={name} onName={setName}
            method={method} onMethod={(m) => { setMethod(m); setErrors((x) => ({ ...x, contact: undefined })) }}
            contact={contact} onContact={setContact} errors={errors} />
          <label className="flex flex-col gap-1">
            <span className="text-xs text-ink-300">Message <span className="text-ink-500">(optional)</span></span>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} rows={3} className={inputCls}
              placeholder="How you want to be paid, when you're online…" />
          </label>
        </div>
      </div>

      <Honeypot value={website} onChange={setWebsite} />
      {failure && <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-300">{failure}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={status === 'sending'}>Cancel</Button>
        <Button type="submit" loading={status === 'sending'}>{status !== 'sending' && <HandCoins className="size-4" />} Send offer</Button>
      </div>
    </form>
  )
}
