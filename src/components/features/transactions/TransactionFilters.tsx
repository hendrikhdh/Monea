'use client'

import { cn } from '@/lib/utils'

type FilterType = 'all' | 'income' | 'expense' | 'savings_deposit'

interface TransactionFiltersProps {
  active: FilterType
  onChange: (filter: FilterType) => void
}

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Alle' },
  { value: 'income', label: 'Einnahmen' },
  { value: 'expense', label: 'Ausgaben' },
  { value: 'savings_deposit', label: 'Sparen' },
]

export function TransactionFilters({ active, onChange }: TransactionFiltersProps) {
  return (
    <div className="flex w-full gap-1.5">
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            'flex-1 whitespace-nowrap rounded-full px-2 py-2 text-xs font-semibold transition-all active:scale-95',
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
