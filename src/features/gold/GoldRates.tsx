import { useState } from 'react'
import { Coins, HandCoins } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { gold } from '@/data/published'
import { formatKk, formatRate } from '@/lib/orders'
import { GoldOrderForm } from './GoldOrderForm'
import { SellGoldForm } from './SellGoldForm'

/** Leblanc's current gold rates (published from the Budget app), an "Order gold" form, and "Sell gold". */
export function GoldRates() {
  const [ordering, setOrdering] = useState(false)
  const [selling, setSelling]   = useState(false)
  if (gold.rates.length === 0) return null

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg border border-ink-600 bg-ink-800 text-gold-400">
          <Coins className="size-5" />
        </span>
        <div className="flex-1">
          <p className="text-lg font-medium text-ink-100">Buy gold</p>
          <p className="text-xs text-ink-400">Today's rates, per 1KK (1,000,000) gold{gold.min_order_kk ? ` · minimum ${formatKk(gold.min_order_kk)}` : ''}</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {gold.rates.map((r) => (
          <div key={r.method} className="rounded-lg border border-ink-700 bg-ink-800/40 px-3 py-2">
            <dt className="text-[11px] uppercase tracking-wider text-ink-400">{r.method}</dt>
            <dd className="font-display text-2xl text-gold-300">{formatRate(r)}</dd>
          </div>
        ))}
      </dl>
      {gold.note && <p className="text-sm text-ink-300">{gold.note}</p>}

      {ordering
        ? <GoldOrderForm onCancel={() => setOrdering(false)} />
        : <Button onClick={() => setOrdering(true)} className="self-start"><Coins className="size-4" /> Order gold</Button>}

      {/* The other way: they have gold and want to sell it */}
      <div className="flex flex-col gap-3 border-t border-ink-700 pt-4">
        {selling ? (
          <SellGoldForm onCancel={() => setSelling(false)} />
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-ink-100">Sell gold?</p>
              <p className="text-xs text-ink-400">Tell Leblanc how much you have and your rate. You'll get an answer on Discord or WhatsApp.</p>
            </div>
            <Button variant="secondary" onClick={() => setSelling(true)}><HandCoins className="size-4" /> Sell gold</Button>
          </div>
        )}
      </div>
    </Card>
  )
}
