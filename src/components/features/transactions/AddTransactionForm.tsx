'use client'

import { useActionState, useState, useCallback, useEffect } from 'react'
import { Check, Trash2, Calendar, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { addTransaction, editTransaction, removeTransaction } from '@/app/(app)/transactions/actions'
import type { Category, TransactionWithCategory } from '@/lib/types/database'
import { AmountDisplay } from './AmountDisplay'
import { CategoryPicker } from './CategoryPicker'
import { NumericKeypad } from './NumericKeypad'
import { cn } from '@/lib/utils'

interface AddTransactionFormProps {
  categories: Category[]
  transaction?: TransactionWithCategory | null
  onDone?: () => void
}

const MAX_CENTS = 9999999

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function formatDateLabel(iso: string): string {
  const today = todayIso()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayIso = yesterday.toISOString().slice(0, 10)

  if (iso === today) return 'Heute'
  if (iso === yesterdayIso) return 'Gestern'

  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })
}

export function AddTransactionForm({ categories, transaction, onDone }: AddTransactionFormProps) {
  const isEdit = !!transaction

  const [type, setType] = useState<'expense' | 'income'>(transaction?.type ?? 'expense')
  const [cents, setCents] = useState(() => {
    if (transaction) return Math.round(transaction.amount * 100)
    return 0
  })
  const [categoryId, setCategoryId] = useState<string | null>(transaction?.category_id ?? null)
  const [date, setDate] = useState<string>(transaction?.date ?? todayIso())
  const [note, setNote] = useState<string>(transaction?.note ?? '')
  const [noteEditing, setNoteEditing] = useState<boolean>(!!transaction?.note)

  useEffect(() => {
    if (transaction) {
      setType(transaction.type)
      setCents(Math.round(transaction.amount * 100))
      setCategoryId(transaction.category_id)
      setDate(transaction.date)
      setNote(transaction.note ?? '')
      setNoteEditing(!!transaction.note)
    } else {
      setType('expense')
      setCents(0)
      setCategoryId(null)
      setDate(todayIso())
      setNote('')
      setNoteEditing(false)
    }
  }, [transaction])

  const filteredCategories = categories.filter(
    (c) => c.type === type || c.type === 'both'
  )

  const handleDigit = useCallback((digit: string) => {
    setCents((prev) => {
      const next = prev * 10 + parseInt(digit, 10)
      return next > MAX_CENTS ? prev : next
    })
  }, [])

  const handleBackspace = useCallback(() => {
    setCents((prev) => Math.floor(prev / 10))
  }, [])

  const [, action, pending] = useActionState(
    async (_prev: unknown) => {
      const amount = (cents / 100).toFixed(2)
      const formData = new FormData()
      formData.set('amount', amount)
      formData.set('type', type)
      formData.set('category_id', categoryId || '')
      formData.set('date', date || todayIso())
      formData.set('note', note.trim())

      if (isEdit) {
        formData.set('id', transaction.id)
        const result = await editTransaction(formData)
        if (result?.error) {
          toast.error(result.error)
        } else {
          toast.success('Transaktion aktualisiert!')
          onDone?.()
        }
        return result
      }

      const result = await addTransaction(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(type === 'expense' ? 'Ausgabe gespeichert!' : 'Einnahme gespeichert!')
        setCents(0)
        setCategoryId(null)
        setDate(todayIso())
        setNote('')
        setNoteEditing(false)
        onDone?.()
      }
      return result
    },
    undefined
  )

  const [, deleteAction, deletePending] = useActionState(
    async (_prev: unknown) => {
      if (!transaction) return
      const formData = new FormData()
      formData.set('id', transaction.id)
      const result = await removeTransaction(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Transaktion gelöscht.')
        onDone?.()
      }
      return result
    },
    undefined
  )

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Type toggle */}
      <div className="flex gap-2 rounded-full bg-surface-container-low p-1">
        {(['expense', 'income'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setType(t)
              setCategoryId(null)
            }}
            className={cn(
              'rounded-full px-6 py-2 text-sm font-semibold transition-all active:scale-95',
              type === t
                ? 'bg-primary-container text-primary-foreground'
                : 'text-muted-foreground'
            )}
          >
            {t === 'expense' ? 'Ausgabe' : 'Einnahme'}
          </button>
        ))}
      </div>

      {/* Amount blob */}
      <AmountDisplay cents={cents} type={type} />

      {/* Category picker */}
      <CategoryPicker
        categories={filteredCategories}
        selected={categoryId}
        onSelect={setCategoryId}
      />

      {/* Date + Note row */}
      <div className="flex w-full items-center gap-2">
        <label className="relative flex h-10 flex-1 items-center gap-2 rounded-full bg-surface-container-low px-3 text-xs font-semibold text-foreground transition-all active:scale-95">
          <Calendar size={14} className="shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate">{formatDateLabel(date)}</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value || todayIso())}
            max={todayIso()}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Datum"
          />
        </label>

        {noteEditing ? (
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 200))}
            onBlur={() => { if (!note.trim()) setNoteEditing(false) }}
            placeholder="Notiz…"
            maxLength={200}
            className="h-10 flex-[1.5] rounded-full bg-surface-container-low px-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            enterKeyHint="done"
            // No autoFocus on iOS — pushes content offscreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setNoteEditing(true)}
            className="flex h-10 flex-[1.5] items-center gap-2 rounded-full bg-surface-container-low px-3 text-xs font-semibold text-muted-foreground transition-all active:scale-95"
          >
            <Pencil size={14} className="shrink-0" />
            <span className="flex-1 truncate text-left">Notiz hinzufügen</span>
          </button>
        )}
      </div>

      {/* Numpad */}
      <div className="w-full">
        <NumericKeypad
          onDigit={handleDigit}
          onBackspace={handleBackspace}
        />
      </div>

      {/* Action buttons */}
      <div className="flex w-full gap-3">
        {isEdit && (
          <button
            type="button"
            disabled={deletePending}
            onClick={() => deleteAction()}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-destructive/20 text-destructive transition-all active:scale-95 disabled:opacity-40"
          >
            <Trash2 size={20} />
          </button>
        )}
        <form action={action} className="flex-1">
          <button
            type="submit"
            disabled={pending || cents === 0}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-primary-container font-heading text-lg font-bold tracking-wide text-primary-foreground shadow-[0_15px_30px_rgba(62,39,35,0.2)] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
          >
            <span>{pending ? 'Speichern…' : isEdit ? 'Aktualisieren' : 'Speichern'}</span>
            {!pending && <Check size={20} />}
          </button>
        </form>
      </div>
    </div>
  )
}
