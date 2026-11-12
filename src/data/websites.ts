// Websites built by Leblanc: what's shown on /websites. Kept anonymous on purpose: no real names,
// no company names, and no links to any other profile.

export interface WebsiteProject {
  id: string
  /** "Online store", "Business system" */
  kind: string
  title: string
  summary: string
  points: string[]
  /** Screenshots in /public (sample data only) */
  images?: { src: string; caption: string; alt: string }[]
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
      { src: '/websites/overview.png', caption: 'Overview', alt: 'Overview: net worth by month, where it is held, and profit' },
      { src: '/websites/business-stats.png', caption: 'Business stats', alt: 'Business stats: sold profit, revenue, cost and margin, with a weekly brief' },
      { src: '/websites/business-sales.png', caption: 'Sales', alt: 'Sales: accounts for sale with price, cost and profit' },
      { src: '/websites/business-listing-kit.png', caption: 'Listing Kit', alt: 'Listing Kit: the sale image built from the accounts for sale' },
      { src: '/websites/business-leads.png', caption: 'Leads', alt: 'Leads: website requests and live visitor stats' },
      { src: '/websites/business-report.png', caption: 'Report', alt: 'Business report: revenue against cost by month and profit by type' },
      { src: '/websites/rucoy-summary.png', caption: 'Gold summary', alt: 'Gold summary: stash, trades and daily gold flow' },
      { src: '/websites/rucoy-trades.png', caption: 'Trades', alt: 'Trades: open gold and cash trades with middleman fees' },
      { src: '/websites/wallets.png', caption: 'Wallets', alt: 'Wallets in two currencies' },
    ],
    note: 'Screens shown with sample data, not real figures.',
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

export interface WebsiteOffer {
  id: string
  icon: 'store' | 'system' | 'fix'
  title: string
  pitch: string
  includes: string[]
  timeline: string
  /** Examples further down this page (ids of websiteProjects) */
  proof: { label: string; projectId: string }[]
}

/** What I take on. Worded for Leblanc's own visitors (not copied from anywhere else). */
export const websiteOffers: WebsiteOffer[] = [
  {
    id: 'store',
    icon: 'store',
    title: 'Online store or catalogue',
    pitch: 'A quick site for what you sell, so buyers can browse and message you without a long chat first.',
    includes: [
      'Listings or products you can change any time',
      'Requests delivered to your Discord, Messenger or email',
      'See how many people visit, privately',
      'No monthly hosting bill',
    ],
    timeline: '1–3 weeks',
    proof: [{ label: 'This website', projectId: 'storefront' }],
  },
  {
    id: 'system',
    icon: 'system',
    title: 'Business system',
    pitch: 'Your sales, stock and money in one place instead of notes, spreadsheets and chat history.',
    includes: [
      'Stock, sales and profit that add up on their own',
      'Logins for helpers, each seeing only what they should',
      'Monthly reports you can export',
      'Works on your phone, even offline',
    ],
    timeline: '4–8 weeks',
    proof: [
      { label: 'My back office', projectId: 'back-office' },
      { label: 'A company platform', projectId: 'company-platform' },
    ],
  },
  {
    id: 'fix',
    icon: 'fix',
    title: 'Fixes and upgrades',
    pitch: "A site you already have that's broken, slow, or missing something you need.",
    includes: [
      'Bugs found and fixed',
      'Faster pages and safer logins',
      'A new feature added properly',
      'Backups, so nothing gets lost',
    ],
    timeline: 'Often a few days',
    proof: [],
  },
]
