'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { AccountCard } from './AccountCard'
import { AddPortfolioAccountForm } from './AddPortfolioAccountForm'
import { MonthlySnapshotRow } from './MonthlySnapshotRow'
import { EditMonthlySnapshotForm } from './EditMonthlySnapshotForm'
import { formatCurrencyWithSymbol } from '@/lib/utils/formatCurrency'
import type { PortfolioAccount } from '@/lib/types/database'
import type { MonthlyBalance } from '@/lib/supabase/portfolio'

interface PortfolioViewProps {
  accounts: PortfolioAccount[]
  monthlyBalances: MonthlyBalance[]
  currentYear: number
  currentMonth: number
}

type Sheet =
  | { kind: 'none' }
  | { kind: 'account-new' }
  | { kind: 'account-edit'; account: PortfolioAccount }
  | { kind: 'month-edit'; balance: MonthlyBalance }

export function PortfolioView({
  accounts,
  monthlyBalances,
  currentYear,
  currentMonth,
}: PortfolioViewProps) {
  const [sheet, setSheet] = useState<Sheet>({ kind: 'none' })

  const close = () => setSheet({ kind: 'none' })

  const accountsSum = accounts.reduce((acc, a) => acc + a.current_amount, 0)
  const monthlySum = monthlyBalances.reduce((acc, m) => acc + m.amount, 0)

  return (
    <div className="space-y-8 pb-24 pt-6">
      {/* Konten */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">Konten</h2>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground tabular-nums">
            {formatCurrencyWithSymbol(accountsSum)}
          </p>
        </div>

        {accounts.length === 0 ? (
          <p className="rounded-xl bg-surface-container-low p-8 text-center text-sm text-muted-foreground">
            Noch keine Konten angelegt. Tippe auf <span className="font-bold">+</span>, um dein erstes Konto hinzuzufügen.
          </p>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onClick={() => setSheet({ kind: 'account-edit', account })}
              />
            ))}
          </div>
        )}
      </section>

      {/* Monatssalden */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">Monatssalden</h2>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground tabular-nums">
            {formatCurrencyWithSymbol(monthlySum)}
          </p>
        </div>

        {monthlyBalances.length === 0 ? (
          <p className="rounded-xl bg-surface-container-low p-8 text-center text-sm text-muted-foreground">
            Noch keine Transaktionen erfasst.
          </p>
        ) : (
          <div className="space-y-3">
            {monthlyBalances.map((mb) => (
              <MonthlySnapshotRow
                key={`${mb.year}-${mb.month}`}
                year={mb.year}
                month={mb.month}
                amount={mb.amount}
                frozen={mb.frozen}
                isCurrentMonth={mb.year === currentYear && mb.month === currentMonth}
                onClick={() => setSheet({ kind: 'month-edit', balance: mb })}
              />
            ))}
          </div>
        )}
      </section>

      {/* FAB */}
      <button
        onClick={() => setSheet({ kind: 'account-new' })}
        aria-label="Konto hinzufügen"
        className="fixed bottom-28 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-primary-foreground shadow-lg transition-all active:scale-90"
      >
        <Plus size={24} />
      </button>

      <BottomSheet open={sheet.kind !== 'none'} onClose={close}>
        {sheet.kind === 'account-new' && (
          <AddPortfolioAccountForm onDone={close} />
        )}
        {sheet.kind === 'account-edit' && (
          <AddPortfolioAccountForm account={sheet.account} onDone={close} />
        )}
        {sheet.kind === 'month-edit' && (
          <EditMonthlySnapshotForm
            year={sheet.balance.year}
            month={sheet.balance.month}
            liveAmount={sheet.balance.liveAmount}
            customAmount={sheet.balance.customAmount}
            onDone={close}
          />
        )}
      </BottomSheet>
    </div>
  )
}
