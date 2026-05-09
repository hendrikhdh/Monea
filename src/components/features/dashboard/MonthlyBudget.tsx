'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface MonthlyBudgetProps {
  spent: number
  budget: number
}

export function MonthlyBudget({ spent, budget }: MonthlyBudgetProps) {
  const remaining = Math.max(0, budget - spent)
  const percentage = budget > 0 ? Math.round((remaining / budget) * 100) : 0
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (percentage / 100) * circumference

  const format = (v: number) =>
    new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(v)

  if (budget <= 0) {
    return (
      <Link
        href="/budgets"
        className="flex items-center justify-between rounded-xl bg-surface-container p-8 transition-colors active:scale-[0.98]"
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

  return (
    <section className="relative flex items-center justify-between overflow-hidden rounded-xl bg-surface-container p-8">
      <div className="flex-1">
        <Link href="/budgets" className="group flex items-center gap-2">
          <h3 className="font-heading text-xl font-bold">Monatsbudget</h3>
          <ArrowRight
            size={16}
            className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          />
        </Link>

        <p className="text-sm font-medium text-on-surface-variant">
          {format(remaining)} € von {format(budget)} € übrig
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {format(spent)} € ausgegeben
        </p>

        <div className="mt-4 flex gap-1">
          <div
            className="h-1.5 rounded-full bg-primary"
            style={{ width: `${100 - percentage}%`, minWidth: 16 }}
          />
          <div
            className="h-1.5 rounded-full bg-primary/20"
            style={{ width: `${percentage}%`, minWidth: 8 }}
          />
        </div>
      </div>

      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
        <svg className="-rotate-90" width={96} height={96}>
          <circle
            cx={48} cy={48} r={40}
            fill="transparent" stroke="currentColor"
            strokeWidth={10} className="text-secondary"
          />
          <circle
            cx={48} cy={48} r={40}
            fill="transparent" stroke="currentColor"
            strokeWidth={10} strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-primary"
          />
        </svg>
        <span className="absolute font-display text-lg">{percentage}%</span>
      </div>
    </section>
  )
}
