/**
 * "I want this" inquiries and "Notify me" alerts: one set of rules shared by the forms (instant
 * feedback) and the backend functions in functions/ (the real check). No '@/' imports here,
 * because the Cloudflare functions import this file too.
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

/** Strip control characters, trim and cut to `max` characters. */
export const cleanText = (v: unknown, max: number) =>
  typeof v === 'string'
    ? Array.from(v, (ch) => (ch.charCodeAt(0) < 32 || ch.charCodeAt(0) === 127 ? ' ' : ch)).join('').trim().slice(0, max)
    : ''

/** Discord username (2–32 letters, numbers, _ or .), with or without a leading @ or old #1234 tag. */
const DISCORD_RE = /^[a-z0-9_.]{2,32}(#\d{4})?$/i

/** WhatsApp number: 7–15 digits, spaces / dashes / + / brackets allowed. */
export const whatsappDigits = (v: string) => v.replace(/\D/g, '')

export const parseMethod = (v: unknown): ContactMethod => (v === 'whatsapp' ? 'whatsapp' : 'discord')

/** Cleaned contact: no leading @ on Discord names. */
export const cleanContact = (v: unknown) => cleanText(v, INQUIRY_LIMITS.contact).replace(/^@/, '')

/** What's wrong with a name, or null. */
export const nameError = (name: string) => (name.length < 2 ? 'Enter your name.' : null)

/** What's wrong with a Discord username / WhatsApp number, or null. */
export function contactError(method: ContactMethod, contact: string): string | null {
  if (method === 'discord') {
    return DISCORD_RE.test(contact) ? null : 'Enter your Discord username, e.g. leblancmid.'
  }
  const digits = whatsappDigits(contact)
  return digits.length >= 7 && digits.length <= 15 && /^[+\d\s()-]+$/.test(contact)
    ? null
    : 'Enter your WhatsApp number with country code, e.g. +63 912 345 6789.'
}

/** "Discord: name" / "WhatsApp: [number](wa.me link)" for the Discord message. */
export const contactMarkdown = (method: ContactMethod, contact: string) =>
  method === 'whatsapp'
    ? `WhatsApp: [${contact}](https://wa.me/${whatsappDigits(contact)})`
    : `Discord: **${contact}**`

export function validateInquiry(raw: unknown):
  | { ok: true; value: Inquiry }
  | { ok: false; errors: InquiryErrors } {
  const r = (raw ?? {}) as Record<string, unknown>
  const method = parseMethod(r.method)
  const value: Inquiry = {
    listingId: cleanText(r.listingId, 40),
    name: cleanText(r.name, INQUIRY_LIMITS.name),
    method,
    contact: cleanContact(r.contact),
    message: cleanText(r.message, INQUIRY_LIMITS.message),
  }

  const errors: InquiryErrors = {}
  if (!/^[a-z0-9-]{1,40}$/i.test(value.listingId)) errors.listingId = 'This account could not be found.'
  const n = nameError(value.name)
  if (n) errors.name = n
  const c = contactError(method, value.contact)
  if (c) errors.contact = c

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value }
}
