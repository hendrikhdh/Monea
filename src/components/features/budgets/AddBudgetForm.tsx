'use client'

import { useActionState, useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { saveBudget, removeBudget } from '@/app/(app)/budgets/actions'
import { ICON_MAP } from '@/components/features/categories/iconMap'
import { MAX_BUDGET_AMOUNT } from '@/lib/validations/budget.schema'
import { formatCurrencyWithSymbol } from '@/lib/utils/formatCurrency'
import type { Category, BudgetWithCategory } from '@/lib/types/database'
import { cn } from '@/lib/utils'

interface AddBudgetFormProps {
  budget?: BudgetWithCategory | null
  categories: Category[]
  existingCategoryIds: Set<string>
  spent?: number
  onDone?: () => void
}

export function AddBudgetForm({
  budget,
  categories,
  existingCategoryIds,
  spent,
  onDone,
}: AddBudgetFormProps) {
  const isEdit = !!budget

  const availableCategories = categories.filter(
    (c) =>
      (c.type === 'expense' || c.type === 'both') &&
      !existingCategoryIds.has(c.id)
  )

  const [categoryId, setCategoryId] = useState<string>(
    budget?.category_id ?? availableCategories[0]?.id ?? ''
  )
  const [amount, setAmount] = useState(budget ? String(budget.amount) : '')

  // Re-sync local state when the edited budget changes (sheet reused across opens)
  const [prevBudget, setPrevBudget] = useState(budget)
  if (budget !== prevBudget) {
    setPrevBudget(budget)
    if (budget) {
      setCategoryId(budget.category_id)
      setAmount(String(budget.amount))
    } else {
      setAmount('')
    }
  }

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await saveBudget(formData)
      if (result?.error) toast.error(result.error)
      else { toast.success(isEdit ? 'Budget aktualisiert!' : 'Budget erstellt!'); onDone?.() }
      return result
    },
    null
  )

  const [, deleteAction, deletePending] = useActionState(
    async () => {
      if (!budget) return null
      const formData = new FormData()
      formData.set('id', budget.id)
      const result = await removeBudget(formData)
      if (result?.error) toast.error(result.error)
      else { toast.success('Budget gelöscht.'); onDone?.() }
      return result
    },
    null
  )

  const EditIcon = isEdit ? ICON_MAP[budget.category.icon] : null

  return (
    <form action={action} className="flex flex-col gap-4">
      <h3 className="text-center font-heading text-lg font-bold">
        {isEdit ? 'Budget bearbeiten' : 'Neues Budget'}
      </h3>

      {isEdit ? (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-surface-container-low p-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: `${budget.category.color}20` }}
            >
              {EditIcon && (
                <EditIcon size={18} style={{ color: budget.category.color }} />
              )}
            </div>
            <span className="text-base font-semibold text-foreground">
              {budget.category.name}
            </span>
          </div>
          {spent !== undefined && (
            <div className="flex items-center justify-between rounded-2xl bg-secondary-container/60 px-5 py-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-foreground">
                Diesen Monat
              </span>
              <span className="font-display text-lg font-semibold tabular-nums text-secondary-foreground">
                {formatCurrencyWithSymbol(spent)}
              </span>
            </div>
          )}
        </div>
      ) : availableCategories.length === 0 ? (
        <p className="rounded-xl bg-surface-container-low p-6 text-center text-sm text-muted-foreground">
          Alle Kategorien haben bereits ein Budget. Bearbeite ein bestehendes oder lege zuerst eine neue Kategorie an.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2 rounded-3xl bg-surface-container-low p-3">
          {availableCategories.map((cat) => {
            const Icon = ICON_MAP[cat.icon]
            const isSelected = cat.id === categoryId
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-2xl p-3 transition-all active:scale-95',
                  isSelected ? 'bg-primary-container' : 'bg-transparent'
                )}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: isSelected
                      ? `${cat.color}40`
                      : `${cat.color}20`,
                  }}
                >
                  {Icon && <Icon size={16} style={{ color: cat.color }} />}
                </div>
                <span
                  className={cn(
                    'truncate text-[11px] font-semibold leading-tight',
                    isSelected ? 'text-primary-foreground' : 'text-foreground'
                  )}
                >
                  {cat.name}
                </span>
              </button>
            )
          })}
        </div>
      )}
      <input type="hidden" name="category_id" value={categoryId} />

      {/* Amount input */}
      <div className="relative">
        <input
          name="amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0.01"
          max={MAX_BUDGET_AMOUNT}
          placeholder="0,00"
          className="h-14 w-full rounded-2xl border border-input bg-transparent pl-5 pr-12 text-right text-base font-medium tabular-nums placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
          required
          disabled={pending}
          value={amount}
          onChange={(e) => {
            const next = e.target.value
            if (next === '' || Number(next) <= MAX_BUDGET_AMOUNT) {
              setAmount(next)
            }
          }}
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-3">
        {isEdit && (
          <button
            type="button"
            disabled={deletePending}
            onClick={() => deleteAction()}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-destructive/20 text-destructive transition-all active:scale-95 disabled:opacity-40"
          >
            <Trash2 size={20} />
          </button>
        )}
        <button
          type="submit"
          disabled={pending || !categoryId || !amount.trim()}
          className="flex h-14 flex-1 items-center justify-center gap-3 rounded-full bg-primary-container font-heading text-lg font-bold tracking-wide text-primary-foreground shadow-[0_15px_30px_rgba(62,39,35,0.2)] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
        >
          <span>{pending ? 'Speichern…' : isEdit ? 'Aktualisieren' : 'Speichern'}</span>
          {!pending && <Check size={20} />}
        </button>
      </div>
    </form>
  )
}
