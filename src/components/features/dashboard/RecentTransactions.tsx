'use client'

import Link from 'next/link'
import { Receipt } from 'lucide-react'
import type { TransactionWithCategory } from '@/lib/types/database'
import { TransactionCard, BLOB_SHAPES } from '@/components/features/transactions/TransactionGroup'
import { EmptyState } from '@/components/ui/empty-state'

interface RecentTransactionsProps {
  transactions: TransactionWithCategory[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-heading text-xl font-bold text-foreground">Letzte Transaktionen</h2>
        <Link
          href="/transactions"
          className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Alle anzeigen
        </Link>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Noch keine Transaktionen"
          description="Sobald du Einnahmen oder Ausgaben erfasst, erscheinen sie hier."
        />
      ) : (
        <div className="space-y-4">
          {transactions.map((tx, i) => (
            <TransactionCard
              key={tx.id}
              transaction={tx}
              blobIndex={i % BLOB_SHAPES.length}
            />
          ))}
        </div>
      )}
    </section>
  )
}
