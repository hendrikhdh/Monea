'use client'

import { ICON_MAP } from '@/components/features/categories/iconMap'
import { getShapeForCategory } from '@/components/features/categories/organicShapes'
import { formatCurrencyWithSymbol } from '@/lib/utils/formatCurrency'
import type { BudgetWithCategory } from '@/lib/types/database'
import { cn } from '@/lib/utils'

const BLOB_SHAPES = [
  'rounded-[3rem_1rem_3rem_4rem]',
  'rounded-[2rem_4rem_2rem_3rem]',
  'rounded-[3.5rem_2rem_4rem_1.5rem]',
]

interface BudgetCardProps {
  budget: BudgetWithCategory
  spent: number
  blobIndex: number
  onClick?: () => void
}

export function BudgetCard({ budget, spent, blobIndex, onClick }: BudgetCardProps) {
  const Icon = ICON_MAP[budget.category.icon]
  const limit = Number(budget.amount)
  const percentage = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0
  const isOver = spent > limit
  const remaining = limit - spent
  const remainingAbs = Math.abs(remaining)

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full flex-col gap-4 bg-surface-container-low p-6 text-left transition-all duration-300 active:scale-[0.98] hover:bg-surface-container',
        BLOB_SHAPES[blobIndex]
      )}
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center transition-all duration-300',
            getShapeForCategory(budget.category_id)
          )}
          style={{ backgroundColor: `${budget.category.color}25` }}
        >
          {Icon && <Icon size={20} style={{ color: budget.category.color }} />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="truncate font-heading text-lg font-bold text-foreground">
            {budget.category.name}
          </p>
          <p className="font-display text-xs tabular-nums text-on-surface-variant">
            von {formatCurrencyWithSymbol(limit)}
          </p>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            {isOver ? 'überzogen' : 'noch übrig'}
          </p>
          <p
            className={cn(
              'mt-0.5 font-display text-2xl font-semibold tabular-nums',
              isOver ? 'text-destructive' : 'text-foreground'
            )}
          >
            {formatCurrencyWithSymbol(remainingAbs)}
          </p>
        </div>
      </div>

      <div className="flex gap-0.5">
        <div
          className={cn(
            'h-1.5 rounded-full',
            isOver ? 'bg-destructive' : 'bg-primary'
          )}
          style={{ width: `${percentage}%`, minWidth: 4 }}
        />
        <div
          className="h-1.5 rounded-full bg-primary/15"
          style={{ width: `${100 - percentage}%`, minWidth: 4 }}
        />
      </div>
    </button>
  )
}
