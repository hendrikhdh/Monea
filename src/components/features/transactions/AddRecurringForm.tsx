'use client'

import { useRef, useState, useActionState } from 'react'
import { Target } from 'lucide-react'
import { toast } from 'sonner'
import { addRecurring } from '@/app/(app)/transactions/actions'
import type { Category, Goal, PortfolioAccount, TransactionType } from '@/lib/types/database'
import { ICON_MAP } from '@/components/features/categories/iconMap'
import { PORTFOLIO_ICON_MAP } from '@/components/features/portfolio/portfolioIcons'

interface AddRecurringFormProps {
  categories: Category[]
  goals: Goal[]
  accounts: PortfolioAccount[]
  onDone?: () => void
}

const TYPE_LABEL: Record<TransactionType, string> = {
  expense: 'Ausgabe',
  income: 'Einnahme',
  savings_deposit: 'Sparen',
  transfer: 'Transfer',
}

export function AddRecurringForm({ categories, goals, accounts, onDone }: AddRecurringFormProps) {
  const primaryId = accounts.find((a) => a.is_primary)?.id ?? accounts[0]?.id ?? ''
  const [type, setType] = useState<TransactionType>('expense')
  const [categoryId, setCategoryId] = useState('')
  const [goalId, setGoalId] = useState('')
  const [accountId, setAccountId] = useState(primaryId)
  const [interval, setInterval] = useState<'weekly' | 'monthly' | 'yearly'>('monthly')
  const formRef = useRef<HTMLFormElement>(null)

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
        if (onDone) {
          onDone()
        } else {
          setType('expense')
          setCategoryId('')
          setGoalId('')
          setAccountId(primaryId)
          setInterval('monthly')
          formRef.current?.reset()
        }
      }
      return result
    },
    null
  )

  const isDeposit = type === 'savings_deposit'
  const canSubmit = isDeposit ? !!goalId : !!accountId

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="category_id" value={isDeposit ? '' : categoryId} />
      <input type="hidden" name="goal_id" value={isDeposit ? goalId : ''} />
      <input type="hidden" name="account_id" value={isDeposit ? '' : accountId} />
      <input type="hidden" name="interval" value={interval} />

      {/* Type toggle */}
      <div className="flex gap-1 rounded-xl bg-surface-container p-1">
        {(['expense', 'income', 'savings_deposit'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setType(t); setCategoryId(''); setGoalId('') }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
              type === t
                ? t === 'expense'
                  ? 'bg-destructive/10 text-destructive'
                  : t === 'income'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-primary-container/40 text-foreground'
                : 'text-muted-foreground'
            }`}
          >
            {TYPE_LABEL[t]}
          </button>
        ))}
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

      {/* Picker — Category for income/expense, Goal for savings */}
      {isDeposit ? (
        <div>
          <label className="text-xs font-semibold text-on-surface-variant">Sparziel</label>
          {goals.length === 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Lege zuerst ein Sparziel an.
            </p>
          ) : (
            <div className="mt-1 flex flex-wrap gap-2">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setGoalId(goal.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    goalId === goal.id
                      ? 'bg-secondary text-secondary-foreground ring-2 ring-ring'
                      : 'bg-surface-container text-muted-foreground'
                  }`}
                >
                  <Target size={14} />
                  {goal.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
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
          <div>
            <label className="text-xs font-semibold text-on-surface-variant">Konto</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {accounts.map((acc) => {
                const Icon = PORTFOLIO_ICON_MAP[acc.icon] ?? PORTFOLIO_ICON_MAP.Wallet
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setAccountId(acc.id)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      accountId === acc.id
                        ? 'bg-secondary text-secondary-foreground ring-2 ring-ring'
                        : 'bg-surface-container text-muted-foreground'
                    }`}
                  >
                    <Icon size={14} />
                    {acc.name}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

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
        disabled={pending || !canSubmit}
        className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition-all active:scale-95 disabled:opacity-50"
      >
        {pending ? 'Wird erstellt...' : 'Erstellen'}
      </button>
    </form>
  )
}
