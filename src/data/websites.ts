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
  images?: { src: string; caption: string; highlight: string; alt: string }[]
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
      'Made for the phone too: works offline, and alerts me the moment a request comes in',
      'Logins for helpers, each seeing only their part, with undo and a full change history',
      'Monthly charts, reports and a weekly summary',
    ],
    images: [
      { src: '/websites/overview.png', caption: 'Overview', highlight: 'Net worth and profit at a glance, month by month.', alt: 'Overview: net worth by month, where it is held, and profit' },
      { src: '/websites/phone-views.png', caption: 'On the phone', highlight: 'Every screen laid out for one-handed use, big numbers kept short.', alt: 'Four phone screens: gold summary, sales, report and wallets' },
      { src: '/websites/business-stats.png', caption: 'Business stats', highlight: 'Profit, margin and a weekly brief of what needs you.', alt: 'Business stats: sold profit, revenue, cost and margin, with a weekly brief' },
      { src: '/websites/business-sales.png', caption: 'Sales', highlight: 'Every account with its price, cost and profit.', alt: 'Sales: accounts for sale with price, cost and profit' },
      { src: '/websites/business-listing-kit.png', caption: 'Listing Kit', highlight: 'Automatic grid and prices: just add your screenshots.', alt: 'Listing Kit: the sale image built from the accounts for sale' },
      { src: '/websites/business-leads.png', caption: 'Leads', highlight: 'Website requests in one inbox, plus live visitors.', alt: 'Leads: website requests and live visitor stats' },
      { src: '/websites/business-report.png', caption: 'Report', highlight: 'Revenue vs cost by month, ready to export.', alt: 'Business report: revenue against cost by month and profit by type' },
      { src: '/websites/rucoy-summary.png', caption: 'Gold summary', highlight: 'Stash, trades and every gold movement.', alt: 'Gold summary: stash, trades and daily gold flow' },
      { src: '/websites/rucoy-trades.png', caption: 'Trades', highlight: 'Open trades with fees and due dates.', alt: 'Trades: open gold and cash trades with middleman fees' },
      { src: '/websites/wallets.png', caption: 'Wallets', highlight: 'Every wallet in pesos and dollars, checked against the bank.', alt: 'Wallets in two currencies' },
      { src: '/websites/users.png', caption: 'Users & access', highlight: 'Add helpers and choose exactly which parts each one sees.', alt: 'Users: people with their roles, access and when they were last active' },
      { src: '/websites/logs.png', caption: 'Activity log', highlight: 'Who changed what, with the before and after.', alt: 'Activity log: sign-ins and edits with old and new values' },
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
