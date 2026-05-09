'use client'

import { useActionState } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { removeTransaction } from '@/app/(app)/transactions/actions'
import type { TransactionWithCategory } from '@/lib/types/database'
import { ICON_MAP } from '@/components/features/categories/iconMap'

interface TransactionListProps {
  transactions: TransactionWithCategory[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No transactions yet. Add your first one below.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <TransactionItem key={tx.id} transaction={tx} />
      ))}
    </div>
  )
}

function TransactionItem({ transaction }: { transaction: TransactionWithCategory }) {
  const [, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await removeTransaction(formData)
      if (result?.error) toast.error(result.error)
      else toast.success('Transaction deleted.')
      return result
    },
    undefined
  )

  const IconComponent = transaction.category
    ? ICON_MAP[transaction.category.icon]
    : null

  const formatted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    signDisplay: 'always',
  }).format(
    transaction.type === 'expense'
      ? -transaction.amount
      : transaction.amount
  )

  const dateFormatted = new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(transaction.date))

  return (
    <div className="flex items-center gap-4 rounded-xl bg-surface-container-low p-4">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          backgroundColor: transaction.category
            ? `${transaction.category.color}20`
            : 'var(--secondary)',
        }}
      >
        {IconComponent ? (
          <IconComponent
            size={20}
            style={{ color: transaction.category?.color }}
          />
        ) : (
          <span className="text-sm text-muted-foreground">?</span>
        )}
      </div>

      <div className="flex-1">
        <p className="font-semibold text-foreground">
          {transaction.note || transaction.category?.name || 'Transaction'}
        </p>
        <p className="text-xs text-on-surface-variant">
          {dateFormatted}
          {transaction.category ? ` · ${transaction.category.name}` : ''}
        </p>
      </div>

      <p className={`font-display font-semibold ${
        transaction.type === 'income' ? 'text-success' : 'text-foreground'
      }`}>
        {formatted}
      </p>

      <form action={action}>
        <input type="hidden" name="id" value={transaction.id} />
        <button
          type="submit"
          disabled={pending}
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive active:scale-95"
        >
          <Trash2 size={16} />
        </button>
      </form>
    </div>
  )
}
