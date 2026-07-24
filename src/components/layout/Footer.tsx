import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-ink-700/80 bg-ink-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-ink-400">
              A private house for rare listings, quiet arrangements, and the people who know
              where to look.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse items-center justify-between gap-4 border-t border-ink-700/80 pt-6 sm:flex-row">
          <p className="text-xs text-ink-500">&copy; {new Date().getFullYear()} Leblanc House. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
