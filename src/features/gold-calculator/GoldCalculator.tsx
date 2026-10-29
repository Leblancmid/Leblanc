import { useState } from 'react'
import { Coins, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { GOLD_INPUT_PATTERN, formatWithCommas, parseGoldAmount } from '@/lib/gold'
import { formatCompact } from '@/lib/format'
import { cn } from '@/lib/cn'

interface CurrencyConfig {
  symbol: string
  label: string
  code: string
  divisor: number
  multiplier: string
  operation: 'multiply' | 'divide'
  rateLabel: string
}

const INITIAL_CONFIGS: CurrencyConfig[] = [
  {
    symbol: '$',
    label: 'US Dollar',
    code: 'USD',
    divisor: 1_000_000,
    multiplier: '0.18',
    operation: 'multiply',
    rateLabel: '$ per 1M gold',
  },
  {
    symbol: '€',
    label: 'Euro',
    code: 'EUR',
    divisor: 1_000_000,
    multiplier: '0.17',
    operation: 'multiply',
    rateLabel: '€ per 1M gold',
  },
  {
    symbol: 'R$',
    label: 'Brazilian Real',
    code: 'BRL',
    divisor: 1_000_000,
    multiplier: '0.95',
    operation: 'multiply',
    rateLabel: 'R$ per 1M gold',
  },
  {
    symbol: '₱',
    label: 'Philippine Peso',
    code: 'PHP',
    divisor: 10_000,
    multiplier: '9.5',
    operation: 'divide',
    rateLabel: '10k gold per ₱1',
  },
]

const PRESETS = [10_000_000, 100_000_000, 500_000_000, 1_000_000_000]

function convert(gold: number, config: CurrencyConfig): number | null {
  const m = parseFloat(config.multiplier)
  if (!Number.isFinite(m) || m === 0) return null
  return config.operation === 'divide'
    ? gold / config.divisor / m
    : (gold / config.divisor) * m
}

/** "$0.18 per 1M gold" / "₱1 per 95K gold" */
function rateSummary(config: CurrencyConfig): string {
  const m = parseFloat(config.multiplier)
  if (!Number.isFinite(m) || m === 0) return 'No rate set'
  return config.operation === 'divide'
    ? `${config.symbol}1 per ${formatCompact(m * config.divisor)} gold`
    : `${config.symbol}${config.multiplier} per ${formatCompact(config.divisor)} gold`
}

const moneyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const inputClasses =
  'w-full rounded-lg border border-ink-600 bg-ink-800 text-ink-100 caret-gold-400 transition-colors placeholder:text-ink-500 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/40'

export function GoldCalculator() {
  const [gold, setGold] = useState('')
  const [configs, setConfigs] = useState(INITIAL_CONFIGS)
  const [editingRates, setEditingRates] = useState(false)

  const goldNum = parseGoldAmount(gold)
  const invalid = gold.trim() !== '' && goldNum === null
  const ratesChanged = configs.some((c, i) => c.multiplier !== INITIAL_CONFIGS[i].multiplier)

  const updateRate = (code: string, value: string) => {
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) return
    setConfigs((prev) => prev.map((c) => (c.code === code ? { ...c, multiplier: value } : c)))
  }

  return (
    <Card className="@container overflow-hidden">
      <div className="border-b border-ink-700 bg-gold-500/[0.04] p-5 sm:p-6">
        <label htmlFor="gold-amount" className="flex items-center gap-2">
          <Coins className="size-4 text-gold-400" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-300">
            Gold amount
          </span>
        </label>

        <input
          id="gold-amount"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={formatWithCommas(gold)}
          onChange={(e) => {
            if (GOLD_INPUT_PATTERN.test(e.target.value)) setGold(e.target.value.replace(/,/g, ''))
          }}
          placeholder="e.g. 500m or 1,000,000,000"
          aria-invalid={invalid}
          aria-describedby="gold-amount-hint"
          className={cn(
            inputClasses,
            'mt-3 border-2 px-4 py-3 text-xl font-semibold sm:text-2xl',
            invalid && 'border-red-500/60 focus:border-red-400 focus:ring-red-400/30',
          )}
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p id="gold-amount-hint" className="text-xs text-ink-400">
            {invalid ? (
              <span className="text-red-300">Use digits, optionally ending in k, kk/m, or b.</span>
            ) : goldNum !== null ? (
              <span className="font-medium text-gold-300">= {goldNum.toLocaleString('en-US')} gold</span>
            ) : (
              'Shorthand works: 250k, 500m, 1.5b'
            )}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setGold(String(preset))}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  goldNum === preset
                    ? 'border-gold-500/60 bg-gold-500/10 text-gold-300'
                    : 'border-ink-600 text-ink-300 hover:border-gold-500/50 hover:text-gold-300',
                )}
              >
                {formatCompact(preset)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 @3xl:grid-cols-4">
        {configs.map((config, i) => {
          const result = goldNum === null ? null : convert(goldNum, config)
          return (
            <div
              key={config.code}
              className={cn(
                'flex flex-col gap-1 p-4 sm:p-5',
                i % 2 === 0 && 'border-r border-ink-700',
                i < configs.length - 1 && '@3xl:border-r',
                i < 2 && 'border-b border-ink-700 @3xl:border-b-0',
              )}
            >
              <p className="flex items-baseline justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-400">
                  {config.code}
                </span>
                <span className="truncate text-xs text-ink-400">{config.label}</span>
              </p>
              <p
                aria-live="polite"
                className={cn(
                  'break-all text-xl font-semibold tabular-nums tracking-tight sm:text-2xl',
                  result === null ? 'text-ink-600' : 'text-ink-50',
                )}
              >
                {result === null ? '—' : `${config.symbol}${moneyFormatter.format(result)}`}
              </p>

              {editingRates ? (
                <label className="mt-2 block">
                  <span className="mb-1 block text-[11px] text-ink-400">{config.rateLabel}</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={config.multiplier}
                    onChange={(e) => updateRate(config.code, e.target.value)}
                    className={cn(inputClasses, 'px-2.5 py-1.5 text-sm')}
                  />
                </label>
              ) : (
                <p className="text-xs text-ink-400">{rateSummary(config)}</p>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-ink-700 px-5 py-3">
        <p className="text-xs text-ink-400">Rates are Leblanc's current trade rates.</p>
        <div className="flex items-center gap-1">
          {ratesChanged && (
            <button
              type="button"
              onClick={() => setConfigs(INITIAL_CONFIGS)}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-ink-300 transition-colors hover:text-gold-300"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </button>
          )}
          <button
            type="button"
            aria-pressed={editingRates}
            onClick={() => setEditingRates((v) => !v)}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-ink-300 transition-colors hover:text-gold-300"
          >
            <SlidersHorizontal className="size-3.5" />
            {editingRates ? 'Done' : 'Adjust rates'}
          </button>
        </div>
      </div>
    </Card>
  )
}
