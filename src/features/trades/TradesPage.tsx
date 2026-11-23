import { Trophy } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { formatTradeValue, proofTrades } from '@/data/published'
import { TradeCard } from './TradeCard'

/** /trades: every proven trade, biggest first, with all their screenshots. */
export function TradesPage() {
  const total = proofTrades.reduce((s, t) => (t.currency === proofTrades[0]?.currency ? s + t.value : s), 0)

  return (
    <div className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="References" title="Proven trades" description="Real trades middled by Leblanc. Tap a trade to see its screenshots." />

        {proofTrades.length === 0 ? (
          <p className="mt-10 text-ink-300">The trade references are on their way. Ask Leblanc on Discord in the meantime.</p>
        ) : (
          <>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 text-sm text-ink-300">
                <Trophy className="size-4 text-gold-400" /> Biggest <span className="font-display text-2xl text-gold-300">{formatTradeValue(proofTrades[0])}</span>
              </span>
              <span className="rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 text-sm text-ink-300">
                <span className="font-display text-2xl text-ink-50">{proofTrades.length}</span> trades shown
                {total > 0 && <> · <span className="text-ink-100">{formatTradeValue({ value: total, currency: proofTrades[0].currency })}</span> in total</>}
              </span>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {proofTrades.map((t) => <TradeCard key={t.id} trade={t} featured={t.rank === 1} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
