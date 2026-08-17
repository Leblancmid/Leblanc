import { useMemo, useState } from 'react'
import { Coins } from 'lucide-react'
import { Card } from '@/components/ui/Card'

function formatWithCommas(raw: string): string {
  if (!raw) return ''
  const [integer, decimal] = raw.split('.')
  const intFormatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decimal === undefined ? intFormatted : `${intFormatted}.${decimal}`
}

function AmountInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <input
      type="text"
      inputMode="decimal"
      value={formatWithCommas(value)}
      onChange={(e) => {
        const stripped = e.target.value.replace(/,/g, '')
        if (stripped === '' || /^\d*\.?\d*$/.test(stripped)) onChange(stripped)
      }}
      placeholder={placeholder}
      className={className}
    />
  )
}

interface CurrencyConfig {
  symbol: string
  label: string
  code: string
  divisor: string
  multiplier: string
  operation: 'multiply' | 'divide'
  resultColor: string
}

const INITIAL_CONFIGS: CurrencyConfig[] = [
  {
    symbol: '$',
    label: 'US Dollar',
    code: 'USD',
    divisor: '1000000',
    multiplier: '0.18',
    operation: 'multiply',
    resultColor: 'text-emerald-400',
  },
  {
    symbol: '€',
    label: 'Euro',
    code: 'EUR',
    divisor: '1000000',
    multiplier: '0.17',
    operation: 'multiply',
    resultColor: 'text-violet-400',
  },
  {
    symbol: 'R$',
    label: 'Brazilian Real',
    code: 'BRL',
    divisor: '1000000',
    multiplier: '0.95',
    operation: 'multiply',
    resultColor: 'text-orange-400',
  },
  {
    symbol: '₱',
    label: 'Philippine Peso',
    code: 'PHP',
    divisor: '10000',
    multiplier: '9.5',
    operation: 'divide',
    resultColor: 'text-rose-400',
  },
]

function CurrencyCard({
  config,
  goldNum,
  onMultiplierChange,
}: {
  config: CurrencyConfig
  goldNum: number | null
  onMultiplierChange: (v: string) => void
}) {
  const result = useMemo(() => {
    if (goldNum === null) return null
    const d = parseFloat(config.divisor)
    const m = parseFloat(config.multiplier)
    if (isNaN(d) || isNaN(m) || d === 0 || m === 0) return null
    return config.operation === 'divide' ? goldNum / d / m : (goldNum / d) * m
  }, [goldNum, config.divisor, config.multiplier, config.operation])

  const formatted =
    result === null
      ? null
      : result.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-ink-700 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-ink-100">{config.label}</p>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-400">
            {config.code}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-1 border-b border-ink-700 px-4 py-6">
        {formatted ? (
          <p
            className={`break-all text-center text-xl font-bold tabular-nums tracking-tight sm:text-2xl ${config.resultColor}`}
          >
            {config.symbol}
            {formatted}
          </p>
        ) : (
          <p className="text-2xl font-bold text-ink-700">—</p>
        )}
      </div>

      <div className="px-4 py-3">
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-ink-500">
          Rate ({config.symbol} per KKS)
        </label>
        <AmountInput
          value={config.multiplier}
          onChange={onMultiplierChange}
          className="w-full rounded-lg border border-ink-600 bg-ink-800 px-3 py-1.5 text-sm font-medium text-ink-200 caret-gold-400 transition-colors focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
        />
      </div>
    </Card>
  )
}

export function GoldCalculator() {
  const [gold, setGold] = useState('')
  const [configs, setConfigs] = useState<CurrencyConfig[]>(INITIAL_CONFIGS)

  const goldNum = useMemo(() => {
    const n = parseFloat(gold.replace(/,/g, ''))
    return isNaN(n) ? null : n
  }, [gold])

  const updateConfig = (i: number, value: string) => {
    setConfigs((prev) => prev.map((c, idx) => (idx === i ? { ...c, multiplier: value } : c)))
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="relative overflow-hidden border-gold-500/30 bg-gold-500/5 p-5">
        <div className="flex items-center gap-2">
          <Coins className="size-4 text-gold-400" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
            Gold Amount
          </span>
        </div>

        <div className="mt-3">
          <AmountInput
            value={gold}
            onChange={setGold}
            placeholder="e.g. 1,000,000,000"
            className="block w-full rounded-xl border-2 border-ink-600 bg-ink-800 px-4 py-3 text-xl font-bold text-ink-50 placeholder:text-ink-600 caret-gold-400 transition-colors focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
          />
        </div>

        <p className="mt-3 text-xs text-ink-400">
          {goldNum !== null ? (
            <span className="font-semibold text-gold-300">{goldNum.toLocaleString()} G</span>
          ) : (
            'Enter a gold amount to see conversions below'
          )}
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {configs.map((cfg, i) => (
          <CurrencyCard
            key={cfg.code}
            config={cfg}
            goldNum={goldNum}
            onMultiplierChange={(v) => updateConfig(i, v)}
          />
        ))}
      </div>
    </div>
  )
}
