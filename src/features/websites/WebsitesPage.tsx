import { Link } from 'react-router-dom'
import { ArrowRight, Check, LayoutDashboard, Lock, MessageCircle, Phone, Store, Wrench } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { buttonClasses } from '@/components/ui/Button'
import { websiteOffers, websiteProjects, type WebsiteOffer, type WebsiteProject } from '@/data/websites'
import { DISCORD_URL, WHATSAPP_URL } from '@/lib/links'

/** Websites and business systems built by Leblanc, and how to ask for one. */
export function WebsitesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Websites by Leblanc"
        title="I build websites and business systems"
        description="Online stores, catalogues and the systems a business runs on. This site is one of them. Payable in Rucoy gold, $ or €."
      />

      <div className="mt-8 flex flex-wrap gap-3">
        <ContactButtons />
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {websiteOffers.map((o) => (
          <OfferCard key={o.id} offer={o} />
        ))}
      </div>

      <section className="mt-16">
        <h3 className="text-xl font-medium text-ink-100">Things I've built</h3>
        <div className="mt-6 flex flex-col gap-6">
          {websiteProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      <Card className="mt-16 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="font-display text-2xl text-ink-100">Want one for your shop or business?</p>
          <p className="mt-1 text-sm text-ink-300">Tell me what you need. I'll reply with questions and a fixed quote before any work starts.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <ContactButtons />
        </div>
      </Card>
    </div>
  )
}

function ContactButtons() {
  return (
    <>
      <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className={buttonClasses('primary', 'md')}>
        <MessageCircle className="size-4" />
        Message on Discord
      </a>
      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={buttonClasses('secondary', 'md')}>
        <Phone className="size-4" />
        WhatsApp
      </a>
    </>
  )
}

const OFFER_ICONS = { store: Store, system: LayoutDashboard, fix: Wrench }

/** One thing I take on: what's included, how long it usually takes, and examples on this page. */
function OfferCard({ offer: o }: { offer: WebsiteOffer }) {
  const Icon = OFFER_ICONS[o.icon]
  return (
    <Card className="flex flex-col p-6">
      <span className="flex size-10 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-4 text-xl font-medium text-ink-100">{o.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-300">{o.pitch}</p>

      <ul className="mt-5 space-y-2 text-sm text-ink-200">
        {o.includes.map((item) => (
          <li key={item} className="flex gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-6 border-t border-ink-700 pt-5 text-sm text-ink-300">
        Typical timeline: <span className="font-medium text-ink-100">{o.timeline}</span>
      </p>
      {o.proof.length > 0 && (
        <p className="mt-3 text-xs text-ink-400">
          Built before:{' '}
          {o.proof.map((p, i) => (
            <span key={p.projectId}>
              {i > 0 && ', '}
              <a href={`#${p.projectId}`} className="text-ink-200 underline decoration-ink-500 underline-offset-2 hover:text-gold-300">
                {p.label}
              </a>
            </span>
          ))}
        </p>
      )}

      <div className="mt-auto pt-6">
        <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className={buttonClasses('primary', 'md', 'w-full justify-center')}>
          Get a quote
          <ArrowRight className="size-4" />
        </a>
      </div>
    </Card>
  )
}

function ProjectCard({ project: p }: { project: WebsiteProject }) {
  return (
    <Card id={p.id} className="scroll-mt-24 overflow-hidden">
      <div className="p-6">
        <Badge tone="gold">{p.kind}</Badge>
        <h4 className="mt-3 font-display text-2xl text-ink-100">{p.title}</h4>
        <p className="mt-2 max-w-3xl leading-relaxed text-ink-300">{p.summary}</p>
        <ul className="mt-4 grid gap-2 text-sm text-ink-200 sm:grid-cols-3">
          {p.points.map((point) => (
            <li key={point} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-gold-400" />
              {point}
            </li>
          ))}
        </ul>
        {p.link && (
          <Link to={p.link.to} className="mt-5 inline-flex items-center gap-1.5 text-sm text-gold-300 hover:text-gold-200">
            {p.link.label}
            <ArrowRight className="size-4" />
          </Link>
        )}
      </div>

      {p.images && (
        <div className="grid gap-px border-t border-ink-700 bg-ink-700 sm:grid-cols-2 lg:grid-cols-3">
          {p.images.map((img) => (
            <a key={img.src} href={img.src} target="_blank" rel="noopener noreferrer" className="group block bg-ink-950" title="Open full size">
              <img src={img.src} alt={img.alt} loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition-opacity group-hover:opacity-90" />
              <span className="block px-3 py-2.5">
                <span className="block text-sm font-medium text-ink-100 group-hover:text-gold-300">{img.caption}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-400">{img.highlight}</span>
              </span>
            </a>
          ))}
        </div>
      )}

      {p.note && (
        <p className="flex items-center gap-2 border-t border-ink-700 px-6 py-3 text-xs text-ink-400">
          {!p.images && <Lock className="size-3.5" />}
          {p.note}
        </p>
      )}
    </Card>
  )
}
