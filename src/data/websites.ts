// Websites built by Leblanc: what's shown on /websites. Kept anonymous on purpose: no real names,
// no company names, and no links to any other profile.

export interface WebsiteProject {
  id: string
  /** "Online store", "Business system" */
  kind: string
  title: string
  summary: string
  points: string[]
  /** Screenshots in /public (amounts hidden) */
  images?: { src: string; alt: string }[]
  /** Shown under the project, e.g. why there are no screenshots */
  note?: string
  /** A page on this site that shows it */
  link?: { label: string; to: string }
}

export const websiteProjects: WebsiteProject[] = [
  {
    id: 'storefront',
    kind: 'Online store',
    title: 'This website',
    summary:
      "The page you're on. Accounts with their full stats, live gold rates and order forms. Every request reaches my Discord within seconds, and the listings update themselves from my back office.",
    points: [
      'Fast on any phone, hosted for free',
      'Order, request and sell forms that land straight in my inbox',
      'Visitor stats without third-party trackers',
    ],
    link: { label: 'See the listings', to: '/for-sale' },
  },
  {
    id: 'back-office',
    kind: 'Business system',
    title: 'Business back office',
    summary:
      'The private system behind this store. It keeps sales and profit, gold stock and the money across eight wallets in two currencies in one place, and publishes the listings you see here in one click.',
    points: [
      'Works on a phone, even offline; changes wait for my approval before they sync',
      'Undo for any action, with a full history of who changed what',
      'Monthly charts, reports and a weekly summary',
    ],
    images: [
      { src: '/websites/back-office-overview.png', alt: 'Back office overview: net worth by month and where it is held, amounts hidden' },
      { src: '/websites/back-office-wallets.png', alt: 'Back office wallets in two currencies, amounts hidden' },
    ],
    note: 'Amounts are hidden in these screenshots.',
  },
  {
    id: 'company-platform',
    kind: 'Business system',
    title: 'Company request & approval platform',
    summary:
      'An internal platform a Philippine company uses every day for staff requests. Each one goes to the right approver, everyone can see whose turn it is, and access is set role by role.',
    points: [
      'Live notifications and email for approvers',
      'Supplier access and inventory records',
      'Reports with Excel export',
    ],
    note: "It's an internal company system, so it isn't shown publicly.",
  },
]

/** What I take on */
export const websiteOffers = [
  { title: 'Online stores & catalogues', detail: 'Your products or listings, with orders and questions sent to your Discord, Messenger or email.' },
  { title: 'Business systems', detail: 'Sales, stock, requests and approvals in one place for you and your team, with reports.' },
  { title: 'Fixes & new features', detail: 'An existing site that is broken, slow or missing something.' },
]
