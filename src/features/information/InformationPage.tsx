import { ShieldAlert, PlayCircle, Users, Store, Trophy, Flame } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  DISCORD_HANDLE,
  YOUTUBE_URL,
  REFERENCES_DISCORD_URL,
  SERVER_DISCORD_URL,
  SERVER_DISCORD_LABEL,
  MOST_VIEWED_VIDEO_URL,
  MOST_VIEWED_VIDEO_THUMBNAIL,
  MOST_VIEWED_VIDEO_TITLE,
} from '@/lib/links'
import { DiscordServerCard } from './DiscordServerCard'
import { YoutubeChannelCard } from './YoutubeChannelCard'
import { YoutubeVideoCard } from './YoutubeVideoCard'

const proofLinks = [
  { label: 'References', href: REFERENCES_DISCORD_URL, icon: Users },
  { label: SERVER_DISCORD_LABEL, href: SERVER_DISCORD_URL, icon: Store },
  { label: 'YouTube', href: YOUTUBE_URL, icon: PlayCircle },
]

export function InformationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="About Leblanc"
        title="Information"
        description="Verified identity, proof of trades, and where to find Leblanc online."
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <section className="flex flex-col">
          <Card className="flex h-full flex-col gap-4 border-gold-500/30 bg-gold-500/5 p-5">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300">
                <ShieldAlert className="size-5" />
              </span>
              <div>
                <h3 className="font-medium text-ink-100">Only trust {DISCORD_HANDLE}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-300">
                  Leblanc trades exclusively through the{' '}
                  <span className="font-medium text-gold-300">{DISCORD_HANDLE}</span> Discord
                  account. If anyone else reaches out claiming to be Leblanc, it isn't us — verify
                  through the links below before sending anything.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-ink-600">
              <img
                src="/leblancmid.png"
                alt="Leblancmid Lv. 164 in-game character"
                className="h-32 w-full object-cover"
              />
            </div>
            <p className="-mt-2 text-xs uppercase tracking-wider text-ink-500">
              In-game character — Leblancmid Lv. 164
            </p>

            <div className="flex flex-wrap gap-4">
              {proofLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-ink-300 transition-colors hover:text-gold-300"
                >
                  <link.icon className="size-4 text-ink-500" />
                  {link.label}
                </a>
              ))}
            </div>
          </Card>
        </section>

        <section className="flex flex-col">
          <h3 className="flex items-center gap-2 text-lg font-medium text-ink-100">
            <Trophy className="size-5 text-gold-400" />
            Leblanc Highest Trade
          </h3>
          <Card className="mt-5 flex-1 overflow-hidden">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img
                src="/highest-trade.jpg"
                alt="Leblanc's biggest trades in history"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute left-3 top-3">
                <Badge tone="neutral">TOP MELEE</Badge>
              </div>
            </div>
            <p className="p-5 text-sm leading-relaxed text-ink-300">
              The highest trade in Rucoy history — three accounts secured by Leblanc: Top 1
              Melee, Top 4 Distance, and Top 10 Mage, together worth{' '}
              <span className="font-semibold text-gold-300">€9,000</span>. Arrow St, Venecos St,
              and Shiroe St way back 2025.
            </p>
          </Card>
        </section>
      </div>


      <section className="mt-14 rounded-2xl border border-ink-700/60 bg-ink-900/30 p-6 sm:p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-ink-100">
          <Users className="size-5 text-gold-400" />
          Proof & Reach
        </h3>
        <p className="mt-1 text-sm text-ink-400">
          Active community, real trades, and a channel you can verify.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col">
            <h4 className="flex items-center gap-2 text-sm font-medium text-ink-200">
              <PlayCircle className="size-4 text-gold-400" />
              Leblanc Youtube Account
            </h4>
            <div className="mt-3 h-full flex-1">
              <YoutubeChannelCard
                href={YOUTUBE_URL}
                name="Leblanc"
                handle="@SaintLeblanc"
                subscribers="1.5K"
                avatarSrc="/mikey.png"
                bannerSrc="/saint-leblanc.jpg"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <h4 className="flex items-center gap-2 text-sm font-medium text-ink-200">
              <Flame className="size-4 text-gold-400" />
              Most Viewed Video
            </h4>
            <div className="mt-3 h-full flex-1">
              <YoutubeVideoCard
                href={MOST_VIEWED_VIDEO_URL}
                channelName="Leblanc"
                title={MOST_VIEWED_VIDEO_TITLE}
                thumbnailSrc={MOST_VIEWED_VIDEO_THUMBNAIL}
                views="80K"
                uploadedAgo="2 years ago"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
      </section>
    </div>
  )
}
