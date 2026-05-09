'use client'

import { useState, useActionState } from 'react'
import { toast } from 'sonner'
import { addRecurring } from '@/app/(app)/transactions/actions'
import type { Category } from '@/lib/types/database'
import { ICON_MAP } from '@/components/features/categories/iconMap'

interface AddRecurringFormProps {
  categories: Category[]
  onDone: () => void
}

export function AddRecurringForm({ categories, onDone }: AddRecurringFormProps) {
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [categoryId, setCategoryId] = useState('')
  const [interval, setInterval] = useState<'weekly' | 'monthly' | 'yearly'>('monthly')

  const filteredCategories = categories.filter(
    (c) => c.type === type || c.type === 'both'
  )

  const today = new Date().toISOString().slice(0, 10)

  const [, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await addRecurring(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Wiederkehrende Transaktion erstellt')
        onDone()
      }
      return result
    },
    null
  )

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="category_id" value={categoryId} />
      <input type="hidden" name="interval" value={interval} />

      {/* Type toggle */}
      <div className="flex gap-2 rounded-xl bg-surface-container p-1">
        <button
          type="button"
          onClick={() => { setType('expense'); setCategoryId('') }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${type === 'expense' ? 'bg-destructive/10 text-destructive' : 'text-muted-foreground'}`}
        >
          Ausgabe
        </button>
        <button
          type="button"
          onClick={() => { setType('income'); setCategoryId('') }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${type === 'income' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
        >
          Einnahme
        </button>
      </div>

      {/* Amount */}
      <div>
        <label className="text-xs font-semibold text-on-surface-variant">Betrag (€)</label>
        <input
          type="number"
          name="amount"
          min="0.01"
          step="0.01"
          required
          className="mt-1 h-12 w-full rounded-xl border border-input bg-transparent px-4 text-lg font-semibold focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      {/* Interval */}
      <div>
        <label className="text-xs font-semibold text-on-surface-variant">Intervall</label>
        <div className="mt-1 flex gap-2">
          {(['weekly', 'monthly', 'yearly'] as const).map((iv) => (
            <button
              key={iv}
              type="button"
              onClick={() => setInterval(iv)}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${interval === iv ? 'bg-secondary text-secondary-foreground' : 'bg-surface-container text-muted-foreground'}`}
            >
              {iv === 'weekly' ? 'Wöchentlich' : iv === 'monthly' ? 'Monatlich' : 'Jährlich'}
            </button>
          ))}
        </div>
      </div>

      {/* Start date */}
      <div>
        <label className="text-xs font-semibold text-on-surface-variant">Startdatum</label>
        <input
          type="date"
          name="start_date"
          defaultValue={today}
          required
          className="mt-1 h-12 w-full rounded-xl border border-input bg-transparent px-4 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      {/* Category */}
      <div>
        <label className="text-xs font-semibold text-on-surface-variant">Kategorie</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {filteredCategories.map((cat) => {
            const Icon = ICON_MAP[cat.icon]
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  categoryId === cat.id
                    ? 'bg-secondary text-secondary-foreground ring-2 ring-ring'
                    : 'bg-surface-container text-muted-foreground'
                }`}
              >
                {Icon && <Icon size={14} />}
                {cat.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="text-xs font-semibold text-on-surface-variant">Notiz (optional)</label>
        <input
          type="text"
          name="note"
          maxLength={200}
          className="mt-1 h-12 w-full rounded-xl border border-input bg-transparent px-4 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition-all active:scale-95 disabled:opacity-50"
      >
        {pending ? 'Wird erstellt...' : 'Erstellen'}
      </button>
    </form>
  )
}
