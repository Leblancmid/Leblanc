/**
 * Website project requests from /websites: rules shared by the form and the backend function.
 * No '@/' imports (the Cloudflare functions use this file too).
 */
import { cleanContact, cleanText, contactError, INQUIRY_LIMITS, nameError, parseMethod, type ContactMethod } from './inquiry'

/** What they need: matches the offer cards on /websites */
export const PROJECT_KINDS = {
  store: 'Online store or catalogue',
  system: 'Business system',
  fix: 'Fixes and upgrades',
} as const
export type ProjectKind = keyof typeof PROJECT_KINDS

export const isProjectKind = (v: unknown): v is ProjectKind => typeof v === 'string' && v in PROJECT_KINDS

export interface ProjectRequest {
  name: string
  method: ContactMethod
  contact: string
  kind: ProjectKind
  /** What it should do, in their words */
  details: string
  /** Free text, optional: "₱20k", "$300", "not sure" */
  budget: string
  /** Free text, optional: "by March", "no rush" */
  timeline: string
}

export type ProjectErrors = Partial<Record<keyof ProjectRequest, string>>

export const PROJECT_DETAILS_MIN = 10
export const PROJECT_DETAILS_MAX = 1500

export function validateProject(raw: unknown):
  | { ok: true; value: ProjectRequest }
  | { ok: false; errors: ProjectErrors } {
  const r = (raw ?? {}) as Record<string, unknown>
  const method = parseMethod(r.method)
  const value: ProjectRequest = {
    name: cleanText(r.name, INQUIRY_LIMITS.name),
    method,
    contact: cleanContact(r.contact),
    kind: isProjectKind(r.kind) ? r.kind : 'store',
    details: cleanText(r.details, PROJECT_DETAILS_MAX),
    budget: cleanText(r.budget, 40),
    timeline: cleanText(r.timeline, 40),
  }

  const errors: ProjectErrors = {}
  const n = nameError(value.name)
  if (n) errors.name = n
  const c = contactError(method, value.contact)
  if (c) errors.contact = c
  if (!isProjectKind(r.kind)) errors.kind = 'Pick what you need.'
  if (value.details.length < PROJECT_DETAILS_MIN) errors.details = 'Tell me a little about it: what it should do, and for whom.'

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value }
}
