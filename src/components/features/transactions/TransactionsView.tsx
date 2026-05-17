'use client'

import { useState, useMemo } from 'react'
import { Plus, Receipt, SearchX } from 'lucide-react'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { AnimatedSection } from '@/components/ui/animated-section'
import { EmptyState } from '@/components/ui/empty-state'
import { TransactionTabs } from './TransactionTabs'
import { TransactionSearch } from './TransactionSearch'
import { TransactionFilters } from './TransactionFilters'
import { TransactionGroup } from './TransactionGroup'
import { AddTransactionForm } from './AddTransactionForm'
import type { TransactionWithCategory, Category, Goal } from '@/lib/types/database'

type TxFilter = 'all' | 'income' | 'expense' | 'savings_deposit'

interface TransactionsViewProps {
  transactions: TransactionWithCategory[]
  categories: Category[]
  goals: Goal[]
  initialFilter?: TxFilter
}

function groupByDate(transactions: TransactionWithCategory[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const groups: { label: string; dateLabel: string; transactions: TransactionWithCategory[] }[] = []
  const map = new Map<string, TransactionWithCategory[]>()

  for (const tx of transactions) {
    const dateKey = tx.date
    if (!map.has(dateKey)) map.set(dateKey, [])
    map.get(dateKey)!.push(tx)
  }

  const dateFormat = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'short' })
  const fullFormat = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'short', year: 'numeric' })

  for (const [dateKey, txs] of map) {
    const d = new Date(dateKey + 'T00:00:00')
    let label: string
    if (d.getTime() === today.getTime()) {
      label = 'Heute'
    } else if (d.getTime() === yesterday.getTime()) {
      label = 'Gestern'
    } else {
      label = fullFormat.format(d)
    }
    groups.push({
      label,
      dateLabel: dateFormat.format(d),
      transactions: txs,
    })
  }

  return groups
}

export function TransactionsView({ transactions, categories, goals, initialFilter = 'all' }: TransactionsViewProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editTransaction, setEditTransaction] = useState<TransactionWithCategory | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<TxFilter>(initialFilter)

  const filtered = useMemo(() => {
    let result = transactions
    if (filter !== 'all') {
      result = result.filter((tx) => tx.type === filter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (tx) =>
          tx.note?.toLowerCase().includes(q) ||
          tx.category?.name.toLowerCase().includes(q) ||
          tx.goal?.name.toLowerCase().includes(q)
      )
    }
    return result
  }, [transactions, filter, search])

  const groups = useMemo(() => groupByDate(filtered), [filtered])

  const handleEdit = (tx: TransactionWithCategory) => {
    setEditTransaction(tx)
    setSheetOpen(true)
  }

  const handleClose = () => {
    setSheetOpen(false)
    setEditTransaction(null)
  }

  const handleNew = () => {
    setEditTransaction(null)
    setSheetOpen(true)
  }

  return (
    <>
      <div className="mx-auto w-full max-w-2xl px-6 pb-24 lg:max-w-[1400px] lg:px-10 lg:pb-10 lg:grid lg:grid-cols-[1fr_440px] lg:items-start lg:gap-10">
        {/* Left column: controls + list */}
        <div className="lg:min-w-0">
          {/* Sticky controls: Tabs + Search + Filters */}
          <div className="sticky top-20 z-30 -mx-6 -mt-4 space-y-3 bg-background/70 px-6 pb-4 pt-7 backdrop-blur-xl lg:static lg:mx-0 lg:mt-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
            <AnimatedSection delay={0}>
              <TransactionTabs active="single" />
            </AnimatedSection>

            <AnimatedSection delay={0.03}>
              <TransactionSearch value={search} onChange={setSearch} />
            </AnimatedSection>

            <AnimatedSection delay={0.05}>
              <TransactionFilters active={filter} onChange={setFilter} />
            </AnimatedSection>
          </div>

          {/* List */}
          <div className="space-y-4 pt-6">
            {groups.length === 0 ? (
              transactions.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title="Noch keine Transaktionen"
                  description="Erfasse deine erste Einnahme oder Ausgabe — alles, was du eintippst, fließt automatisch ins Dashboard."
                  cta={{ label: 'Transaktion hinzufügen', onClick: handleNew }}
                  variant="feature"
                />
              ) : (
                <EmptyState
                  icon={SearchX}
                  title="Keine Treffer"
                  description="Für deinen Filter oder die Suche gibt es keine Transaktionen."
                />
              )
            ) : (
              groups.map((group) => (
                <AnimatedSection key={group.label} delay={0.1}>
                  <TransactionGroup
                    label={group.label}
                    dateLabel={group.dateLabel}
                    transactions={group.transactions}
                    onEdit={handleEdit}
                  />
                </AnimatedSection>
              ))
            )}
          </div>
        </div>

        {/* Right column: inline add form (lg only) */}
        <aside className="hidden lg:sticky lg:top-10 lg:block lg:self-start">
          <div className="rounded-2xl bg-card p-6 lg:p-8">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Neue Transaktion
            </p>
            <AddTransactionForm categories={categories} goals={goals} />
          </div>
        </aside>
      </div>

      {/* FAB (mobile only) */}
      <button
        onClick={handleNew}
        className="fixed bottom-28 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-primary-foreground shadow-lg transition-all active:scale-90 lg:hidden"
      >
        <Plus size={24} />
      </button>

      <BottomSheet open={sheetOpen} onClose={handleClose}>
        <AddTransactionForm
          categories={categories}
          goals={goals}
          transaction={editTransaction}
          onDone={handleClose}
        />
      </BottomSheet>
    </>
  )
}
