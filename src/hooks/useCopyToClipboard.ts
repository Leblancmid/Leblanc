import { useCallback, useState } from 'react'

export function useCopyToClipboard(resetAfterMs = 1800) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        window.setTimeout(() => setCopied(false), resetAfterMs)
        return true
      } catch {
        setCopied(false)
        return false
      }
    },
    [resetAfterMs],
  )

  return { copied, copy }
}
