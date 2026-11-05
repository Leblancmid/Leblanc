/**
 * "I want this" inquiries: one set of rules shared by the form (instant feedback) and the
 * backend function in functions/api/inquiry.ts (the real check). No '@/' imports here,
 * because the Cloudflare function imports this file too.
 */

export type ContactMethod = 'discord' | 'whatsapp'

export interface Inquiry {
  listingId: string
  name: string
  method: ContactMethod
  contact: string
  message: string
}

export const INQUIRY_LIMITS = { name: 60, contact: 40, message: 500 } as const

export type InquiryErrors = Partial<Record<keyof Inquiry, string>>

/** Strip control characters and trim. */
const clean = (v: unknown, max: number) =>
  typeof v === 'string'
    ? Array.from(v, (ch) => (ch.charCodeAt(0) < 32 || ch.charCodeAt(0) === 127 ? ' ' : ch)).join('').trim().slice(0, max)
    : ''

/** Discord username (2–32 letters, numbers, _ or .), with or without a leading @ or old #1234 tag. */
const DISCORD_RE = /^[a-z0-9_.]{2,32}(#\d{4})?$/i

/** WhatsApp number: 7–15 digits, spaces / dashes / + / brackets allowed. */
export const whatsappDigits = (v: string) => v.replace(/\D/g, '')

export function validateInquiry(raw: unknown):
  | { ok: true; value: Inquiry }
  | { ok: false; errors: InquiryErrors } {
  const r = (raw ?? {}) as Record<string, unknown>
  const method: ContactMethod = r.method === 'whatsapp' ? 'whatsapp' : 'discord'
  const value: Inquiry = {
    listingId: clean(r.listingId, 40),
    name: clean(r.name, INQUIRY_LIMITS.name),
    method,
    contact: clean(r.contact, INQUIRY_LIMITS.contact).replace(/^@/, ''),
    message: clean(r.message, INQUIRY_LIMITS.message * 2).slice(0, INQUIRY_LIMITS.message),
  }

  const errors: InquiryErrors = {}
  if (!/^[a-z0-9-]{1,40}$/i.test(value.listingId)) errors.listingId = 'This account could not be found.'
  if (value.name.length < 2) errors.name = 'Enter your name.'
  if (method === 'discord' && !DISCORD_RE.test(value.contact)) {
    errors.contact = 'Enter your Discord username, e.g. leblancmid.'
  }
  if (method === 'whatsapp') {
    const digits = whatsappDigits(value.contact)
    if (digits.length < 7 || digits.length > 15 || !/^[+\d\s()-]+$/.test(value.contact)) {
      errors.contact = 'Enter your WhatsApp number with country code, e.g. +63 912 345 6789.'
    }
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value }
}
