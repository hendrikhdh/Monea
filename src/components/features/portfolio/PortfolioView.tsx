'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { AccountCard } from './AccountCard'
import { AddPortfolioAccountForm } from './AddPortfolioAccountForm'
import { MonthlySnapshotRow } from './MonthlySnapshotRow'
import { formatCurrencyWithSymbol } from '@/lib/utils/formatCurrency'
import { EmptyState } from '@/components/ui/empty-state'
import { Wallet, CalendarRange } from 'lucide-react'
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

export function PortfolioView({
  accounts,
  monthlyBalances,
  currentYear,
  currentMonth,
}: PortfolioViewProps) {
  const [sheet, setSheet] = useState<Sheet>({ kind: 'none' })

  const close = () => setSheet({ kind: 'none' })

  const accountsSum = accounts.reduce((acc, a) => acc + a.current_amount, 0)
  const monthlySum = monthlyBalances.reduce((acc, m) => acc + m.liveAmount, 0)

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
          <EmptyState
            icon={Wallet}
            title="Noch keine Konten angelegt"
            description="Erfasse Sparkonten, Brokerage oder Cash, um deinen Gesamtsaldo zu vervollständigen."
            cta={{ label: 'Konto hinzufügen', onClick: () => setSheet({ kind: 'account-new' }) }}
          />
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

      {/* Monatlicher Cashflow — read-only history (already part of the Girokonto balance) */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">Cashflow</h2>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground tabular-nums">
            {formatCurrencyWithSymbol(monthlySum)}
          </p>
        </div>
        <p className="-mt-2 text-xs text-on-surface-variant">
          Einnahmen − Ausgaben je Monat · bereits im Girokonto enthalten.
        </p>

        {monthlyBalances.length === 0 ? (
          <EmptyState
            icon={CalendarRange}
            title="Noch keine Transaktionen erfasst"
            description="Sobald du Einnahmen oder Ausgaben erfasst, siehst du hier deinen monatlichen Cashflow."
          />
        ) : (
          <div className="space-y-3">
            {monthlyBalances.map((mb) => (
              <MonthlySnapshotRow
                key={`${mb.year}-${mb.month}`}
                year={mb.year}
                month={mb.month}
                amount={mb.liveAmount}
                isCurrentMonth={mb.year === currentYear && mb.month === currentMonth}
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
      </BottomSheet>
    </div>
  )
}
