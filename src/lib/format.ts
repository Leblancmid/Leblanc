const integerFormatter = new Intl.NumberFormat('en-US')
const compactFormatter = new Intl.NumberFormat('en-US', { notation: 'compact' })

export const formatNumber = (n: number) => integerFormatter.format(n)

/** 7000 → "7K+" style labels for headline stats. */
export const formatCompactPlus = (n: number) => `${compactFormatter.format(n)}+`

export const formatCompact = (n: number) => compactFormatter.format(n)

/** ["a", "b", "c"] → "a, b, or c" */
export const formatOrList = (items: string[]) =>
  new Intl.ListFormat('en', { style: 'long', type: 'disjunction' }).format(items)
