'use client'

import { useActionState, useState, useCallback, useMemo } from 'react'
import { Check, Trash2, Calendar, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { addTransaction, editTransaction, removeTransaction } from '@/app/(app)/transactions/actions'
import type { Category, Goal, PortfolioAccount, TransactionType, TransactionWithCategory } from '@/lib/types/database'
import { useIsDesktop } from '@/lib/hooks/useIsDesktop'
import { AmountDisplay } from './AmountDisplay'
import { CategoryPicker } from './CategoryPicker'
import { GoalPicker } from './GoalPicker'
import { AccountPicker } from './AccountPicker'
import { NumericKeypad } from './NumericKeypad'
import { cn } from '@/lib/utils'

type GoalOption = Pick<Goal, 'id' | 'name' | 'target_amount' | 'current_amount'>

interface AddTransactionFormProps {
  categories: Category[]
  goals: GoalOption[]
  accounts: PortfolioAccount[]
  transaction?: TransactionWithCategory | null
  onDone?: () => void
}

const MAX_CENTS = 9999999

const TYPE_LABEL: Record<TransactionType, string> = {
  expense: 'Ausgabe',
  income: 'Einnahme',
  savings_deposit: 'Sparen',
  transfer: 'Transfer',
}

const SUCCESS_LABEL: Record<TransactionType, string> = {
  expense: 'Ausgabe gespeichert!',
  income: 'Einnahme gespeichert!',
  savings_deposit: 'Spareinlage gespeichert!',
  transfer: 'Transfer gespeichert!',
}

const PICKER_LABEL_CLASS = 'mb-1 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground'

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

export function AddTransactionForm({ categories, goals, accounts, transaction, onDone }: AddTransactionFormProps) {
  const isEdit = !!transaction
  const isDesktop = useIsDesktop()

  const primaryId = useMemo(
    () => accounts.find((a) => a.is_primary)?.id ?? accounts[0]?.id ?? null,
    [accounts]
  )

  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'expense')
  const [cents, setCents] = useState(() => {
    if (transaction) return Math.round(transaction.amount * 100)
    return 0
  })
  const [categoryId, setCategoryId] = useState<string | null>(transaction?.category_id ?? null)
  const [goalId, setGoalId] = useState<string | null>(transaction?.goal_id ?? null)
  const [accountId, setAccountId] = useState<string | null>(transaction?.account_id ?? primaryId)
  const [toAccountId, setToAccountId] = useState<string | null>(transaction?.to_account_id ?? null)
  const [date, setDate] = useState<string>(transaction?.date ?? todayIso())
  const [note, setNote] = useState<string>(transaction?.note ?? '')
  const [noteEditing, setNoteEditing] = useState<boolean>(!!transaction?.note)

  // Re-sync local state when the edited transaction changes (sheet reused across opens)
  const [prevTransaction, setPrevTransaction] = useState(transaction)
  if (transaction !== prevTransaction) {
    setPrevTransaction(transaction)
    if (transaction) {
      setType(transaction.type)
      setCents(Math.round(transaction.amount * 100))
      setCategoryId(transaction.category_id)
      setGoalId(transaction.goal_id)
      setAccountId(transaction.account_id ?? primaryId)
      setToAccountId(transaction.to_account_id ?? null)
      setDate(transaction.date)
      setNote(transaction.note ?? '')
      setNoteEditing(!!transaction.note)
    } else {
      setType('expense')
      setCents(0)
      setCategoryId(null)
      setGoalId(null)
      setAccountId(primaryId)
      setToAccountId(null)
      setDate(todayIso())
      setNote('')
      setNoteEditing(false)
    }
  }

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

  const selectType = (t: TransactionType) => {
    setType(t)
    setCategoryId(null)
    setGoalId(null)
    setAccountId(primaryId)
    setToAccountId(null)
  }

  const [, action, pending] = useActionState(
    async () => {
      const amount = (cents / 100).toFixed(2)
      const formData = new FormData()
      formData.set('amount', amount)
      formData.set('type', type)
      formData.set('category_id', type === 'savings_deposit' || type === 'transfer' ? '' : (categoryId || ''))
      formData.set('goal_id', type === 'savings_deposit' ? (goalId || '') : '')
      formData.set('account_id', type === 'savings_deposit' ? '' : (accountId || ''))
      formData.set('to_account_id', type === 'transfer' ? (toAccountId || '') : '')
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
        toast.success(SUCCESS_LABEL[type])
        setCents(0)
        setCategoryId(null)
        setGoalId(null)
        setAccountId(primaryId)
        setToAccountId(null)
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
    async () => {
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

  const canSubmit =
    cents > 0 &&
    (type === 'savings_deposit'
      ? !!goalId
      : type === 'transfer'
        ? !!accountId && !!toAccountId && accountId !== toAccountId
        : !!accountId)

  return (
    <form action={action} className="flex flex-col items-center gap-4">
      {/* Type toggle */}
      <div className="flex w-full gap-1 rounded-full bg-surface-container-low p-1">
        {(['expense', 'income', 'savings_deposit', 'transfer'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => selectType(t)}
            className={cn(
              'flex-1 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition-all hover:bg-surface-container active:scale-95',
              type === t
                ? 'bg-primary-container text-primary-foreground hover:bg-primary-container'
                : 'text-muted-foreground'
            )}
          >
            {TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      {/* Amount blob — editable on desktop, read-only (numpad-driven) on mobile */}
      <AmountDisplay
        cents={cents}
        type={type}
        onChange={isDesktop ? setCents : undefined}
        autoFocus={isDesktop && !isEdit}
      />

      {/* Picker — Category for income/expense, Goal for savings, Accounts for transfer */}
      {type === 'savings_deposit' ? (
        <GoalPicker goals={goals} selected={goalId} onSelect={setGoalId} />
      ) : type === 'transfer' ? (
        <div className="w-full space-y-3">
          <div>
            <p className={PICKER_LABEL_CLASS}>Von</p>
            <AccountPicker
              accounts={accounts}
              selected={accountId}
              onSelect={setAccountId}
              exclude={toAccountId}
              emptyHint="Lege zuerst Konten im Portfolio an."
            />
          </div>
          <div>
            <p className={PICKER_LABEL_CLASS}>Nach</p>
            <AccountPicker
              accounts={accounts}
              selected={toAccountId}
              onSelect={setToAccountId}
              exclude={accountId}
              emptyHint="Lege ein zweites Konto an."
            />
          </div>
        </div>
      ) : (
        <div className="w-full space-y-3">
          <CategoryPicker
            categories={filteredCategories}
            selected={categoryId}
            onSelect={setCategoryId}
          />
          <div>
            <p className={PICKER_LABEL_CLASS}>Konto</p>
            <AccountPicker
              accounts={accounts}
              selected={accountId}
              onSelect={setAccountId}
              emptyHint="Lege zuerst ein Konto im Portfolio an."
            />
          </div>
        </div>
      )}

      {/* Date + Note row */}
      <div className="flex w-full items-center gap-2">
        <label className="relative flex h-10 flex-1 items-center gap-2 rounded-full bg-surface-container-low px-3 text-xs font-semibold text-foreground transition-all active:scale-95">
          <Calendar size={14} className="shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate">{formatDateLabel(date)}</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value || todayIso())}
            onClick={(e) => e.currentTarget.showPicker?.()}
            onFocus={(e) => e.currentTarget.showPicker?.()}
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

      {/* Numpad — mobile only; on desktop the amount is typed directly into AmountDisplay */}
      {!isDesktop && (
        <div className="w-full">
          <NumericKeypad
            onDigit={handleDigit}
            onBackspace={handleBackspace}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex w-full gap-3">
        {isEdit && (
          <button
            type="button"
            disabled={deletePending}
            onClick={() => deleteAction()}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-destructive/20 text-destructive transition-all hover:bg-destructive/10 active:scale-95 disabled:opacity-40"
          >
            <Trash2 size={20} />
          </button>
        )}
        <button
          type="submit"
          disabled={pending || !canSubmit}
          className="flex h-14 flex-1 items-center justify-center gap-3 rounded-full bg-primary-container font-heading text-lg font-bold tracking-wide text-primary-foreground shadow-[0_15px_30px_rgba(62,39,35,0.2)] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
        >
          <span>{pending ? 'Speichern…' : isEdit ? 'Aktualisieren' : 'Speichern'}</span>
          {!pending && <Check size={20} />}
        </button>
      </div>
    </form>
  )
}
