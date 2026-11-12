import { Link } from 'react-router-dom'
import { ArrowRight, Check, Lock, MessageCircle, Phone } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { buttonClasses } from '@/components/ui/Button'
import { websiteOffers, websiteProjects, type WebsiteProject } from '@/data/websites'
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

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {websiteOffers.map((o) => (
          <Card key={o.title} className="p-5">
            <p className="font-medium text-ink-100">{o.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{o.detail}</p>
          </Card>
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

function ProjectCard({ project: p }: { project: WebsiteProject }) {
  return (
    <Card className="overflow-hidden">
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
        <div className="grid gap-px border-t border-ink-700 bg-ink-700 sm:grid-cols-2">
          {p.images.map((img) => (
            <a key={img.src} href={img.src} target="_blank" rel="noopener noreferrer" className="block bg-ink-950">
              <img src={img.src} alt={img.alt} loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition-opacity hover:opacity-90" />
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
