'use client'

import type { TransactionWithCategory } from '@/lib/types/database'
import { ICON_MAP } from '@/components/features/categories/iconMap'
import { getShapeForCategory } from '@/components/features/categories/organicShapes'
import { cn } from '@/lib/utils'

export const BLOB_SHAPES = [
  'rounded-[3rem_1rem_3rem_4rem]',
  'rounded-[2rem_4rem_1.5rem_3rem]',
  'rounded-[3.5rem_2rem_4rem_1.5rem]',
]

interface TransactionGroupProps {
  label: string
  dateLabel: string
  transactions: TransactionWithCategory[]
  onEdit?: (transaction: TransactionWithCategory) => void
}

export function TransactionGroup({ label, dateLabel, transactions, onEdit }: TransactionGroupProps) {
  return (
    <section className="mb-8">
      <div className="mb-5 flex items-baseline justify-between px-2">
        <h2 className="font-heading text-xl font-bold text-foreground">{label}</h2>
        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          {dateLabel}
        </span>
      </div>
      <div className="space-y-4">
        {transactions.map((tx, i) => (
          <TransactionCard
            key={tx.id}
            transaction={tx}
            blobIndex={i % BLOB_SHAPES.length}
            onEdit={onEdit}
          />
        ))}
      </div>
    </section>
  )
}

export function TransactionCard({
  transaction,
  blobIndex,
  onEdit,
}: {
  transaction: TransactionWithCategory
  blobIndex: number
  onEdit?: (transaction: TransactionWithCategory) => void
}) {
  const IconComponent = transaction.category
    ? ICON_MAP[transaction.category.icon]
    : null

  const formatted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    signDisplay: 'always',
  }).format(
    transaction.type === 'expense' ? -transaction.amount : transaction.amount
  )

  const timeFormatted = new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(transaction.created_at))

  return (
    <button
      type="button"
      onClick={() => onEdit?.(transaction)}
      className={cn(
        'flex w-full items-center justify-between p-5 text-left transition-all active:scale-[0.98]',
        BLOB_SHAPES[blobIndex],
        transaction.type === 'income'
          ? 'border-2 border-secondary bg-background'
          : 'bg-surface-container-low'
      )}
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center',
            transaction.category
              ? getShapeForCategory(transaction.category.id)
              : 'rounded-full'
          )}
          style={{
            backgroundColor: transaction.category
              ? `${transaction.category.color}25`
              : 'var(--secondary)',
          }}
        >
          {IconComponent ? (
            <IconComponent
              size={22}
              style={{ color: transaction.category?.color }}
            />
          ) : (
            <span className="text-sm text-muted-foreground">?</span>
          )}
        </div>
        <div>
          <p className="font-heading text-lg font-bold text-foreground">
            {transaction.note || transaction.category?.name || 'Transaction'}
          </p>
          <p className="text-sm font-medium text-on-surface-variant">
            {transaction.category?.name ?? 'Uncategorized'} · {timeFormatted}
          </p>
        </div>
      </div>

      <p
        className={cn(
          'font-heading text-xl font-extrabold',
          transaction.type === 'income'
            ? 'text-muted-foreground'
            : 'text-foreground'
        )}
      >
        {formatted}
      </p>
    </button>
  )
}
