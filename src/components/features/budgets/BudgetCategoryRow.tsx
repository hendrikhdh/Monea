'use client'

import { useState, useActionState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ICON_MAP } from '@/components/features/categories/iconMap'
import { saveBudget, removeBudget } from '@/app/(app)/budgets/actions'
import type { Category, BudgetWithCategory } from '@/lib/types/database'

interface BudgetCategoryRowProps {
  category: Category
  budget: BudgetWithCategory | null
  spent: number
  year: number
  month: number
}

export function BudgetCategoryRow({
  category,
  budget,
  spent,
  year,
  month,
}: BudgetCategoryRowProps) {
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState(
    budget ? String(budget.amount) : ''
  )

  const Icon = ICON_MAP[category.icon]
  const budgetAmount = budget ? Number(budget.amount) : 0
  const percentage = budgetAmount > 0 ? Math.min(100, Math.round((spent / budgetAmount) * 100)) : 0
  const isOver = spent > budgetAmount && budgetAmount > 0

  const format = (v: number) =>
    new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(v)

  const [, saveAction, savePending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await saveBudget(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Budget gespeichert')
        setEditing(false)
      }
      return result
    },
    null
  )

  const [, deleteAction] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await removeBudget(formData)
      if (result.error) toast.error(result.error)
      else toast.success('Budget entfernt')
      return result
    },
    null
  )

  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-4">
      {/* Category icon */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: category.color + '20' }}
      >
        {Icon && <Icon size={18} style={{ color: category.color }} />}
      </div>

      {/* Name + progress */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium">{category.name}</p>
        {budgetAmount > 0 && !editing ? (
          <>
            <p className="text-xs text-muted-foreground">
              {format(spent)} € / {format(budgetAmount)} €
            </p>
            <div className="mt-1.5 flex gap-0.5">
              <div
                className={`h-1 rounded-full ${isOver ? 'bg-destructive' : 'bg-primary'}`}
                style={{ width: `${percentage}%`, minWidth: 4 }}
              />
              <div
                className="h-1 rounded-full bg-primary/15"
                style={{ width: `${100 - percentage}%`, minWidth: 4 }}
              />
            </div>
          </>
        ) : !editing ? (
          <p className="text-xs text-muted-foreground">Kein Budget gesetzt</p>
        ) : null}
      </div>

      {/* Edit / Save */}
      {editing ? (
        <form action={saveAction} className="flex items-center gap-2">
          <input type="hidden" name="category_id" value={category.id} />
          <input type="hidden" name="year" value={year} />
          <input type="hidden" name="month" value={month} />
          <input
            type="number"
            name="amount"
            min="1"
            step="1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="0"
            className="h-9 w-20 rounded-lg border border-input bg-transparent px-2 text-right text-sm font-semibold focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
          <span className="text-xs text-muted-foreground">€</span>
          <button
            type="submit"
            disabled={savePending}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-primary-foreground active:scale-90"
          >
            <Check size={14} />
          </button>
        </form>
      ) : (
        <div className="flex items-center gap-1">
          {budget && (
            <form action={deleteAction}>
              <input type="hidden" name="id" value={budget.id} />
              <button
                type="submit"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-destructive active:scale-90"
              >
                <Trash2 size={14} />
              </button>
            </form>
          )}
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground active:scale-95"
          >
            {budget ? 'Ändern' : 'Setzen'}
          </button>
        </div>
      )}
    </div>
  )
}
