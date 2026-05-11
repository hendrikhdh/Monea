'use client'

import { cn } from '@/lib/utils'

export type CategoryFilterType = 'all' | 'income' | 'expense'

interface CategoryFiltersProps {
  active: CategoryFilterType
  onChange: (filter: CategoryFilterType) => void
}

const filters: { value: CategoryFilterType; label: string }[] = [
  { value: 'all', label: 'Alle' },
  { value: 'income', label: 'Einnahmen' },
  { value: 'expense', label: 'Ausgaben' },
]

export function CategoryFilters({ active, onChange }: CategoryFiltersProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            'whitespace-nowrap rounded-full px-7 py-3 text-sm font-semibold transition-all active:scale-95',
            active === value
              ? 'bg-primary-container text-primary-foreground'
              : 'bg-surface-container-high text-foreground hover:bg-secondary'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
