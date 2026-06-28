'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/animated-section'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { RecurringList } from './RecurringList'
import { AddRecurringForm } from './AddRecurringForm'
import { TransactionTabs } from './TransactionTabs'
import type { Category, Goal, PortfolioAccount, RecurringTransactionWithCategory } from '@/lib/types/database'

interface RecurringViewProps {
  items: RecurringTransactionWithCategory[]
  categories: Category[]
  goals: Goal[]
  accounts: PortfolioAccount[]
}

export function RecurringView({ items, categories, goals, accounts }: RecurringViewProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <>
      <div className="mx-auto w-full max-w-2xl px-6 pb-24 lg:max-w-[1400px] lg:px-10 lg:pb-10 lg:grid lg:grid-cols-[1fr_440px] lg:items-start lg:gap-10">
        {/* Left column: tabs + list */}
        <div className="lg:min-w-0">
          {/* Sticky controls: Tabs only (recurring view has no search/filters) */}
          <div className="sticky top-20 z-30 -mx-6 -mt-4 bg-background/70 px-6 pb-4 pt-7 backdrop-blur-xl lg:static lg:mx-0 lg:mt-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
            <AnimatedSection delay={0}>
              <TransactionTabs active="recurring" />
            </AnimatedSection>
          </div>

          <div className="pt-6">
            <AnimatedSection delay={0.05}>
              <RecurringList items={items} />
            </AnimatedSection>
          </div>
        </div>

        {/* Right column: inline add form (lg only) */}
        <aside className="hidden lg:sticky lg:top-10 lg:block lg:self-start">
          <div className="rounded-2xl bg-card p-6 lg:p-8">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Neue wiederkehrende
            </p>
            <AddRecurringForm categories={categories} goals={goals} accounts={accounts} />
          </div>
        </aside>
      </div>

      {/* FAB (mobile only) */}
      <button
        onClick={() => setSheetOpen(true)}
        aria-label="Wiederkehrende Transaktion hinzufügen"
        className="fixed bottom-28 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-primary-foreground shadow-lg transition-all active:scale-90 lg:hidden"
      >
        <Plus size={24} />
      </button>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <h3 className="mb-4 text-center font-heading text-lg font-bold">
          Neue wiederkehrende Transaktion
        </h3>
        <AddRecurringForm
          categories={categories}
          goals={goals}
          accounts={accounts}
          onDone={() => setSheetOpen(false)}
        />
      </BottomSheet>
    </>
  )
}
