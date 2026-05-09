'use client'

import { useActionState } from 'react'
import { Pause, Play, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ICON_MAP } from '@/components/features/categories/iconMap'
import { toggleRecurring, removeRecurring } from '@/app/(app)/transactions/actions'
import type { RecurringTransactionWithCategory } from '@/lib/types/database'

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
    <div className="space-y-2">
      {items.map((item) => (
        <RecurringRow key={item.id} item={item} />
      ))}
    </div>
  )
}

function RecurringRow({ item }: { item: RecurringTransactionWithCategory }) {
  const Icon = item.category ? ICON_MAP[item.category.icon] : null
  const color = item.category?.color ?? '#888'

  const format = (v: number) =>
    new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 }).format(v)

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
    <div className={`flex items-center gap-3 rounded-xl bg-surface-container-low p-4 ${!item.is_active ? 'opacity-50' : ''}`}>
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: color + '20' }}
      >
        {Icon && <Icon size={18} style={{ color }} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between">
          <span className="truncate text-sm font-medium">
            {item.category?.name ?? 'Ohne Kategorie'}
          </span>
          <span className={`text-sm font-semibold ${item.type === 'income' ? 'text-primary' : ''}`}>
            {item.type === 'income' ? '+' : '-'}{format(Number(item.amount))} €
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{INTERVAL_LABELS[item.interval]}</span>
          <span>·</span>
          <span>Nächste: {new Date(item.next_due).toLocaleDateString('de-DE')}</span>
        </div>
        {item.note && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.note}</p>
        )}
      </div>

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
