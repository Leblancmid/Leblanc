# Leblanc

A dark, noir-luxury marketplace front end — a private "house" for rare listings,
member information, and network status.

Built with React, TypeScript, Vite, and Tailwind CSS v4.

## Sections

- **For Sale** — vehicles, properties, collectibles, and service retainers, with
  category filtering, pagination, a listing detail modal, and an inquiry
  confirmation flow.
- **Information** — how the house works, membership guidelines, and an FAQ
  accordion.
- **Server** — live network status, connection details, service health, and a
  connect confirmation flow.

## Stack

- React 19 + TypeScript
- Vite, with `@` aliased to `src/`
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router
- [lucide-react](https://lucide.dev/) for icons

## Structure

```
src/
  components/
    layout/       Navbar, Footer, Layout, Logo, ScrollToTop
    ui/           Button, LinkButton, Badge, Card, SectionHeading
    modals/       Base portal-based Modal
    confirmation/ ConfirmDialog (async confirm + success state)
    pagination/   Pagination
  features/
    home/         Landing page
    for-sale/      Listing grid, detail modal, category filter
    information/  Guidelines, steps, FAQ accordion
    server/       Status card, service health rows
    not-found/    404 page
  hooks/          usePagination, useDisclosure, useLockBodyScroll,
                  useEscapeKey, useClickOutside, useCopyToClipboard, useCountUp
  data/           Mock listings, server status, guidelines/FAQ content
  types/          Shared TypeScript types
  lib/            cn() class-merging helper
```

## Getting started

```bash
npm install
npm run dev
```

```bash
npm run build   # type-check + production build
npm run preview # preview the production build
```
