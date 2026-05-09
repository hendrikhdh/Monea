import Link from 'next/link'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface IncomeExpenseCardsProps {
  income: number
  expenses: number
}

export function IncomeExpenseCards({ income, expenses }: IncomeExpenseCardsProps) {
  const format = (value: number) =>
    new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(value)

  return (
    <section className="grid grid-cols-2 gap-4">
      <Link
        href="/transactions?filter=income"
        className="flex flex-col items-center justify-center rounded-xl bg-surface-container-low p-6 text-center transition-all active:scale-[0.97]"
      >
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50">
          <TrendingUp size={20} className="text-secondary-foreground" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Einnahmen
        </p>
        <p className="mt-1 font-display text-xl text-foreground">
          +{format(income)}
        </p>
      </Link>

      <Link
        href="/transactions?filter=expense"
        className="flex flex-col items-center justify-center rounded-xl bg-surface-container-low p-6 text-center transition-all active:scale-[0.97]"
      >
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
          <TrendingDown size={20} className="text-destructive" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Ausgaben
        </p>
        <p className="mt-1 font-display text-xl text-foreground">
          -{format(expenses)}
        </p>
      </Link>
    </section>
  )
}
