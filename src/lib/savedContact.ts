import type { ContactMethod } from './inquiry'

/** The buyer's name and contact, remembered on this device for the next form. */
export interface SavedContact {
  name: string
  method: ContactMethod
  contact: string
}

const KEY = 'leblanc_inquiry_contact'

export function readSavedContact(): SavedContact {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    return { name: v.name ?? '', method: v.method === 'whatsapp' ? 'whatsapp' : 'discord', contact: v.contact ?? '' }
  } catch {
    return { name: '', method: 'discord', contact: '' }
  }
}

export function saveContact(v: SavedContact): void {
  try { localStorage.setItem(KEY, JSON.stringify(v)) } catch { /* storage blocked: fine */ }
}
