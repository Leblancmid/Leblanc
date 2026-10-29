// Rucoy shorthand: k = thousand, kk / m = million, kkk / b = billion.
const SUFFIX_MULTIPLIERS: Record<string, number> = {
  k: 1e3,
  kk: 1e6,
  m: 1e6,
  kkk: 1e9,
  b: 1e9,
}

/** Characters a gold amount input accepts while the user is typing. */
export const GOLD_INPUT_PATTERN = /^[\d.,\skmb]*$/i

export function parseGoldAmount(raw: string): number | null {
  const match = raw
    .replace(/[,\s]/g, '')
    .toLowerCase()
    .match(/^(\d+\.?\d*|\.\d+)(k{1,3}|m|b)?$/)
  if (!match) return null
  const value = parseFloat(match[1]) * (match[2] ? SUFFIX_MULTIPLIERS[match[2]] : 1)
  return Number.isFinite(value) ? value : null
}

/** Adds thousands separators to the leading integer part, leaving any decimals/suffix as typed. */
export function formatWithCommas(raw: string): string {
  const stripped = raw.replace(/,/g, '')
  return stripped.replace(/^\d+/, (digits) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ','))
}
