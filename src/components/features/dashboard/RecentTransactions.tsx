'use client'

import Link from 'next/link'
import type { TransactionWithCategory } from '@/lib/types/database'
import { TransactionCard, BLOB_SHAPES } from '@/components/features/transactions/TransactionGroup'

interface RecentTransactionsProps {
  transactions: TransactionWithCategory[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <h3 className="font-heading text-2xl font-bold">Letzte Transaktionen</h3>
        <Link
          href="/transactions"
          className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Alle anzeigen
        </Link>
      </div>

      {transactions.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Noch keine Transaktionen.
        </p>
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
