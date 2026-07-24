import { ShieldAlert, PlayCircle, Users, Store, Trophy } from 'lucide-react'
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
} from '@/lib/links'

const proofLinks = [
  { label: 'References', href: REFERENCES_DISCORD_URL, icon: Users },
  { label: SERVER_DISCORD_LABEL, href: SERVER_DISCORD_URL, icon: Store },
  { label: 'YouTube', href: YOUTUBE_URL, icon: PlayCircle },
]

const serverLinks = [
  { label: 'References', href: REFERENCES_DISCORD_URL },
  { label: SERVER_DISCORD_LABEL, href: SERVER_DISCORD_URL },
]

const youtubeLinks = [{ label: 'Most Viewed Video', href: MOST_VIEWED_VIDEO_URL }]

export function InformationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="About Leblanc"
        title="Information"
        description="Everything you need to know about trading with Leblanc — verified identity, proof of trades, and where to find Leblanc online."
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
              The highest trade in Rucoy history — three accounts secured in a single deal:
              the server's Top 1 Melee, Top 4 Distance, and Top 10 Mage, together worth €9,000.
              Arrow St, Venecos St, and Shiroe St all changed hands through Leblanc way ba.
            </p>
          </Card>
        </section>
      </div>

      <section className="mt-14">
        <h3 className="flex items-center gap-2 text-lg font-medium text-ink-100">
          <Store className="size-5 text-gold-400" />
          Leblanc Server
        </h3>
        <Card className="mt-5 p-5">
          <ul className="space-y-2">
            {serverLinks.map((link) => (
              <li key={link.label} className="flex gap-2 text-sm text-ink-300">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-gold-500" />
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="mt-14">
        <h3 className="flex items-center gap-2 text-lg font-medium text-ink-100">
          <PlayCircle className="size-5 text-gold-400" />
          Leblanc Youtube Account
        </h3>
        <Card className="mt-5 p-5">
          <ul className="space-y-2">
            {youtubeLinks.map((link) => (
              <li key={link.label} className="flex gap-2 text-sm text-ink-300">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-gold-500" />
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  )
}
