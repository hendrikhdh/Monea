'use client'

import { Target } from 'lucide-react'
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
  const isDeposit = transaction.type === 'savings_deposit'
  const IconComponent = !isDeposit && transaction.category
    ? ICON_MAP[transaction.category.icon]
    : null

  const formatted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    signDisplay: isDeposit ? 'never' : 'always',
  }).format(
    transaction.type === 'income' ? transaction.amount : isDeposit ? transaction.amount : -transaction.amount
  )

  const timeFormatted = new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(transaction.created_at))

  const containerClass = transaction.type === 'income'
    ? 'border-2 border-secondary bg-background'
    : isDeposit
      ? 'border-2 border-primary-container/40 bg-background'
      : 'bg-surface-container-low'

  const amountClass = transaction.type === 'income'
    ? 'text-success'
    : isDeposit
      ? 'text-primary'
      : 'text-foreground'

  const subtitleLabel = isDeposit
    ? transaction.goal?.name ?? 'Sparziel'
    : transaction.category?.name ?? 'Uncategorized'

  return (
    <button
      type="button"
      onClick={() => onEdit?.(transaction)}
      className={cn(
        'flex w-full items-center gap-4 p-4 text-left transition-all active:scale-[0.98]',
        BLOB_SHAPES[blobIndex],
        containerClass
      )}
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
    >
      <div
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center',
          isDeposit
            ? `${getShapeForCategory(transaction.goal_id ?? transaction.id)} bg-primary-container/30`
            : transaction.category
              ? getShapeForCategory(transaction.category.id)
              : 'rounded-full'
        )}
        style={{
          backgroundColor: isDeposit
            ? undefined
            : transaction.category
              ? `${transaction.category.color}25`
              : 'var(--secondary)',
        }}
      >
        {isDeposit ? (
          <Target size={20} className="text-primary" />
        ) : IconComponent ? (
          <IconComponent
            size={20}
            style={{ color: transaction.category?.color }}
          />
        ) : (
          <span className="text-sm text-muted-foreground">?</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="truncate text-base font-semibold text-foreground">
          {transaction.note || subtitleLabel}
        </p>
        <p className="text-xs text-on-surface-variant">
          {subtitleLabel} · {timeFormatted}
        </p>
      </div>

      <p className={cn('font-display text-lg font-semibold tabular-nums', amountClass)}>
        {formatted}
      </p>
    </button>
  )
}
