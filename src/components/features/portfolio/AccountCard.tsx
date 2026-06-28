'use client'

import type { PointerEvent } from 'react'
import { GripVertical } from 'lucide-react'
import { PORTFOLIO_ICON_MAP } from './portfolioIcons'
import { ACCOUNT_TYPE_LABELS } from '@/lib/portfolio/constants'
import { formatCurrencyWithSymbol } from '@/lib/utils/formatCurrency'
import type { PortfolioAccount } from '@/lib/types/database'

interface AccountCardProps {
  account: PortfolioAccount
  onClick?: () => void
  /** When set, a drag handle is shown that starts the reorder gesture. */
  onHandlePointerDown?: (e: PointerEvent) => void
}

export function AccountCard({ account, onClick, onHandlePointerDown }: AccountCardProps) {
  const Icon = PORTFOLIO_ICON_MAP[account.icon] ?? PORTFOLIO_ICON_MAP.Wallet

  return (
    <div className="flex items-center rounded-xl bg-surface-container-low transition-all">
      <button
        type="button"
        onClick={onClick}
        className="flex min-w-0 flex-1 items-center gap-4 rounded-xl p-4 text-left transition-all active:scale-[0.99]"
      >
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${account.color}20` }}
        >
          <Icon size={20} style={{ color: account.color }} />
        </div>

        <div className="min-w-0 flex-1">
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

      {onHandlePointerDown && (
        <button
          type="button"
          aria-label="Verschieben"
          onPointerDown={onHandlePointerDown}
          onClick={(e) => e.stopPropagation()}
          className="flex h-12 shrink-0 cursor-grab touch-none items-center px-3 text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical size={18} />
        </button>
      )}
    </div>
  )
}
