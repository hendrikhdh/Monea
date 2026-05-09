'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/animated-section'
import { BudgetCategoryRow } from './BudgetCategoryRow'
import type { Category, BudgetWithCategory } from '@/lib/types/database'

const MONTH_NAMES = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]

interface BudgetsShellProps {
  initialYear: number
  initialMonth: number
  budgets: BudgetWithCategory[]
  categories: Category[]
  spent: number
}

export function BudgetsShell({
  initialYear,
  initialMonth,
  budgets,
  categories,
  spent,
}: BudgetsShellProps) {
  const [year] = useState(initialYear)
  const [month] = useState(initialMonth)

  const expenseCategories = categories.filter(
    (c) => c.type === 'expense' || c.type === 'both'
  )

  const budgetMap = new Map(budgets.map((b) => [b.category_id, b]))
  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0)
  const totalPercentage = totalBudget > 0
    ? Math.min(100, Math.round((spent / totalBudget) * 100))
    : 0

  const format = (v: number) =>
    new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(v)

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-6">
      {/* Header with month */}
      <AnimatedSection delay={0}>
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold">Budgets</h2>
          <div className="flex items-center gap-3">
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground active:scale-90">
              <ChevronLeft size={18} />
            </button>
            <span className="min-w-[120px] text-center text-sm font-semibold">
              {MONTH_NAMES[month - 1]} {year}
            </span>
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground active:scale-90">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </AnimatedSection>

      {/* Total overview */}
      <AnimatedSection delay={0.05}>
        <div className="rounded-xl bg-surface-container p-6">
          <p className="text-sm text-on-surface-variant">Gesamtbudget</p>
          <p className="font-heading text-2xl font-bold">
            {format(spent)} € <span className="text-base font-normal text-muted-foreground">/ {format(totalBudget)} €</span>
          </p>
          <div className="mt-3 flex gap-0.5">
            <div
              className={`h-2 rounded-full ${spent > totalBudget ? 'bg-destructive' : 'bg-primary'}`}
              style={{ width: `${totalPercentage}%`, minWidth: 4 }}
            />
            <div
              className="h-2 rounded-full bg-primary/15"
              style={{ width: `${100 - totalPercentage}%`, minWidth: 4 }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {totalBudget > 0
              ? `${format(Math.max(0, totalBudget - spent))} € übrig`
              : 'Setze Budgets für deine Kategorien'}
          </p>
        </div>
      </AnimatedSection>

      {/* Category rows */}
      <AnimatedSection delay={0.1}>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-on-surface-variant">
            Kategorien ({expenseCategories.length})
          </h3>
          {expenseCategories.map((category) => (
            <BudgetCategoryRow
              key={category.id}
              category={category}
              budget={budgetMap.get(category.id) ?? null}
              spent={0}
              year={year}
              month={month}
            />
          ))}
        </div>
      </AnimatedSection>
    </div>
  )
}
