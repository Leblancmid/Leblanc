import { Compass } from 'lucide-react'
import { LinkButton } from '@/components/ui/LinkButton'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-32 text-center">
      <Compass className="size-10 text-gold-400" />
      <h1 className="mt-6 font-display text-4xl text-ink-100">Nothing here</h1>
      <p className="mt-3 text-ink-400">
        This page doesn't exist. Let's get you back to the main site.
      </p>
      <LinkButton to="/" className="mt-8">
        Return home
      </LinkButton>
    </div>
  )
}
