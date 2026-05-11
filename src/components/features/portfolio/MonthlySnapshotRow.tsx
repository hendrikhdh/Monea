'use client'

import { ChevronRight } from 'lucide-react'
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
  frozen: boolean
  isCurrentMonth: boolean
  onClick?: () => void
}

export function MonthlySnapshotRow({
  year,
  month,
  amount,
  frozen,
  isCurrentMonth,
  onClick,
}: MonthlySnapshotRowProps) {
  const isPositive = amount >= 0
  const isEditable = !isCurrentMonth

  const content = (
    <>
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
          Monatssaldo
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

      {frozen && (
        <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold uppercase text-on-secondary-container">
          Angepasst
        </span>
      )}

      {isEditable && (
        <ChevronRight size={16} className="text-muted-foreground" />
      )}
    </>
  )

  if (!isEditable) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-4">
        {content}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl bg-surface-container-low p-4 text-left transition-all active:scale-[0.98]"
    >
      {content}
    </button>
  )
}
