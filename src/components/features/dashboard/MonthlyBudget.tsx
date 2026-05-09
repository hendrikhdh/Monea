'use client'

import { useState, useEffect } from 'react'
import { Pencil, Check } from 'lucide-react'

const BUDGET_STORAGE_KEY = 'monea-monthly-budget'

interface MonthlyBudgetProps {
  spent: number
}

export function MonthlyBudget({ spent }: MonthlyBudgetProps) {
  const [budget, setBudget] = useState(2800)
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem(BUDGET_STORAGE_KEY)
    if (stored) {
      const parsed = Number(stored)
      if (parsed > 0) setBudget(parsed)
    }
  }, [])

  const remaining = Math.max(0, budget - spent)
  const percentage = budget > 0 ? Math.round((remaining / budget) * 100) : 0
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (percentage / 100) * circumference

  const format = (v: number) =>
    new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(v)

  const startEditing = () => {
    setInputValue(String(budget))
    setEditing(true)
  }

  const saveBudget = () => {
    const parsed = Number(inputValue)
    if (parsed > 0) {
      setBudget(parsed)
      localStorage.setItem(BUDGET_STORAGE_KEY, String(parsed))
    }
    setEditing(false)
  }

  return (
    <section className="relative flex items-center justify-between overflow-hidden rounded-xl bg-surface-container p-8">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-xl font-bold">Monatsbudget</h3>
          {!editing && (
            <button
              onClick={startEditing}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-surface-container-high active:scale-90"
            >
              <Pencil size={14} />
            </button>
          )}
        </div>

        {editing ? (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveBudget()}
              className="h-10 w-28 rounded-xl border border-input bg-transparent px-3 text-base font-semibold focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
            <span className="text-sm text-muted-foreground">€</span>
            <button
              onClick={saveBudget}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-primary-foreground transition-all active:scale-90"
            >
              <Check size={16} />
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-on-surface-variant">
              {format(remaining)} € von {format(budget)} € übrig
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {format(spent)} € ausgegeben
            </p>
          </>
        )}

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
            cx={48}
            cy={48}
            r={40}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={10}
            className="text-secondary"
          />
          <circle
            cx={48}
            cy={48}
            r={40}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={10}
            strokeLinecap="round"
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
