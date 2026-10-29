import { Flame, PlayCircle, Store, Trophy, Users } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import { HIGHEST_TRADE, YOUTUBE_SUBSCRIBERS, communities } from '@/data/site'
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
import { CommunityCard } from './CommunityCard'
import { TrustNotice } from './TrustNotice'
import { YoutubeChannelCard } from './YoutubeChannelCard'
import { YoutubeVideoCard } from './YoutubeVideoCard'

const proofLinks = [
  { label: 'References', href: REFERENCES_DISCORD_URL, icon: Users },
  { label: SERVER_DISCORD_LABEL, href: SERVER_DISCORD_URL, icon: Store },
  { label: 'YouTube', href: YOUTUBE_URL, icon: PlayCircle },
]

function SubHeading({ icon: Icon, children }: { icon: typeof Trophy; children: string }) {
  return (
    <h3 className="flex items-center gap-2 text-xl font-medium text-ink-100">
      <Icon className="size-5 text-gold-400" />
      {children}
    </h3>
  )
}

export function InformationPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="About Leblanc"
        title="Verify before you trade"
        description="Verified identity, proof of trades, and where to find Leblanc online."
      />

      <TrustNotice className="mt-10" />

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col overflow-hidden">
          <img
            src="/leblancmid.png"
            alt={`${DISCORD_HANDLE} Lv. 164 in-game character`}
            className="h-44 w-full object-cover"
          />
          <div className="flex flex-1 flex-col gap-4 p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                In-game character
              </p>
              <p className="mt-1 font-display text-2xl text-ink-100">Leblancmid · Lv. 164</p>
            </div>
            <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 border-t border-ink-700 pt-4">
              {proofLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-ink-300 transition-colors hover:text-gold-300"
                >
                  <link.icon className="size-4 text-ink-400" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <img
            src="/highest-trade.jpg"
            alt="The three accounts in Leblanc's record trade"
            className="h-44 w-full object-cover"
          />
          <div className="flex flex-1 flex-col gap-2 p-5">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gold-400">
              <Trophy className="size-3.5" />
              Highest trade
            </p>
            <p className="font-display text-3xl text-ink-50">{HIGHEST_TRADE}</p>
            <p className="text-sm leading-relaxed text-ink-300">
              The highest trade in Rucoy history — three accounts secured by Leblanc: Top 1
              Melee, Top 4 Distance, and Top 10 Mage. Arrow St, Venecos St, and Shiroe St, back
              in 2025.
            </p>
          </div>
        </Card>
      </div>

      <section className="mt-16">
        <SubHeading icon={PlayCircle}>On YouTube</SubHeading>
        <p className="mt-1 text-sm text-ink-400">
          {YOUTUBE_SUBSCRIBERS} subscribers and a channel you can verify.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <YoutubeChannelCard
            href={YOUTUBE_URL}
            name="Leblanc"
            handle="@SaintLeblanc"
            subscribers={YOUTUBE_SUBSCRIBERS}
            avatarSrc="/mikey.png"
            bannerSrc="/saint-leblanc.jpg"
          />
          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-2 text-sm font-medium text-ink-200">
              <Flame className="size-4 text-gold-400" />
              Most viewed video
            </p>
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
      </section>

      <section className="mt-16">
        <SubHeading icon={Users}>Discord communities</SubHeading>
        <p className="mt-1 text-sm text-ink-400">Active members, real trades, public references.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {communities.map((community) => (
            <CommunityCard key={community.name} community={community} />
          ))}
        </div>
      </section>
    </div>
  )
}
