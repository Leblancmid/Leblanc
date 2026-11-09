import { useState, type FormEvent } from 'react'
import { CheckCircle2, Coins } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { parseGoldAmount } from '@/lib/gold'
import type { ContactMethod } from '@/lib/inquiry'
import { formatKk, formatMoney, formatRate, orderTotal, validateGoldOrder, type GoldOrderErrors } from '@/lib/orders'
import { readSavedContact, saveContact } from '@/lib/savedContact'
import { gold } from '@/data/published'
import { ContactFields, Honeypot, inputCls } from '@/features/for-sale/ContactFields'

/** "500kk", "1.5kkk", "500" (taken as KK) → KK */
function amountInKk(raw: string): number | null {
  const t = raw.trim()
  if (!t) return null
  if (/^\d+(\.\d+)?$/.test(t.replace(/,/g, ''))) return Number(t.replace(/,/g, ''))
  const g = parseGoldAmount(t)
  return g ? g / 1_000_000 : null
}

/** Order gold at the published rates; Leblanc gets it in #inquiries with the total. */
export function GoldOrderForm({ onCancel }: { onCancel: () => void }) {
  const [saved]               = useState(readSavedContact)
  const [amount, setAmount]   = useState('')
  const [payment, setPayment] = useState(gold.rates[0]?.method ?? '')
  const [name, setName]       = useState(saved.name)
  const [method, setMethod]   = useState<ContactMethod>(saved.method)
  const [contact, setContact] = useState(saved.contact)
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const [openedAt]            = useState(() => Date.now())
  const [errors, setErrors]   = useState<GoldOrderErrors>({})
  const [status, setStatus]   = useState<'idle' | 'sending' | 'sent'>('idle')
  const [failure, setFailure] = useState<string | null>(null)

  const kk   = amountInKk(amount)
  const rate = gold.rates.find((r) => r.method === payment)
  const total = kk && rate ? orderTotal(kk, rate) : null

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const check = validateGoldOrder({ name, method, contact, amountKk: kk ?? 0, payment, message }, gold)
    if (!check.ok) { setErrors(check.errors); return }
    setErrors({}); setFailure(null); setStatus('sending')
    try {
      const res = await fetch('/api/gold-order', {
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
          <p className="text-sm font-semibold text-emerald-200">Order sent!</p>
          <p className="mt-0.5 text-xs text-emerald-200/80">
            {kk && formatKk(kk)} via {payment}{total !== null && rate && <> ≈ {formatMoney(total, rate.currency)}</>}. Leblanc will message you on{' '}
            {method === 'discord' ? 'Discord' : 'WhatsApp'} ({contact}) to arrange it.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="relative flex flex-col gap-3 rounded-lg border border-gold-500/30 bg-gold-500/5 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-gold-300"><Coins className="size-4" /> Order gold</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-ink-300">How much</span>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} placeholder="e.g. 500kk or 1.5kkk" inputMode="text" />
          {errors.amountKk && <span className="text-xs text-red-300">{errors.amountKk}</span>}
        </label>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-ink-300">Pay with</span>
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Pay with">
            {gold.rates.map((r) => (
              <button key={r.method} type="button" role="radio" aria-checked={payment === r.method} onClick={() => setPayment(r.method)}
                className={cn('rounded-full border px-3 py-1 text-sm font-medium transition-colors',
                  payment === r.method ? 'border-gold-500/60 bg-gold-500/10 text-gold-300' : 'border-ink-600 text-ink-300 hover:text-ink-100')}>
                {r.method}
              </button>
            ))}
          </div>
          {errors.payment && <span className="text-xs text-red-300">{errors.payment}</span>}
        </div>
      </div>

      {kk !== null && rate && (
        <p className="rounded-md bg-ink-900 px-3 py-2 text-sm text-ink-200">
          {formatKk(kk)} × {formatRate(rate)}/KK = <b className="text-gold-300">{formatMoney(orderTotal(kk, rate), rate.currency)}</b>
        </p>
      )}

      <ContactFields name={name} onName={setName}
        method={method} onMethod={(m) => { setMethod(m); setErrors((x) => ({ ...x, contact: undefined })) }}
        contact={contact} onContact={setContact} errors={errors} />

      <label className="flex flex-col gap-1">
        <span className="text-xs text-ink-300">Message <span className="text-ink-500">(optional)</span></span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} rows={2} className={inputCls}
          placeholder="Your in-game name, when you're online…" />
      </label>

      <Honeypot value={website} onChange={setWebsite} />
      {failure && <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-300">{failure}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={status === 'sending'}>Cancel</Button>
        <Button type="submit" loading={status === 'sending'}>{status !== 'sending' && <Coins className="size-4" />} Send order</Button>
      </div>
    </form>
  )
}
