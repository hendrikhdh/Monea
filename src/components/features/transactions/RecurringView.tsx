'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/animated-section'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { RecurringList } from './RecurringList'
import { AddRecurringForm } from './AddRecurringForm'
import { TransactionTabs } from './TransactionTabs'
import type { Category, Goal, RecurringTransactionWithCategory } from '@/lib/types/database'

interface RecurringViewProps {
  items: RecurringTransactionWithCategory[]
  categories: Category[]
  goals: Goal[]
}

export function RecurringView({ items, categories, goals }: RecurringViewProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div className="mx-auto w-full max-w-2xl px-6 pb-24">
      {/* Sticky controls: Tabs only (recurring view has no search/filters) */}
      <div className="sticky top-20 z-30 -mx-6 -mt-4 bg-background/70 px-6 pb-4 pt-7 backdrop-blur-xl">
        <AnimatedSection delay={0}>
          <TransactionTabs active="recurring" />
        </AnimatedSection>
      </div>

      <div className="pt-6">
        <AnimatedSection delay={0.05}>
          <RecurringList items={items} />
        </AnimatedSection>
      </div>

      {/* FAB */}
      <button
        onClick={() => setSheetOpen(true)}
        aria-label="Wiederkehrende Transaktion hinzufügen"
        className="fixed bottom-28 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-primary-foreground shadow-lg transition-all active:scale-90"
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
          onDone={() => setSheetOpen(false)}
        />
      </BottomSheet>
    </div>
  )
}
