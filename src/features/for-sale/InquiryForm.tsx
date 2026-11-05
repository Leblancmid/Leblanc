import { useState, type FormEvent } from 'react'
import { CheckCircle2, MessageCircle, Phone, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { INQUIRY_LIMITS, validateInquiry, type ContactMethod, type InquiryErrors } from '@/lib/inquiry'
import type { Listing } from '@/types'

/** The buyer's details, remembered on this device so the next inquiry is one click. */
const SAVED_KEY = 'leblanc_inquiry_contact'

function readSaved(): { name: string; method: ContactMethod; contact: string } {
  try {
    const v = JSON.parse(localStorage.getItem(SAVED_KEY) ?? '{}')
    return { name: v.name ?? '', method: v.method === 'whatsapp' ? 'whatsapp' : 'discord', contact: v.contact ?? '' }
  } catch {
    return { name: '', method: 'discord', contact: '' }
  }
}

function save(v: { name: string; method: ContactMethod; contact: string }) {
  try { localStorage.setItem(SAVED_KEY, JSON.stringify(v)) } catch { /* storage blocked: fine */ }
}

const inputCls =
  'w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:border-gold-500/70 focus:outline-none'

/**
 * "I want this": the buyer leaves a name and a Discord / WhatsApp contact, and Leblanc gets it
 * instantly in a private Discord channel. Mount with key={listing.id} so it starts fresh.
 */
export function InquiryForm({ listing, onCancel }: { listing: Listing; onCancel: () => void }) {
  const [saved] = useState(readSaved)
  const [name, setName] = useState(saved.name)
  const [method, setMethod] = useState<ContactMethod>(saved.method)
  const [contact, setContact] = useState(saved.contact)
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // hidden from people; bots fill it in
  const [openedAt] = useState(() => Date.now())
  const [errors, setErrors] = useState<InquiryErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [failure, setFailure] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const check = validateInquiry({ listingId: listing.id, name, method, contact, message })
    if (!check.ok) { setErrors(check.errors); return }
    setErrors({})
    setFailure(null)
    setStatus('sending')
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...check.value, website, openedAt }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (body.errors) setErrors(body.errors)
        setFailure(body.message ?? 'Something went wrong. Please message Leblanc on Discord or WhatsApp instead.')
        setStatus('idle')
        return
      }
      save({ name: check.value.name, method, contact: check.value.contact })
      setStatus('sent')
    } catch {
      setFailure("Couldn't reach the server. Please message Leblanc on Discord or WhatsApp instead.")
      setStatus('idle')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
        <div>
          <p className="text-sm font-semibold text-emerald-200">Sent! Leblanc got your request.</p>
          <p className="mt-0.5 text-xs text-emerald-200/80">
            You'll get a message on {method === 'discord' ? 'Discord' : 'WhatsApp'} ({contact}) soon.
            {method === 'discord' && ' Make sure your DMs are open.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3 rounded-lg border border-gold-500/30 bg-gold-500/5 p-4">
      <p className="text-sm font-semibold text-gold-300">Interested? Leave your contact and Leblanc will message you.</p>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-ink-300">Your name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={INQUIRY_LIMITS.name}
          autoComplete="name" className={inputCls} placeholder="e.g. Kai" />
        {errors.name && <span className="text-xs text-red-300">{errors.name}</span>}
      </label>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-ink-300">Message me on</span>
        <div className="flex gap-1 rounded-md bg-ink-900 p-1" role="radiogroup" aria-label="Contact method">
          {([['discord', 'Discord', MessageCircle], ['whatsapp', 'WhatsApp', Phone]] as const).map(([value, label, Icon]) => (
            <button key={value} type="button" role="radio" aria-checked={method === value}
              onClick={() => { setMethod(value); setErrors((x) => ({ ...x, contact: undefined })) }}
              className={cn('flex flex-1 items-center justify-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors',
                method === value ? 'bg-gold-500 text-ink-950' : 'text-ink-300 hover:text-gold-300')}>
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>
        <input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={INQUIRY_LIMITS.contact}
          className={inputCls} inputMode={method === 'whatsapp' ? 'tel' : 'text'}
          autoComplete={method === 'whatsapp' ? 'tel' : 'username'}
          placeholder={method === 'discord' ? 'Your Discord username' : 'Your WhatsApp number, e.g. +63 912 345 6789'}
          aria-label={method === 'discord' ? 'Discord username' : 'WhatsApp number'} />
        {errors.contact && <span className="text-xs text-red-300">{errors.contact}</span>}
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-ink-300">Message <span className="text-ink-500">(optional)</span></span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={INQUIRY_LIMITS.message} rows={2}
          className={inputCls} placeholder="Questions, your offer, how you'll pay…" />
      </label>

      {/* Honeypot: invisible to people, so only bots fill it in */}
      <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      {(failure || errors.listingId) && (
        <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-300">{errors.listingId ?? failure}</p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={status === 'sending'}>Cancel</Button>
        <Button type="submit" loading={status === 'sending'}>
          {status !== 'sending' && <Send className="size-4" />} Send
        </Button>
      </div>
    </form>
  )
}
