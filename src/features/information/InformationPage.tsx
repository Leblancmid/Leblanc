import { BookOpen, ShieldCheck, HelpCircle } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import { guidelines, faqs } from '@/data/information'
import { Accordion } from './Accordion'

const steps = [
  {
    title: 'Get introduced',
    description: 'An existing member vouches for you and the house reaches out directly.',
  },
  {
    title: 'Browse quietly',
    description: 'Look through current listings and server standing at your own pace.',
  },
  {
    title: 'Speak to the house',
    description: 'Inquire on anything of interest; the concierge desk handles the rest.',
  },
  {
    title: 'Settle through the Ledger',
    description: 'Every transaction is confirmed and settled through the house Ledger.',
  },
]

export function InformationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="About the house"
        title="Information"
        description="Everything a member needs to know about how Leblanc runs — from getting in, to buying and selling, to who to ask when something's unclear."
      />

      <section className="mt-12">
        <h3 className="flex items-center gap-2 text-lg font-medium text-ink-100">
          <BookOpen className="size-5 text-gold-400" />
          How it works
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {steps.map((step, index) => (
            <Card key={step.title} className="p-5">
              <span className="flex size-8 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-sm font-medium text-gold-300">
                {index + 1}
              </span>
              <h4 className="mt-3 font-medium text-ink-100">{step.title}</h4>
              <p className="mt-1 text-sm text-ink-400">{step.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h3 className="flex items-center gap-2 text-lg font-medium text-ink-100">
          <ShieldCheck className="size-5 text-gold-400" />
          House guidelines
        </h3>
        <div className="mt-5 space-y-4">
          {guidelines.map((section) => (
            <Card key={section.title} className="p-5">
              <h4 className="font-medium text-ink-100">{section.title}</h4>
              <ul className="mt-3 space-y-2">
                {section.points.map((point) => (
                  <li key={point} className="flex gap-2 text-sm text-ink-300">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-gold-500" />
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14 pb-4">
        <h3 className="flex items-center gap-2 text-lg font-medium text-ink-100">
          <HelpCircle className="size-5 text-gold-400" />
          Frequently asked questions
        </h3>
        <div className="mt-5">
          <Accordion
            items={faqs.map((faq, i) => ({
              id: `faq-${i}`,
              title: faq.question,
              content: faq.answer,
            }))}
            defaultOpenId="faq-0"
          />
        </div>
      </section>
    </div>
  )
}
