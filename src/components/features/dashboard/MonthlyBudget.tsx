import Link from 'next/link'
import { ArrowRight, Sparkles, AlertTriangle } from 'lucide-react'
import { ICON_MAP } from '@/components/features/categories/iconMap'
import { formatCurrencyWithSymbol } from '@/lib/utils/formatCurrency'
import type { BudgetAtRisk } from '@/lib/supabase/budgets'
import { cn } from '@/lib/utils'

interface MonthlyBudgetProps {
  atRisk: BudgetAtRisk[]
  hasAnyBudget: boolean
}

export function MonthlyBudget({ atRisk, hasAnyBudget }: MonthlyBudgetProps) {
  if (!hasAnyBudget) {
    return (
      <Link
        href="/budgets"
        className="flex items-center justify-between rounded-[2.5rem_1.25rem_3rem_1.75rem] bg-surface-container p-6 transition-colors hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
      >
        <div>
          <h3 className="font-heading text-xl font-bold">Monatsbudget</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Budgets für deine Kategorien einrichten
          </p>
        </div>
        <ArrowRight size={20} className="text-muted-foreground" />
      </Link>
    )
  }

  if (atRisk.length === 0) {
    return (
      <Link
        href="/budgets"
        className="flex items-center gap-4 rounded-[2.5rem_1.25rem_3rem_1.75rem] bg-secondary-container/70 p-6 transition-all hover:bg-secondary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-container">
          <Sparkles size={20} className="text-on-secondary-container" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-base font-bold text-secondary-foreground">
            Alles im Plan
          </h3>
          <p className="mt-0.5 text-sm text-on-secondary-container">
            Keine Budgetgrenze in Sicht
          </p>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href="/budgets"
      className="block space-y-3 rounded-2xl transition-colors hover:bg-surface-container-low/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-destructive" />
          <h3 className="font-heading text-base font-bold text-foreground">
            Budgets nahe der Grenze
          </h3>
        </div>
        <ArrowRight size={16} className="text-muted-foreground" />
      </div>

      <div className="space-y-2">
        {atRisk.map(({ budget, spent, percentage }) => {
          const Icon = ICON_MAP[budget.category.icon]
          const limit = Number(budget.amount)
          const isOver = percentage >= 100
          const barWidth = Math.min(100, percentage)

          return (
            <div
              key={budget.id}
              className="rounded-xl bg-surface-container-low p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${budget.category.color}20` }}
                >
                  {Icon && <Icon size={18} style={{ color: budget.category.color }} />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {budget.category.name}
                  </p>
                  <p className="text-xs text-on-surface-variant tabular-nums">
                    {formatCurrencyWithSymbol(spent)} von {formatCurrencyWithSymbol(limit)}
                  </p>
                </div>

                <span
                  className={cn(
                    'font-display text-sm font-semibold tabular-nums',
                    isOver ? 'text-destructive' : 'text-foreground'
                  )}
                >
                  {percentage}%
                </span>
              </div>

              <div className="mt-3 flex gap-0.5">
                <div
                  className={cn(
                    'h-1.5 rounded-full',
                    isOver ? 'bg-destructive' : 'bg-primary'
                  )}
                  style={{ width: `${barWidth}%`, minWidth: 4 }}
                />
                <div
                  className="h-1.5 rounded-full bg-primary/15"
                  style={{ width: `${100 - barWidth}%`, minWidth: 4 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Link>
  )
}
