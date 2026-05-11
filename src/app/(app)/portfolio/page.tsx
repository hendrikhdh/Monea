import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import {
  getAccounts,
  getMonthlyBalances,
  computeTotalPortfolio,
} from '@/lib/supabase/portfolio'
import { PortfolioView } from '@/components/features/portfolio/PortfolioView'
import { formatCurrencyWithSymbol } from '@/lib/utils/formatCurrency'

export default async function PortfolioPage() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const [accounts, monthlyBalances, totalBalance] = await Promise.all([
    getAccounts(),
    getMonthlyBalances(),
    computeTotalPortfolio(),
  ])

  return (
    <div className="mx-auto w-full max-w-2xl px-6">
      {/* Sticky header: Back + Title + Gesamtsaldo */}
      <div className="sticky top-20 z-30 -mx-6 -mt-4 space-y-3 bg-background/70 px-6 pb-3 pt-7 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container transition-all active:scale-90"
            aria-label="Zurück"
          >
            <ChevronLeft size={20} className="text-foreground" />
          </Link>
          <h1 className="font-heading text-2xl font-bold text-foreground">Portfolio</h1>
        </div>

        <section className="rounded-2xl bg-surface-container px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              Gesamtsaldo
            </p>
            <p className="font-display text-2xl font-semibold text-foreground tabular-nums">
              {formatCurrencyWithSymbol(totalBalance)}
            </p>
          </div>
        </section>
      </div>

      <PortfolioView
        accounts={accounts}
        monthlyBalances={monthlyBalances}
        currentYear={currentYear}
        currentMonth={currentMonth}
      />
    </div>
  )
}
