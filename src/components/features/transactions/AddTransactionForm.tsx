'use client'

import { useActionState, useState, useCallback, useEffect } from 'react'
import { Check, Trash2 } from 'lucide-react'
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

export function AddTransactionForm({ categories, transaction, onDone }: AddTransactionFormProps) {
  const isEdit = !!transaction

  const [type, setType] = useState<'expense' | 'income'>(transaction?.type ?? 'expense')
  const [cents, setCents] = useState(() => {
    if (transaction) return Math.round(transaction.amount * 100)
    return 0
  })
  const [categoryId, setCategoryId] = useState<string | null>(transaction?.category_id ?? null)
  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    if (transaction) {
      setType(transaction.type)
      setCents(Math.round(transaction.amount * 100))
      setCategoryId(transaction.category_id)
    } else {
      setType('expense')
      setCents(0)
      setCategoryId(null)
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
      formData.set('date', transaction?.date ?? today)
      formData.set('note', transaction?.note ?? '')

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
