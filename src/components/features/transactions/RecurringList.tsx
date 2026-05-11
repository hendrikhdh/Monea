'use client'

import { useActionState } from 'react'
import { Pause, Play, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ICON_MAP } from '@/components/features/categories/iconMap'
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
}

export function RecurringList({ items }: RecurringListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          Noch keine wiederkehrenden Transaktionen
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <RecurringRow key={item.id} item={item} />
      ))}
    </div>
  )
}

function RecurringRow({ item }: { item: RecurringTransactionWithCategory }) {
  const Icon = item.category ? ICON_MAP[item.category.icon] : null
  const color = item.category?.color ?? '#888'
  const amount = Number(item.amount)
  const formatted = `${item.type === 'income' ? '+' : '-'}${formatCurrencyWithSymbol(amount)}`

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
      'flex items-center gap-4 rounded-xl bg-surface-container-low p-4',
      !item.is_active && 'opacity-50'
    )}>
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: color + '20' }}
      >
        {Icon && <Icon size={20} style={{ color }} />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="truncate text-base font-semibold text-foreground">
          {item.category?.name ?? 'Ohne Kategorie'}
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
          item.type === 'income' ? 'text-success' : 'text-foreground'
        )}
      >
        {formatted}
      </p>

      <div className="flex items-center gap-1">
        <form action={toggleAction}>
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="is_active" value={String(item.is_active)} />
          <button
            type="submit"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground active:scale-90"
          >
            {item.is_active ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </form>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-destructive active:scale-90"
          >
            <Trash2 size={14} />
          </button>
        </form>
      </div>
    </div>
  )
}
