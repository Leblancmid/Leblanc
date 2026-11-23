import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { proofTrades } from '@/data/published'
import { cn } from '@/lib/cn'
import { TradeCard } from './TradeCard'

/** The home page's proof: the 3 biggest trades with their screenshots, and a link to all of them. */
export function ProvenTradesSection({ className }: { className?: string }) {
  if (proofTrades.length === 0) return null
  const [top, ...rest] = proofTrades.slice(0, 3)

  return (
    <section className={cn('px-4 py-20 sm:px-6', className)}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="References" title="Proven trades" description="Real trades middled by Leblanc, with the screenshots to show for it." />
          {proofTrades.length > 3 && (
            <Link to="/trades" className="flex items-center gap-1.5 text-sm font-medium text-gold-300 transition-colors hover:text-gold-200">
              All {proofTrades.length} trades <ArrowRight className="size-4" />
            </Link>
          )}
        </div>

        {/* items-start: the big card keeps its own height instead of stretching to the two beside it */}
        <div className="mt-10 grid items-start gap-5 lg:grid-cols-[1.3fr_1fr]">
          <TradeCard trade={top} featured />
          {rest.length > 0 && <div className="grid gap-5">{rest.map((t) => <TradeCard key={t.id} trade={t} />)}</div>}
        </div>
      </div>
    </section>
  )
}
