'use client'

import { cn } from '@/lib/utils'

type FilterType = 'all' | 'income' | 'expense'

interface TransactionFiltersProps {
  active: FilterType
  onChange: (filter: FilterType) => void
}

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Alle' },
  { value: 'income', label: 'Einnahmen' },
  { value: 'expense', label: 'Ausgaben' },
]

export function TransactionFilters({ active, onChange }: TransactionFiltersProps) {
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
