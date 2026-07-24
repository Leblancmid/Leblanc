import { cn } from '@/lib/cn'
import type { ListingCategory } from '@/types'

const categories: Array<ListingCategory | 'All'> = ['All', 'Vehicle', 'Property', 'Collectible', 'Service']

interface CategoryFilterProps {
  active: ListingCategory | 'All'
  onChange: (category: ListingCategory | 'All') => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="scroll-thin flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={cn(
            'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
            active === category
              ? 'border-gold-500/60 bg-gold-500/10 text-gold-300'
              : 'border-ink-600 text-ink-300 hover:border-ink-500 hover:text-ink-100',
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
