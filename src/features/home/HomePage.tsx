import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { LinkButton } from '@/components/ui/LinkButton'
import { Card } from '@/components/ui/Card'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { listings } from '@/data/listings'
import { ListingThumbnail } from '@/features/for-sale/ListingThumbnail'
import { DiscordServerCard } from '@/features/information/DiscordServerCard'
import { REFERENCES_DISCORD_URL, SERVER_DISCORD_URL, SERVER_DISCORD_LABEL } from '@/lib/links'

const featured = listings.filter((l) => l.featured).slice(0, 3)

export function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-600 px-4 py-1.5 text-xs uppercase tracking-widest text-gold-300">
              Trusted middleman, verified identity
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.1] text-ink-50 sm:text-6xl">
              Welcome to <span className="text-gold-400">Leblanc Website</span>
            </h1>
            <p className="mt-5 text-balance text-lg text-ink-300">
              A trusted middleman for top accounts and honest trades — no bots, just Leblanc
              keeping every deal straight. Look around, then reach out when you're ready.
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
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink-700/60 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Featured"
              title="Recently listed"
              description="A small selection of what's currently up for trade."
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
            {featured.map((listing) => (
              <Card key={listing.id} interactive className="overflow-hidden animate-slide-up">
                <Link
                  to="/for-sale"
                  className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
                >
                  <ListingThumbnail listing={listing} showSlots />
                </Link>
              </Card>
            ))}
          </div>
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
            />
            <DiscordServerCard
              name={SERVER_DISCORD_LABEL}
              href={SERVER_DISCORD_URL}
              online={450}
              members={5000}
              established="Sep 2023"
              bannerClassName="bg-gradient-to-b from-cyan-400 to-teal-600"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
