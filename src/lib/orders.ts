/**
 * Gold orders and account offers ("sell me your account"): rules shared by the forms and the
 * backend functions. No '@/' imports (the Cloudflare functions use this file too).
 */
import { cleanContact, cleanText, contactError, INQUIRY_LIMITS, nameError, parseMethod, type ContactMethod } from './inquiry'

export interface GoldRate {
  /** e.g. "Binance", "GCash" */
  method: string
  currency: 'USD' | 'PHP'
  /** Price per 1KK (1,000,000) gold */
  per_kk: number
}

export interface GoldConfig {
  rates: GoldRate[]
  min_order_kk: number | null
  note: string | null
}

const symbol = (currency: string) => (currency === 'PHP' ? '₱' : '$')

/** "$0.195" / "₱12.50" per KK */
export const formatRate = (r: GoldRate) => `${symbol(r.currency)}${r.per_kk.toLocaleString('en', { maximumFractionDigits: 4 })}`

/** What an order costs: 500 KK × $0.195 = $97.50 */
export const orderTotal = (amountKk: number, r: GoldRate) => Math.round(amountKk * r.per_kk * 100) / 100

export const formatMoney = (amount: number, currency: string) =>
  `${symbol(currency)}${amount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/** 500 → "500KK", 1500 → "1.5KKK" */
export const formatKk = (kk: number) => (kk >= 1000 ? `${Number((kk / 1000).toFixed(2))}KKK` : `${Number(kk.toFixed(2))}KK`)

// ── Gold order ──

export interface GoldOrder {
  name: string
  method: ContactMethod
  contact: string
  /** How much gold, in KK (millions) */
  amountKk: number
  /** Which rate (payment method) they pay with */
  payment: string
  message: string
}

export type GoldOrderErrors = Partial<Record<keyof GoldOrder, string>>

export function validateGoldOrder(raw: unknown, gold: GoldConfig):
  | { ok: true; value: GoldOrder; rate: GoldRate }
  | { ok: false; errors: GoldOrderErrors } {
  const r = (raw ?? {}) as Record<string, unknown>
  const method = parseMethod(r.method)
  const amount = typeof r.amountKk === 'number' ? r.amountKk : Number(r.amountKk)
  const value: GoldOrder = {
    name: cleanText(r.name, INQUIRY_LIMITS.name),
    method,
    contact: cleanContact(r.contact),
    amountKk: Number.isFinite(amount) ? Math.round(amount * 100) / 100 : 0,
    payment: cleanText(r.payment, 30),
    message: cleanText(r.message, INQUIRY_LIMITS.message),
  }
  const rate = gold.rates.find((x) => x.method === value.payment)

  const errors: GoldOrderErrors = {}
  const n = nameError(value.name)
  if (n) errors.name = n
  const c = contactError(method, value.contact)
  if (c) errors.contact = c
  if (!(value.amountKk > 0) || value.amountKk > 1_000_000) errors.amountKk = 'Enter how much gold, e.g. 500KK.'
  else if (gold.min_order_kk && value.amountKk < gold.min_order_kk) errors.amountKk = `The minimum order is ${formatKk(gold.min_order_kk)}.`
  if (!rate) errors.payment = 'Pick how you want to pay.'

  return Object.keys(errors).length || !rate ? { ok: false, errors } : { ok: true, value, rate }
}

// ── Account offer ("sell me your account") ──

export const OFFER_CATEGORIES = ['Melee', 'Distance', 'Magic'] as const
export const OFFER_STATS = ['melee', 'distance', 'magic', 'defense'] as const
export const SCREENSHOT_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const
export const SCREENSHOT_MAX_BYTES = 5 * 1024 * 1024

export interface AccountOffer {
  name: string
  method: ContactMethod
  contact: string
  level: number
  category: (typeof OFFER_CATEGORIES)[number]
  stats: Partial<Record<(typeof OFFER_STATS)[number], number>>
  /** Free text: "2KKK", "$350", "make me an offer" */
  asking: string
  message: string
}

export type AccountOfferErrors = Partial<Record<keyof AccountOffer | 'screenshot', string>>

const int = (v: unknown) => {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN
  return Number.isInteger(n) ? n : null
}

export function validateOffer(raw: Record<string, unknown>):
  | { ok: true; value: AccountOffer }
  | { ok: false; errors: AccountOfferErrors } {
  const method = parseMethod(raw.method)
  const level = int(raw.level)
  const category = OFFER_CATEGORIES.find((c) => c === raw.category)
  const stats: AccountOffer['stats'] = {}
  for (const k of OFFER_STATS) {
    const v = int(raw[k])
    if (v !== null && v >= 0 && v <= 2000) stats[k] = v
  }
  const value: AccountOffer = {
    name: cleanText(raw.name, INQUIRY_LIMITS.name),
    method,
    contact: cleanContact(raw.contact),
    level: level ?? 0,
    category: category ?? 'Melee',
    stats,
    asking: cleanText(raw.asking, 40),
    message: cleanText(raw.message, INQUIRY_LIMITS.message),
  }

  const errors: AccountOfferErrors = {}
  const n = nameError(value.name)
  if (n) errors.name = n
  const c = contactError(method, value.contact)
  if (c) errors.contact = c
  if (level === null || level < 1 || level > 2000) errors.level = 'Enter the account level.'
  if (!category) errors.category = 'Pick the build.'

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value }
}

/** What's wrong with a screenshot file, or null. */
export function screenshotError(file: { type: string; size: number } | null): string | null {
  if (!file || file.size === 0) return 'Add a screenshot of the Stats screen.'
  if (!(SCREENSHOT_TYPES as readonly string[]).includes(file.type)) return 'Use a PNG, JPG or WebP image.'
  if (file.size > SCREENSHOT_MAX_BYTES) return 'The screenshot must be under 5 MB.'
  return null
}
