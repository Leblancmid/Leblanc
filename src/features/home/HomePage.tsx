import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  HandCoins,
  MessageCircle,
  Phone,
  ShieldCheck,
  Store,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { LinkButton } from '@/components/ui/LinkButton'
import { buttonClasses } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { listings } from '@/data/listings'
import {
  BUYING_LEVEL_RANGE,
  HIGHEST_TRADE,
  PAYMENT_METHODS,
  YOUTUBE_SUBSCRIBERS,
  communities,
  totalDiscordMembers,
} from '@/data/site'
import { ListingCard } from '@/features/for-sale/ListingCard'
import { GoldCalculator } from '@/features/gold-calculator/GoldCalculator'
import { CommunityCard } from '@/features/information/CommunityCard'
import { TrustNotice } from '@/features/information/TrustNotice'
import { DISCORD_URL, WHATSAPP_URL } from '@/lib/links'
import { formatCompactPlus, formatOrList } from '@/lib/format'
import { listingPath } from '@/lib/listings'

const stats = [
  { value: HIGHEST_TRADE, label: 'Highest trade' },
  { value: String(listings.length), label: 'Accounts for sale' },
  { value: formatCompactPlus(totalDiscordMembers), label: 'Discord members' },
  { value: YOUTUBE_SUBSCRIBERS, label: 'YouTube subscribers' },
]

interface Service {
  icon: LucideIcon
  title: string
  body: string
  cta: { label: string; to: string } | { label: string; href: string }
}

const services: Service[] = [
  {
    icon: ShieldCheck,
    title: 'Middleman',
    body: `Accounts, gold, and items held and handed over safely — with a ${HIGHEST_TRADE} trade on record.`,
    cta: { label: 'Start a trade', href: DISCORD_URL },
  },
  {
    icon: HandCoins,
    title: 'Buying accounts',
    body: `Selling a Lv. ${BUYING_LEVEL_RANGE} account? Get paid in ${formatOrList(PAYMENT_METHODS)}.`,
    cta: { label: 'Get an offer', href: DISCORD_URL },
  },
  {
    icon: Store,
    title: 'Accounts for sale',
    body: `${listings.length} melee, distance, and magic accounts listed with full stats.`,
    cta: { label: 'Browse listings', to: '/for-sale' },
  },
]

const featured = listings
  .filter((l) => l.featured)
  .sort((a, b) => b.level - a.level)
  .slice(0, 3)

const linkClasses =
  'flex items-center gap-1.5 text-sm font-medium text-gold-300 transition-colors hover:text-gold-200'

export function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 left-1/4 -z-10 size-[28rem] rounded-full bg-gold-500/10 blur-3xl"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/5 px-3.5 py-1 text-xs font-medium uppercase tracking-widest text-gold-300">
              <BadgeCheck className="size-3.5" />
              Trusted Rucoy middleman
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] text-ink-50 sm:text-6xl">
              Rucoy trades, done <span className="italic text-gold-400">the trusted way</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-ink-300 lg:mx-0">
              Accounts, gold, and items — middled by Leblanc, with a {HIGHEST_TRADE} highest
              trade on record.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <LinkButton to="/for-sale" size="lg" className="w-full sm:w-auto">
                Browse accounts
                <ArrowRight className="size-4" />
              </LinkButton>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses('secondary', 'lg', 'w-full sm:w-auto')}
              >
                <MessageCircle className="size-4" />
                Chat on Discord
              </a>
            </div>
            <p className="mt-5 text-sm text-ink-400">
              Pay or get paid via{' '}
              <span className="text-ink-200">{formatOrList(PAYMENT_METHODS)}</span>.
            </p>
          </div>

          <Link
            to="/information"
            className="group relative block overflow-hidden rounded-2xl border border-ink-600 bg-ink-900 shadow-[0_30px_80px_-30px_rgba(212,165,74,0.35)] transition-colors hover:border-gold-500/50"
          >
            <img
              src="/highest-trade.jpg"
              alt="The three accounts in Leblanc's record trade"
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-300">
                <Trophy className="size-3.5" />
                Highest trade on record
              </p>
              <p className="mt-1 font-display text-4xl text-ink-50">{HIGHEST_TRADE}</p>
              <p className="mt-1 text-sm text-ink-300">
                Top 1 Melee, Top 4 Distance, and Top 10 Mage — secured by Leblanc.
              </p>
            </div>
          </Link>
        </div>

        <dl className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-700 bg-ink-700 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse bg-ink-950 px-5 py-5 text-center sm:text-left"
            >
              <dt className="mt-1 text-xs uppercase tracking-wider text-ink-400">{stat.label}</dt>
              <dd className="font-display text-3xl text-gold-300">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Services */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <TrustNotice
            action={
              <Link to="/information" className={linkClasses}>
                How to verify
                <ArrowRight className="size-4" />
              </Link>
            }
          />

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <Card key={service.title} className="flex flex-col p-6">
                <span className="flex size-10 items-center justify-center rounded-lg border border-ink-600 bg-ink-800 text-gold-400">
                  <service.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-2xl font-medium text-ink-100">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-300">{service.body}</p>
                {'to' in service.cta ? (
                  <Link to={service.cta.to} className={`${linkClasses} mt-5`}>
                    {service.cta.label}
                    <ArrowRight className="size-4" />
                  </Link>
                ) : (
                  <a
                    href={service.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkClasses} mt-5`}
                  >
                    {service.cta.label}
                    <ArrowRight className="size-4" />
                  </a>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="border-t border-ink-700/60 bg-ink-900/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Featured"
              title="Accounts for sale"
              description="Hand-picked listings. Every account comes with its full stats screen."
            />
            <Link to="/for-sale" className={linkClasses}>
              View all {listings.length}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} to={listingPath(listing.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* Calculator + community */}
      <section className="border-t border-ink-700/60 px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Tools"
                title="Gold calculator"
                description="Convert Rucoy gold at Leblanc's trade rates."
              />
              <Link to="/gold-calculator" className={linkClasses}>
                Full page
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-8">
              <GoldCalculator />
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Community"
              title="Join the Discords"
              description="References, trades, and the market."
            />
            <div className="mt-8 flex flex-col gap-3">
              {communities.map((community) => (
                <CommunityCard key={community.name} community={community} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 px-6 py-12 text-center sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-gold-500/15 blur-3xl"
          />
          <h2 className="font-display text-4xl text-ink-50 sm:text-5xl">Have a trade in mind?</h2>
          <p className="mx-auto mt-3 max-w-lg text-ink-300">
            Message Leblanc directly — buying, selling, or middling. Need a website too? Just
            ask; this site is an example.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses('primary', 'lg')}
            >
              <MessageCircle className="size-4" />
              Message on Discord
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses('secondary', 'lg')}
            >
              <Phone className="size-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
