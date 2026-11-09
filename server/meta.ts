/**
 * Link previews (Discord, WhatsApp, Facebook…): the page's own title, description and image,
 * put into the HTML before it's sent. Chat apps don't run the React app, so without this
 * every link shows the same plain "Leblanc" card.
 */
import listings from '../src/data/listings.json'
import gold from '../src/data/gold.json'
import siteStats from '../src/data/site-stats.json'
import { formatRate, type GoldConfig } from '../src/lib/orders'

interface PublishedListing {
  id: string
  category: string
  level: number
  stats?: { melee: number; distance: number; magic: number; defense: number }
  image?: string
  price?: string
  featured?: boolean
}

export interface PageMeta {
  title: string
  description: string
  /** Path or absolute URL of the preview image */
  image: string
  /** Show a big image (a listing screenshot) rather than a small thumbnail */
  large: boolean
}

const all = listings as PublishedListing[]
const goldConfig = gold as GoldConfig
const LOGO = '/leblancmid.png'

const goldLine = () => {
  const r = goldConfig.rates[0]
  return r ? `Selling gold at ${formatRate(r)}/KK (${r.method}).` : ''
}
const soldLine = () =>
  siteStats.accounts_sold > 0 ? `${siteStats.accounts_sold} accounts sold.` : ''

export function metaFor(url: URL): PageMeta {
  const path = url.pathname.replace(/\/+$/, '') || '/'

  if (path === '/for-sale') {
    const listing = all.find((l) => l.id === url.searchParams.get('listing'))
    if (listing) {
      const s = listing.stats
      return {
        title: `Lv ${listing.level} ${listing.category}${listing.price ? ` · ${listing.price}` : ''} | Leblanc`,
        description: (s ? `Melee ${s.melee} · Distance ${s.distance} · Magic ${s.magic} · Defense ${s.defense}. ` : '')
          + `${listing.category} account for sale. Tap to see the full stats and message Leblanc.`,
        image: listing.image ?? LOGO,
        large: !!listing.image,
      }
    }
    const build = url.searchParams.get('build')
    const shown = build ? all.filter((l) => l.category.toLowerCase() === build.toLowerCase()) : all
    const top = [...shown].sort((a, b) => b.level - a.level)[0]
    const levels = shown.length ? `Lv ${Math.min(...shown.map((l) => l.level))}–${Math.max(...shown.map((l) => l.level))}` : ''
    return {
      title: `${shown.length} ${build ? `${build[0].toUpperCase()}${build.slice(1).toLowerCase()} ` : ''}Rucoy account${shown.length === 1 ? '' : 's'} for sale | Leblanc`,
      description: [levels && `${levels}, every one with its full stats screen.`, soldLine(), 'Trusted middleman.'].filter(Boolean).join(' '),
      image: top?.image ?? LOGO,
      large: !!top?.image,
    }
  }

  if (path === '/gold-calculator') {
    return {
      title: 'Rucoy gold rates | Leblanc',
      description: goldConfig.rates.length
        ? goldConfig.rates.map((r) => `${r.method} ${formatRate(r)}/KK`).join(' · ') + '. Order in a minute on the website.'
        : 'Convert Rucoy gold at Leblanc\'s trade rates.',
      image: LOGO,
      large: false,
    }
  }

  return {
    title: 'Leblanc | Rucoy accounts, gold & middleman',
    description: [`${all.length} accounts for sale.`, goldLine(), soldLine(), 'Trusted middleman with a €9,000 trade on record.']
      .filter(Boolean).join(' '),
    image: LOGO,
    large: false,
  }
}

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Put the preview tags into the page's <head> (replacing the default title). */
export function injectMeta(html: string, meta: PageMeta, url: URL): string {
  const image = meta.image.startsWith('http') ? meta.image : `${url.origin}${meta.image}`
  const tags = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Leblanc" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta property="og:image" content="${escape(image)}" />`,
    `<meta property="og:url" content="${escape(url.href)}" />`,
    `<meta name="twitter:card" content="${meta.large ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${escape(meta.title)}" />`,
    `<meta name="twitter:description" content="${escape(meta.description)}" />`,
    `<meta name="twitter:image" content="${escape(image)}" />`,
  ].join('\n    ')

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(/<meta\s+name="description"[^>]*>/s, `<meta name="description" content="${escape(meta.description)}" />`)
    .replace('</head>', `    ${tags}\n  </head>`)
}

/** Shared handler: the normal page, with this URL's preview tags. */
export async function withMeta({ request, next }: { request: Request; next: () => Promise<Response> }): Promise<Response> {
  const res = await next()
  if (!(res.headers.get('content-type') ?? '').includes('text/html')) return res
  const url = new URL(request.url)
  const html = injectMeta(await res.text(), metaFor(url), url)
  const headers = new Headers(res.headers)
  headers.delete('content-length')
  return new Response(html, { status: res.status, headers })
}
