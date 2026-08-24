import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, Users, Store } from 'lucide-react'
import { LinkButton } from '@/components/ui/LinkButton'
import { buttonClasses } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { listings } from '@/data/listings'
import { DiscordServerCard } from '@/features/information/DiscordServerCard'
import { GoldCalculator } from '@/features/gold-calculator/GoldCalculator'
import { ListingsMarquee } from './ListingsMarquee'
import { DISCORD_URL, REFERENCES_DISCORD_URL, SERVER_DISCORD_URL, SERVER_DISCORD_LABEL } from '@/lib/links'

const stats = [
  { value: '€9,000', label: 'Highest trade' },
  { value: String(listings.length), label: 'Accounts listed' },
  { value: '5,000+', label: 'Discord members' },
  { value: '1.2K', label: 'YouTube subscribers' },
]

export function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-16 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl"
        />
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-600 px-4 py-1.5 text-xs uppercase tracking-widest text-gold-300">
              Trusted middleman
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.1] text-ink-50 sm:text-6xl">
              Trading Rucoy accounts, done <span className="text-gold-400">the trusted way</span>
            </h1>
            <p className="mt-5 text-balance text-lg text-ink-300">
              Trading Rucoy accounts, gold, and items — with a €9,000 highest trade on record.
              Also buying accounts level 600–800+, paid via Rucoy gold, Binance, or PayPal.
            </p>
            <p className="mt-3 text-balance text-sm text-ink-400">
              Also building websites on the side — for businesses, projects, or anything else
              you've got in mind. This site's an example; just ask. Payment in Rucoy gold, $, or
              € — whatever's easiest.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LinkButton to="/for-sale" size="lg" className="w-full gap-2 sm:w-auto">
                Browse Accounts For Sale
                <ArrowRight className="size-4" />
              </LinkButton>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses('secondary', 'lg', 'w-full gap-2 sm:w-auto')}
              >
                <MessageCircle className="size-4" />
                Chat on Discord
              </a>
            </div>

            <div className="mt-14 grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-ink-700">
              {stats.map((stat) => (
                <div key={stat.label} className="px-4">
                  <p className="font-display text-2xl text-gold-300 sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-ink-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink-700/60 bg-ink-900/30 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Featured"
              title="Recently listed"
              description="Every account currently up for trade."
            />
            <Link
              to="/for-sale"
              className="flex items-center gap-1.5 text-sm font-medium text-gold-300 transition-colors hover:text-gold-200"
            >
              View all listings
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <ListingsMarquee listings={listings} />
        </div>
      </section>

      <section className="border-t border-ink-700/60 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Community"
            title="Leblanc servers"
            description="Where to find Leblanc's official Discord communities."
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <DiscordServerCard
              name="Leblanc"
              href={REFERENCES_DISCORD_URL}
              iconSrc="/leblancmid.png"
              online={150}
              members={2000}
              established="Nov 2024"
              bannerClassName="bg-gradient-to-b from-emerald-500 to-emerald-700"
              bannerIcon={Users}
            />
            <DiscordServerCard
              name={SERVER_DISCORD_LABEL}
              href={SERVER_DISCORD_URL}
              iconSrc="/asian-market.svg"
              online={450}
              members={5000}
              established="Sep 2023"
              bannerClassName="bg-gradient-to-b from-cyan-400 to-teal-600"
              bannerIcon={Store}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-ink-700/60 bg-ink-900/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Tools"
              title="Gold Calculator"
              description="Convert Rucoy gold into real-world currency using Leblanc's trade rates."
            />
            <Link
              to="/gold-calculator"
              className="flex items-center gap-1.5 text-sm font-medium text-gold-300 transition-colors hover:text-gold-200"
            >
              Open full calculator
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10">
            <GoldCalculator />
          </div>
        </div>
      </section>
    </div>
  )
}
