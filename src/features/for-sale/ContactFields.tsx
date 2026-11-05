import { MessageCircle, Phone } from 'lucide-react'
import { cn } from '@/lib/cn'
import { INQUIRY_LIMITS, type ContactMethod } from '@/lib/inquiry'

export const inputCls =
  'w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:border-gold-500/70 focus:outline-none'

/** Name + "Message me on Discord / WhatsApp" + the username or number. Used by both forms. */
export function ContactFields({ name, onName, method, onMethod, contact, onContact, errors }: {
  name: string
  onName: (v: string) => void
  method: ContactMethod
  onMethod: (v: ContactMethod) => void
  contact: string
  onContact: (v: string) => void
  errors: { name?: string; contact?: string }
}) {
  return (
    <>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-ink-300">Your name</span>
        <input value={name} onChange={(e) => onName(e.target.value)} maxLength={INQUIRY_LIMITS.name}
          autoComplete="name" className={inputCls} placeholder="e.g. Kai" />
        {errors.name && <span className="text-xs text-red-300">{errors.name}</span>}
      </label>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-ink-300">Message me on</span>
        <div className="flex gap-1 rounded-md bg-ink-900 p-1" role="radiogroup" aria-label="Contact method">
          {([['discord', 'Discord', MessageCircle], ['whatsapp', 'WhatsApp', Phone]] as const).map(([value, label, Icon]) => (
            <button key={value} type="button" role="radio" aria-checked={method === value}
              onClick={() => onMethod(value)}
              className={cn('flex flex-1 items-center justify-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors',
                method === value ? 'bg-gold-500 text-ink-950' : 'text-ink-300 hover:text-gold-300')}>
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>
        <input value={contact} onChange={(e) => onContact(e.target.value)} maxLength={INQUIRY_LIMITS.contact}
          className={inputCls} inputMode={method === 'whatsapp' ? 'tel' : 'text'}
          autoComplete={method === 'whatsapp' ? 'tel' : 'username'}
          placeholder={method === 'discord' ? 'Your Discord username' : 'Your WhatsApp number, e.g. +63 912 345 6789'}
          aria-label={method === 'discord' ? 'Discord username' : 'WhatsApp number'} />
        {errors.contact && <span className="text-xs text-red-300">{errors.contact}</span>}
      </div>
    </>
  )
}

/** Invisible to people, so only spam bots fill it in. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input type="text" name="website" value={value} onChange={(e) => onChange(e.target.value)}
      tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
  )
}
