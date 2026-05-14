import type { TransactionType } from '@/lib/types/database'

interface AmountDisplayProps {
  cents: number
  type: TransactionType
}

const LABEL: Record<TransactionType, string> = {
  income: 'Einnahme',
  expense: 'Ausgabe',
  savings_deposit: 'Spareinlage',
}

export function AmountDisplay({ cents, type }: AmountDisplayProps) {
  const euros = Math.floor(cents / 100)
  const centsPart = cents % 100
  const wholeFormatted = euros.toLocaleString('de-DE')
  const display = `${wholeFormatted},${String(centsPart).padStart(2, '0')}`

  return (
    <div className="relative flex w-full justify-center">
      <div className="relative z-10 flex h-28 w-48 flex-col items-center justify-center rounded-[60%_40%_70%_30%/40%_50%_60%_40%] bg-secondary text-center shadow-[0_20px_50px_rgba(111,90,82,0.1)]">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-container">
          {LABEL[type]}
        </span>
        <div className="font-heading text-3xl font-extrabold tracking-tighter text-foreground">
          € {display}
        </div>
      </div>
      {/* Decorative blobs */}
      <div className="absolute -top-1 -right-1 -z-0 h-16 w-16 rounded-[30%_70%_40%_60%/50%_30%_70%_50%] bg-surface-container-high opacity-40" />
      <div className="absolute -bottom-2 -left-2 -z-0 h-10 w-10 rounded-[60%_40%_70%_30%/40%_50%_60%_40%] bg-primary-container opacity-10" />
    </div>
  )
}
