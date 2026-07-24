import { useCountUp } from '@/hooks/useCountUp'

interface StatBlockProps {
  value: number
  suffix?: string
  label: string
}

export function StatBlock({ value, suffix = '', label }: StatBlockProps) {
  const count = useCountUp(value)

  return (
    <div className="text-center sm:text-left">
      <p className="font-display text-3xl text-gold-300 sm:text-4xl">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-ink-400">{label}</p>
    </div>
  )
}
