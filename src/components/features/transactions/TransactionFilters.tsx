'use client'

import { cn } from '@/lib/utils'

type FilterType = 'all' | 'income' | 'expense' | 'savings_deposit' | 'transfer'

interface TransactionFiltersProps {
  active: FilterType
  onChange: (filter: FilterType) => void
}

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Alle' },
  { value: 'income', label: 'Einnahmen' },
  { value: 'expense', label: 'Ausgaben' },
  { value: 'savings_deposit', label: 'Sparen' },
  { value: 'transfer', label: 'Transfers' },
]

export function TransactionFilters({ active, onChange }: TransactionFiltersProps) {
  return (
    <div
      className="flex w-full gap-1.5 overflow-x-auto no-scrollbar lg:flex-wrap lg:overflow-visible"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            'shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition-all active:scale-95',
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
