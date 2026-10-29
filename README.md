# Leblanc

A dark, noir-luxury site for Leblanc — a trusted Rucoy middleman. It lists accounts
for sale, converts gold to real currency, and gives buyers a way to verify Leblanc's
identity before they trade.

Built with React, TypeScript, Vite, and Tailwind CSS v4.

## Sections

- **Home** — hero with the record trade, headline stats, an anti-impersonation
  notice, services, featured listings, the gold calculator, and Discord communities.
- **For Sale** — every account with its skill bars. Filter by build, sort by level,
  and open a detail dialog. Filter, sort, and the open listing live in the URL
  (`/for-sale?build=distance&listing=lb-684`), so links can be shared.
- **Gold Calculator** — gold to USD / EUR / BRL / PHP. Accepts shorthand (`500m`,
  `1.5b`, `250k`), and rates can be adjusted.
- **Information** — identity verification, the highest trade, YouTube, and Discord.

## Updating content

- `src/data/listings.ts` — accounts for sale. Copy `stats` and `hp` from the in-game
  Stats screen (base values, without `+` bonuses). `price` is optional free text.
- `src/data/site.ts` — the headline numbers (highest trade, subscribers, Discord
  members) and the Discord communities. Every page reads these, so change them here.
- `src/lib/links.ts` — Discord, WhatsApp, and YouTube links.

## Structure

```
src/
  components/   layout (Navbar, Footer, Logo), ui (Button, Badge, Card, ...),
                modals, pagination
  features/
    home/           Landing page
    for-sale/       Listing grid, card, skill bars, detail dialog
    gold-calculator/
    information/    Verification page, TrustNotice, CommunityCard, YouTube cards
    not-found/
  data/         listings + site-wide numbers
  hooks/        usePagination, useEscapeKey, useClickOutside, useLockBodyScroll, ...
  lib/          cn(), formatting, gold parsing, listing filter/sort helpers, links, nav
  types/
```

## Getting started

```bash
npm install
npm run dev
```

```bash
npm run build   # type-check + production build
npm run lint
npm run preview # preview the production build
```
