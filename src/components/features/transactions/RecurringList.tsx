'use client'

import { useActionState } from 'react'
import { Pause, Play, Trash2, Repeat, Target } from 'lucide-react'
import { toast } from 'sonner'
import { ICON_MAP } from '@/components/features/categories/iconMap'
import { EmptyState } from '@/components/ui/empty-state'
import { toggleRecurring, removeRecurring } from '@/app/(app)/transactions/actions'
import { formatCurrencyWithSymbol } from '@/lib/utils/formatCurrency'
import type { RecurringTransactionWithCategory } from '@/lib/types/database'
import { cn } from '@/lib/utils'

const INTERVAL_LABELS: Record<string, string> = {
  weekly: 'Wöchentlich',
  monthly: 'Monatlich',
  yearly: 'Jährlich',
}

interface RecurringListProps {
  items: RecurringTransactionWithCategory[]
  onEdit?: (item: RecurringTransactionWithCategory) => void
}

export function RecurringList({ items, onEdit }: RecurringListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Repeat}
        title="Noch keine wiederkehrenden Transaktionen"
        description="Lege Abos, Miete oder dein Gehalt einmal an — Monéa bucht sie automatisch jeden Monat."
        variant="feature"
      />
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <RecurringRow key={item.id} item={item} onEdit={onEdit} />
      ))}
    </div>
  )
}

function RecurringRow({ item, onEdit }: { item: RecurringTransactionWithCategory; onEdit?: (item: RecurringTransactionWithCategory) => void }) {
  const isDeposit = item.type === 'savings_deposit'
  const Icon = !isDeposit && item.category ? ICON_MAP[item.category.icon] : null
  const color = item.category?.color ?? '#888'
  const amount = Number(item.amount)
  const sign = item.type === 'income' ? '+' : isDeposit ? '' : '-'
  const formatted = `${sign}${formatCurrencyWithSymbol(amount)}`
  const label = isDeposit
    ? (item.goal?.name ?? 'Sparziel')
    : (item.category?.name ?? 'Ohne Kategorie')

  const [, toggleAction] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await toggleRecurring(formData)
      if (result.error) toast.error(result.error)
      return result
    },
    null
  )

  const [, deleteAction] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await removeRecurring(formData)
      if (result.error) toast.error(result.error)
      else toast.success('Gelöscht')
      return result
    },
    null
  )

  return (
    <div className={cn(
      'flex items-center gap-2 rounded-xl bg-surface-container-low p-4 transition-all',
      !item.is_active && 'opacity-50'
    )}>
      <button
        type="button"
        onClick={() => onEdit?.(item)}
        className="flex min-w-0 flex-1 items-center gap-4 rounded-lg text-left transition-all hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.99]"
      >
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: isDeposit ? undefined : color + '20' }}
        >
          {isDeposit ? (
            <Target size={20} className="text-primary" />
          ) : Icon ? (
            <Icon size={20} style={{ color }} />
          ) : null}
        </div>

        <div className="flex-1 min-w-0">
          <p className="truncate text-base font-semibold text-foreground">
            {label}
          </p>
          <p className="text-xs text-on-surface-variant">
            {INTERVAL_LABELS[item.interval]} · {new Date(item.next_due).toLocaleDateString('de-DE')}
          </p>
          {item.note && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.note}</p>
          )}
        </div>

        <p
          className={cn(
            'font-display text-lg font-semibold tabular-nums',
            item.type === 'income' ? 'text-success' : isDeposit ? 'text-primary' : 'text-foreground'
          )}
        >
          {formatted}
        </p>
      </button>

      <div className="flex items-center gap-1">
        <form action={toggleAction}>
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="is_active" value={String(item.is_active)} />
          <button
            type="submit"
            aria-label={item.is_active ? 'Pausieren' : 'Wieder aktivieren'}
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors active:scale-90 active:bg-surface-container"
          >
            {item.is_active ? <Pause size={18} /> : <Play size={18} />}
          </button>
        </form>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            aria-label="Löschen"
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-destructive active:scale-90 active:bg-destructive/10 active:text-destructive"
          >
            <Trash2 size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
