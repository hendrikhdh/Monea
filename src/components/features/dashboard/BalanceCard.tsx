import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { formatCurrencyWithSymbol } from '@/lib/utils/formatCurrency'

interface BalanceCardProps {
  balance: number
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <Link
      href="/portfolio"
      className="group flex items-center justify-between rounded-[2rem_1rem_2.5rem_1.5rem] bg-surface-container px-6 py-5 transition-all active:scale-[0.98]"
    >
      <div>
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
          Gesamtsaldo
        </p>
        <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
          {formatCurrencyWithSymbol(balance)}
        </p>
      </div>
      <ChevronRight
        size={20}
        className="text-muted-foreground transition-transform group-active:translate-x-0.5"
      />
    </Link>
  )
}
