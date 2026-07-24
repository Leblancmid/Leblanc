import type { FaqItem, GuidelineSection } from '@/types'

export const guidelines: GuidelineSection[] = [
  {
    title: 'Membership & conduct',
    points: [
      'Every member is introduced by an existing member — cold applications are not reviewed.',
      'Listings and inquiries are treated as confidential and are never shared outside the house.',
      'Bad-faith negotiation or misrepresentation of an item is grounds for immediate removal.',
    ],
  },
  {
    title: 'Buying & selling',
    points: [
      'Sellers must disclose known condition issues before a listing is published.',
      'All transactions are settled through the Ledger service; cash handoffs are not facilitated.',
      'A 3% house commission applies to completed sales, split evenly between both parties.',
    ],
  },
  {
    title: 'Concierge services',
    points: [
      'Retainers renew monthly and can be paused with seven days’ notice.',
      'Service requests outside standard hours are routed through the on-call desk.',
      'Concierge staff will never ask for payment details outside the Ledger.',
    ],
  },
]

export const faqs: FaqItem[] = [
  {
    question: 'How do I get access to Leblanc?',
    answer:
      'Membership is by introduction only. An existing member can vouch for you through the Information desk, after which the house will reach out directly.',
  },
  {
    question: 'How are prices set on listings?',
    answer:
      'Sellers propose an asking price; the house reviews comparable listings and recent sales before a listing is published, but final terms are agreed privately between both parties.',
  },
  {
    question: 'Is there a fee to list an item?',
    answer:
      'Listing is free. A modest commission is only taken once a sale completes through the Ledger, split evenly between buyer and seller.',
  },
  {
    question: 'Can I remain anonymous during a sale?',
    answer:
      'Yes. Communication can be routed entirely through the Concierge desk, and your name is disclosed only once both sides confirm a deal.',
  },
  {
    question: 'What happens if an item is misrepresented?',
    answer:
      'Report it to the house immediately. Misrepresentation is treated as a serious breach and may result in the listing being pulled and the member reviewed.',
  },
]
