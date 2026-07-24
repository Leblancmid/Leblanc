import { Link } from 'react-router-dom'
import { ArrowRight, Car, Building2, Gem, Sparkles } from 'lucide-react'
import { LinkButton } from '@/components/ui/LinkButton'
import { Card } from '@/components/ui/Card'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import { StatBlock } from './StatBlock'
import { listings } from '@/data/listings'

const categoryIcon = {
  Vehicle: Car,
  Property: Building2,
  Collectible: Gem,
  Service: Sparkles,
} as const

const featured = listings.filter((l) => l.featured).slice(0, 3)

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-600 px-4 py-1.5 text-xs uppercase tracking-widest text-gold-300">
              Members by introduction only
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.1] text-ink-50 sm:text-6xl">
              Welcome to <span className="text-gold-400">Leblanc</span>
            </h1>
            <p className="mt-5 text-balance text-lg text-ink-300">
              A private house for rare listings, quiet arrangements, and the small print that
              keeps everyone honest. Step in, look around, and speak to the house when you're
              ready.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LinkButton to="/for-sale" size="lg" className="w-full gap-2 sm:w-auto">
                Browse For Sale
                <ArrowRight className="size-4" />
              </LinkButton>
              <LinkButton to="/server" variant="secondary" size="lg" className="w-full sm:w-auto">
                Check server status
              </LinkButton>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4">
            <StatBlock value={18} label="Active listings" />
            <StatBlock value={342} label="Members online" />
            <StatBlock value={99} suffix=".97%" label="Network uptime" />
            <StatBlock value={7} label="Years established" />
          </div>
        </div>
      </section>

      <section className="border-t border-ink-700/60 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Featured"
              title="Recently listed"
              description="A small selection of what's currently for sale within the house."
            />
            <Link
              to="/for-sale"
              className="flex items-center gap-1.5 text-sm font-medium text-gold-300 transition-colors hover:text-gold-200"
            >
              View all listings
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => {
              const Icon = categoryIcon[listing.category]
              return (
                <Card
                  key={listing.id}
                  interactive
                  className="flex flex-col p-5 animate-slide-up"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-lg border border-ink-600 bg-ink-800 text-gold-400">
                      <Icon className="size-5" />
                    </span>
                    <Badge tone="gold">{listing.category}</Badge>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-ink-100">{listing.title}</h3>
                  <p className="mt-1 text-sm text-ink-400">{listing.location}</p>
                  <p className="mt-4 text-xl font-medium text-gold-300">
                    {currency.format(listing.price)}
                  </p>
                  <Link
                    to="/for-sale"
                    className="mt-4 flex items-center gap-1.5 text-sm text-ink-300 transition-colors hover:text-gold-300"
                  >
                    View details
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-ink-700/60 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'For Sale',
                description: 'Vehicles, properties, collectibles, and standing retainers.',
                to: '/for-sale',
              },
              {
                title: 'Information',
                description: 'House guidelines, membership terms, and frequently asked questions.',
                to: '/information',
              },
              {
                title: 'Server',
                description: 'Live network status, connection details, and service health.',
                to: '/server',
              },
            ].map((item) => (
              <Link key={item.to} to={item.to}>
                <Card interactive className="h-full p-6">
                  <h3 className="text-lg font-medium text-ink-100">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-400">{item.description}</p>
                  <span className="mt-4 flex items-center gap-1.5 text-sm text-gold-300">
                    Explore
                    <ArrowRight className="size-3.5" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
