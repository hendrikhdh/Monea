'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, ChevronLeft, PiggyBank } from 'lucide-react'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { BudgetCard } from './BudgetCard'
import { AddBudgetForm } from './AddBudgetForm'
import { EmptyState } from '@/components/ui/empty-state'
import { formatCurrencyWithSymbol } from '@/lib/utils/formatCurrency'
import type { BudgetWithCategory, Category } from '@/lib/types/database'

interface BudgetsViewProps {
  budgets: BudgetWithCategory[]
  categories: Category[]
  spentByCategory: Record<string, number>
}

export function BudgetsView({ budgets, categories, spentByCategory }: BudgetsViewProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editBudget, setEditBudget] = useState<BudgetWithCategory | null>(null)

  const totalLimit = budgets.reduce((sum, b) => sum + Number(b.amount), 0)
  const totalSpent = budgets.reduce(
    (sum, b) => sum + (spentByCategory[b.category_id] ?? 0),
    0
  )
  const existingCategoryIds = new Set(budgets.map((b) => b.category_id))

  const handleNew = () => {
    setEditBudget(null)
    setSheetOpen(true)
  }

  const handleEdit = (budget: BudgetWithCategory) => {
    setEditBudget(budget)
    setSheetOpen(true)
  }

  const handleClose = () => {
    setSheetOpen(false)
    setEditBudget(null)
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 pb-24">
      {/* Sticky header: Back + Title + Total summary */}
      <div className="sticky top-20 z-30 -mx-6 -mt-4 space-y-3 bg-background/70 px-6 pb-4 pt-7 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container transition-all active:scale-90"
            aria-label="Zurück"
          >
            <ChevronLeft size={20} className="text-foreground" />
          </Link>
          <h1 className="font-heading text-2xl font-bold text-foreground">Budgets</h1>
        </div>

        {budgets.length > 0 && (
          <section className="rounded-2xl bg-surface-container px-6 py-5">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              Gesamt diesen Monat
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-foreground tabular-nums">
              {formatCurrencyWithSymbol(totalSpent)}
              <span className="ml-2 text-base font-normal text-muted-foreground">
                / {formatCurrencyWithSymbol(totalLimit)}
              </span>
            </p>
          </section>
        )}
      </div>

      {/* Budget list */}
      <div className="pt-6">
        {budgets.length === 0 ? (
          <EmptyState
            icon={PiggyBank}
            title="Noch keine Budgets festgelegt"
            description="Lege Monatsgrenzen pro Kategorie fest, um deine Ausgaben im Blick zu behalten."
            cta={{ label: 'Budget anlegen', onClick: handleNew }}
            variant="feature"
          />
        ) : (
          <div className="space-y-4">
            {budgets.map((budget, i) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                spent={spentByCategory[budget.category_id] ?? 0}
                blobIndex={i % 3}
                onClick={() => handleEdit(budget)}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={handleNew}
        aria-label="Budget hinzufügen"
        className="fixed bottom-28 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-primary-foreground shadow-lg transition-all active:scale-90"
      >
        <Plus size={24} />
      </button>

      <BottomSheet open={sheetOpen} onClose={handleClose}>
        <AddBudgetForm
          budget={editBudget}
          categories={categories}
          existingCategoryIds={existingCategoryIds}
          spent={editBudget ? spentByCategory[editBudget.category_id] ?? 0 : undefined}
          onDone={handleClose}
        />
      </BottomSheet>
    </div>
  )
}
