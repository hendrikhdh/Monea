'use client'

import { PORTFOLIO_ICON_MAP } from '@/components/features/portfolio/portfolioIcons'
import { cn } from '@/lib/utils'
import type { AccountRef } from '@/lib/types/database'

interface AccountPickerProps {
  accounts: AccountRef[]
  selected: string | null
  onSelect: (id: string) => void
  /** Hide one account (used for the opposite leg of a transfer). */
  exclude?: string | null
  emptyHint?: string
}

export function AccountPicker({ accounts, selected, onSelect, exclude, emptyHint }: AccountPickerProps) {
  const visible = exclude ? accounts.filter((a) => a.id !== exclude) : accounts

  if (visible.length === 0) {
    return (
      <div className="w-full px-6 text-center">
        <p className="text-xs text-muted-foreground">
          {emptyHint ?? 'Kein Konto verfügbar.'}
        </p>
      </div>
    )
  }

  return (
    <div
      className="flex gap-3 overflow-x-auto px-6 pt-2 pb-2 no-scrollbar snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0 lg:snap-none"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {visible.map((account) => {
        const isActive = selected === account.id
        const Icon = PORTFOLIO_ICON_MAP[account.icon] ?? PORTFOLIO_ICON_MAP.Wallet
        return (
          <button
            key={account.id}
            type="button"
            onClick={() => onSelect(account.id)}
            className="flex shrink-0 snap-center flex-col items-center gap-2 lg:shrink"
          >
            <div
              className={cn(
                'flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 active:scale-90',
                isActive
                  ? 'shadow-[0_10px_20px_rgba(111,90,82,0.18)] ring-2 ring-foreground ring-offset-2 ring-offset-background'
                  : 'shadow-sm'
              )}
              style={{ backgroundColor: `${account.color}20` }}
            >
              <Icon size={20} style={{ color: account.color }} />
            </div>
            <span
              className={cn(
                'w-16 truncate text-center text-[10px] font-semibold uppercase tracking-widest',
                isActive ? 'font-bold text-foreground' : 'text-on-secondary-container'
              )}
            >
              {account.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
