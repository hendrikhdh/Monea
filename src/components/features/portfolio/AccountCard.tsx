'use client'

import { PORTFOLIO_ICON_MAP } from './portfolioIcons'
import { ACCOUNT_TYPE_LABELS } from '@/lib/portfolio/constants'
import { formatCurrencyWithSymbol } from '@/lib/utils/formatCurrency'
import type { PortfolioAccount } from '@/lib/types/database'

interface AccountCardProps {
  account: PortfolioAccount
  onClick?: () => void
}

export function AccountCard({ account, onClick }: AccountCardProps) {
  const Icon = PORTFOLIO_ICON_MAP[account.icon] ?? PORTFOLIO_ICON_MAP.Wallet

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl bg-surface-container-low p-4 text-left transition-all active:scale-[0.98]"
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${account.color}20` }}
      >
        <Icon size={20} style={{ color: account.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-base font-semibold text-foreground">{account.name}</p>
          {account.is_primary && (
            <span className="shrink-0 rounded-full bg-primary-container/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary-foreground">
              Haupt
            </span>
          )}
        </div>
        <p className="text-xs text-on-surface-variant">
          {ACCOUNT_TYPE_LABELS[account.type]}
        </p>
      </div>

      <p className="font-display text-lg font-semibold text-foreground tabular-nums">
        {formatCurrencyWithSymbol(account.current_amount)}
      </p>
    </button>
  )
}
