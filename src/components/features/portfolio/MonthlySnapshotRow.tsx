'use client'

import { formatCurrencyWithSymbol } from '@/lib/utils/formatCurrency'
import { cn } from '@/lib/utils'

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
]

interface MonthlySnapshotRowProps {
  year: number
  month: number
  amount: number
  isCurrentMonth?: boolean
}

// Read-only monthly cash-flow row. The freeze/override feature was superseded by
// the account ledger (the Girokonto carries the cash flow now).
export function MonthlySnapshotRow({ year, month, amount, isCurrentMonth }: MonthlySnapshotRowProps) {
  const isPositive = amount >= 0

  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-4">
      <div className="flex h-10 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-surface-container">
        <span className="text-[10px] font-bold uppercase text-muted-foreground">
          {MONTH_NAMES[month - 1]}
        </span>
        <span className="-mt-0.5 text-[10px] font-medium text-on-surface-variant">
          {String(year).slice(2)}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {isCurrentMonth ? 'Cashflow · laufend' : 'Cashflow'}
        </p>
        <p
          className={cn(
            'mt-0.5 font-display text-base font-semibold tabular-nums',
            isPositive ? 'text-foreground' : 'text-destructive'
          )}
        >
          {isPositive ? '+' : ''}{formatCurrencyWithSymbol(amount)}
        </p>
      </div>
    </div>
  )
}
