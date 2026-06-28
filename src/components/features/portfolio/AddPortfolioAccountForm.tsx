'use client'

import { useActionState, useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { addAccount, editAccount, removeAccount } from '@/app/(app)/portfolio/actions'
import { PORTFOLIO_ICON_MAP, PORTFOLIO_ICON_NAMES } from './portfolioIcons'
import { ACCOUNT_TYPE_LABELS } from '@/lib/portfolio/constants'
import type { PortfolioAccount, PortfolioAccountType } from '@/lib/types/database'
import { cn } from '@/lib/utils'

const PRESET_COLORS = [
  '#56423b', '#6f5a52', '#e3beb8', '#34a853',
  '#4285f4', '#f4b400', '#9c27b0', '#271310',
]

const TYPE_ORDER: PortfolioAccountType[] = ['savings', 'brokerage', 'cash', 'other']

interface AddPortfolioAccountFormProps {
  account?: PortfolioAccount | null
  onDone?: () => void
}

export function AddPortfolioAccountForm({ account, onDone }: AddPortfolioAccountFormProps) {
  const isEdit = !!account
  const isPrimary = !!account?.is_primary

  const [name, setName] = useState(account?.name ?? '')
  const [amount, setAmount] = useState(
    account ? String(account.initial_amount) : ''
  )
  const [selectedType, setSelectedType] = useState<PortfolioAccountType>(account?.type ?? 'savings')
  const [selectedIcon, setSelectedIcon] = useState(account?.icon ?? 'Wallet')
  const [selectedColor, setSelectedColor] = useState(account?.color ?? PRESET_COLORS[0])
  const [showIcons, setShowIcons] = useState(false)

  // Re-sync local state when the edited account changes (sheet reused across opens)
  const [prevAccount, setPrevAccount] = useState(account)
  if (account !== prevAccount) {
    setPrevAccount(account)
    if (account) {
      setName(account.name)
      setAmount(String(account.initial_amount))
      setSelectedType(account.type)
      setSelectedIcon(account.icon)
      setSelectedColor(account.color)
    } else {
      setName('')
      setAmount('')
      setSelectedType('savings')
      setSelectedIcon('Wallet')
      setSelectedColor(PRESET_COLORS[0])
    }
  }

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      if (isEdit) {
        formData.set('id', account.id)
        const result = await editAccount(formData)
        if (result?.error) toast.error(result.error)
        else { toast.success('Konto aktualisiert!'); onDone?.() }
        return result
      }
      const result = await addAccount(formData)
      if (result?.error) toast.error(result.error)
      else { toast.success('Konto erstellt!'); onDone?.() }
      return result
    },
    undefined
  )

  const [, deleteAction, deletePending] = useActionState(
    async () => {
      if (!account) return
      const formData = new FormData()
      formData.set('id', account.id)
      const result = await removeAccount(formData)
      if (result?.error) toast.error(result.error)
      else { toast.success('Konto gelöscht.'); onDone?.() }
      return result
    },
    undefined
  )

  const SelectedIconComponent = PORTFOLIO_ICON_MAP[selectedIcon]

  return (
    <form action={action} className="flex flex-col items-center gap-4">
      <h3 className="font-heading text-lg font-bold">
        {isEdit ? 'Konto bearbeiten' : 'Neues Konto'}
      </h3>

      {/* Type toggle — locked to "Girokonto" for the primary account */}
      {isPrimary ? (
        <div className="rounded-full bg-surface-container-low px-4 py-2 text-xs font-semibold text-muted-foreground">
          Girokonto · Hauptkonto
        </div>
      ) : (
        <div className="flex gap-2 rounded-full bg-surface-container-low p-1">
          {TYPE_ORDER.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedType(t)}
              className={cn(
                'rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95',
                selectedType === t
                  ? 'bg-primary-container text-primary-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {ACCOUNT_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      )}
      <input type="hidden" name="type" value={isPrimary ? 'checking' : selectedType} />

      {/* Icon preview */}
      <button
        type="button"
        onClick={() => setShowIcons(!showIcons)}
        className="flex h-20 w-20 items-center justify-center rounded-[2rem] transition-all active:scale-95"
        style={{ backgroundColor: `${selectedColor}25` }}
      >
        {SelectedIconComponent && (
          <SelectedIconComponent size={32} style={{ color: selectedColor }} />
        )}
      </button>
      <input type="hidden" name="icon" value={selectedIcon} />

      {showIcons && (
        <div className="grid w-full grid-cols-8 gap-2 rounded-3xl bg-surface-container-low p-3">
          {PORTFOLIO_ICON_NAMES.map((iconName) => {
            const Icon = PORTFOLIO_ICON_MAP[iconName]
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => { setSelectedIcon(iconName); setShowIcons(false) }}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-90',
                  selectedIcon === iconName
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Icon size={18} />
              </button>
            )
          })}
        </div>
      )}

      {/* Color picker */}
      <div className="flex gap-3">
        <input type="hidden" name="color" value={selectedColor} />
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setSelectedColor(color)}
            className={cn(
              'h-9 w-9 rounded-full transition-all active:scale-90',
              selectedColor === color
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110'
                : ''
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Name input */}
      <input
        name="name"
        placeholder="Konto-Name (z.B. Tagesgeld)"
        className="h-14 w-full rounded-2xl border border-input bg-transparent px-5 text-center text-base font-medium placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
        required
        disabled={pending}
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={80}
      />

      {/* Start balance input — the current balance is derived from transactions */}
      <div className="w-full space-y-1.5">
        <div className="relative w-full">
          <input
            name="initial_amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder="Startsaldo"
            className="h-14 w-full rounded-2xl border border-input bg-transparent pl-5 pr-12 text-right text-base font-medium tabular-nums placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
            required
            disabled={pending}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
        </div>
        <p className="px-1 text-center text-[11px] text-muted-foreground">
          Startsaldo — Buchungen aktualisieren den Kontostand automatisch.
        </p>
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      {/* Action buttons */}
      <div className="flex w-full gap-3">
        {isEdit && !isPrimary && (
          <button
            type="button"
            disabled={deletePending}
            onClick={() => deleteAction()}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-destructive/20 text-destructive transition-all active:scale-95 disabled:opacity-40"
          >
            <Trash2 size={20} />
          </button>
        )}
        <button
          type="submit"
          disabled={pending || !name.trim() || !amount.trim()}
          className="flex h-14 flex-1 items-center justify-center gap-3 rounded-full bg-primary-container font-heading text-lg font-bold tracking-wide text-primary-foreground shadow-[0_15px_30px_rgba(62,39,35,0.2)] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
        >
          <span>{pending ? 'Speichern…' : isEdit ? 'Aktualisieren' : 'Speichern'}</span>
          {!pending && <Check size={20} />}
        </button>
      </div>
    </form>
  )
}
