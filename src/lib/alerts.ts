/**
 * "Notify me": a buyer asks to hear about accounts they want (build + level range). Shared by
 * the form and functions/api/alerts.ts. No '@/' imports (the Cloudflare function uses it too).
 */
import { cleanContact, cleanText, contactError, INQUIRY_LIMITS, nameError, parseMethod, type ContactMethod } from './inquiry'

export const ALERT_CATEGORIES = ['Melee', 'Distance', 'Magic'] as const
export type AlertCategory = (typeof ALERT_CATEGORIES)[number]

/** How long a request stays active. */
export const ALERT_DAYS = 60

export interface AlertRequest {
  name: string
  method: ContactMethod
  contact: string
  /** null = any build */
  category: AlertCategory | null
  minLevel: number
  /** null = no upper limit */
  maxLevel: number | null
}

export type AlertErrors = Partial<Record<keyof AlertRequest, string>>

const level = (v: unknown): number | null => {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN
  return Number.isInteger(n) ? n : null
}

export function validateAlert(raw: unknown):
  | { ok: true; value: AlertRequest }
  | { ok: false; errors: AlertErrors } {
  const r = (raw ?? {}) as Record<string, unknown>
  const method = parseMethod(r.method)
  const category = ALERT_CATEGORIES.find((c) => c === r.category) ?? null
  const min = level(r.minLevel)
  const max = r.maxLevel === null || r.maxLevel === '' || r.maxLevel === undefined ? null : level(r.maxLevel)
  const value: AlertRequest = {
    name: cleanText(r.name, INQUIRY_LIMITS.name),
    method,
    contact: cleanContact(r.contact),
    category,
    minLevel: min ?? 0,
    maxLevel: max,
  }

  const errors: AlertErrors = {}
  const n = nameError(value.name)
  if (n) errors.name = n
  const c = contactError(method, value.contact)
  if (c) errors.contact = c
  if (min === null || min < 1 || min > 2000) errors.minLevel = 'Enter the lowest level you want, e.g. 600.'
  if (r.maxLevel !== null && r.maxLevel !== '' && r.maxLevel !== undefined && (max === null || max < 1 || max > 2000)) {
    errors.maxLevel = 'Enter a level, or leave it empty for no limit.'
  } else if (max !== null && min !== null && max < min) {
    errors.maxLevel = 'Must be at least the lowest level.'
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value }
}

/** "Distance, level 650+" / "any build, level 600–700". */
export function describeAlert(a: Pick<AlertRequest, 'category' | 'minLevel' | 'maxLevel'>): string {
  const build = a.category ?? 'any build'
  const levels = a.maxLevel ? `level ${a.minLevel}–${a.maxLevel}` : `level ${a.minLevel}+`
  return `${build}, ${levels}`
}

/** Whether a listing is what an alert asked for. */
export function alertMatches(
  a: { category: string | null; min_level: number; max_level: number | null },
  l: { category: string; level: number },
): boolean {
  return (!a.category || a.category === l.category) && l.level >= a.min_level && (a.max_level == null || l.level <= a.max_level)
}
