'use client'

import { useActionState, useState, useEffect } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { saveCustomMonthAction, unfreezeMonthAction } from '@/app/(app)/portfolio/actions'
import { formatCurrencyWithSymbol } from '@/lib/utils/formatCurrency'

const MONTH_NAMES = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]

interface EditMonthlySnapshotFormProps {
  year: number
  month: number
  liveAmount: number
  customAmount: number | null
  onDone?: () => void
}

export function EditMonthlySnapshotForm({
  year,
  month,
  liveAmount,
  customAmount,
  onDone,
}: EditMonthlySnapshotFormProps) {
  const isCustom = customAmount !== null
  const initial = isCustom ? customAmount : liveAmount

  const [amount, setAmount] = useState(initial.toFixed(2))

  useEffect(() => {
    setAmount((customAmount !== null ? customAmount : liveAmount).toFixed(2))
  }, [year, month, customAmount, liveAmount])

  const [, saveAction, savePending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await saveCustomMonthAction(formData)
      if (result?.error) toast.error(result.error)
      else { toast.success('Monatssaldo angepasst.'); onDone?.() }
      return result
    },
    null
  )

  const [, resetAction, resetPending] = useActionState(
    async () => {
      const formData = new FormData()
      formData.set('year', String(year))
      formData.set('month', String(month))
      const result = await unfreezeMonthAction(formData)
      if (result?.error) toast.error(result.error)
      else { toast.success('Auf Auto-Wert zurückgesetzt.'); onDone?.() }
      return result
    },
    null
  )

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center font-heading text-lg font-bold">
        {MONTH_NAMES[month - 1]} {year}
      </h3>

      <div className="rounded-xl bg-surface-container-low p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Auto-berechnet aus Transaktionen
        </p>
        <p className="mt-1 font-display text-base font-semibold tabular-nums text-foreground">
          {liveAmount >= 0 ? '+' : ''}{formatCurrencyWithSymbol(liveAmount)}
        </p>
      </div>

      <form action={saveAction} className="flex flex-col gap-4">
        <input type="hidden" name="year" value={year} />
        <input type="hidden" name="month" value={month} />

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Eigener Wert
          </label>
          <div className="relative">
            <input
              name="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="0,00"
              className="h-14 w-full rounded-2xl border border-input bg-transparent pl-5 pr-12 text-right text-base font-medium tabular-nums placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
              required
              disabled={savePending}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={savePending || !amount.trim()}
          className="flex h-14 items-center justify-center gap-3 rounded-full bg-primary-container font-heading text-lg font-bold tracking-wide text-primary-foreground shadow-[0_15px_30px_rgba(62,39,35,0.2)] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
        >
          <span>{savePending ? 'Speichern…' : 'Speichern'}</span>
          {!savePending && <Check size={20} />}
        </button>
      </form>

      {isCustom && (
        <button
          type="button"
          disabled={resetPending}
          onClick={() => resetAction()}
          className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-input text-sm font-semibold text-on-surface-variant transition-all active:scale-95 disabled:opacity-40"
        >
          <RotateCcw size={16} />
          <span>{resetPending ? 'Zurücksetzen…' : 'Auf Auto-Wert zurücksetzen'}</span>
        </button>
      )}
    </div>
  )
}
