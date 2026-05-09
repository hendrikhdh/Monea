'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/animated-section'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { RecurringList } from './RecurringList'
import { AddRecurringForm } from './AddRecurringForm'
import { TransactionTabs } from './TransactionTabs'
import type { Category, RecurringTransactionWithCategory } from '@/lib/types/database'

interface RecurringViewProps {
  items: RecurringTransactionWithCategory[]
  categories: Category[]
}

export function RecurringView({ items, categories }: RecurringViewProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-6">
      <AnimatedSection delay={0}>
        <TransactionTabs active="recurring" />
      </AnimatedSection>

      <AnimatedSection delay={0.05}>
        <RecurringList items={items} />
      </AnimatedSection>

      {/* FAB */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-28 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all active:scale-90"
      >
        <Plus size={24} />
      </button>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <h3 className="mb-4 text-center font-heading text-lg font-bold">
          Neue wiederkehrende Transaktion
        </h3>
        <AddRecurringForm
          categories={categories}
          onDone={() => setSheetOpen(false)}
        />
      </BottomSheet>
    </div>
  )
}
