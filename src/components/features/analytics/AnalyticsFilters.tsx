'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import type { AnalyticsPeriod, AnalyticsType, SpendingByCategory } from '@/lib/supabase/analytics'
import { ICON_MAP } from '@/components/features/categories/iconMap'
import { cn } from '@/lib/utils'

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: 'month', label: 'Diesen Monat' },
  { value: '3m', label: '3 Monate' },
  { value: '6m', label: '6 Monate' },
  { value: '1y', label: '1 Jahr' },
]

interface AnalyticsFiltersProps {
  period: AnalyticsPeriod
  type: AnalyticsType
  spending: SpendingByCategory[]
  excludedCategoryIds: Set<string>
  onPeriodChange: (period: AnalyticsPeriod) => void
  onTypeChange: (type: AnalyticsType) => void
  onCategoryToggle: (id: string) => void
}

export function AnalyticsFilters({
  period,
  type,
  spending,
  excludedCategoryIds,
  onPeriodChange,
  onTypeChange,
  onCategoryToggle,
}: AnalyticsFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Period chips */}
      <div className="-mx-6 overflow-x-auto px-6 lg:mx-0 lg:overflow-visible lg:px-0">
        <div className="flex gap-2 lg:flex-wrap">
          {PERIODS.map(({ value, label }) => {
            const isActive = period === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => onPeriodChange(value)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95',
                  isActive
                    ? 'bg-primary-container text-primary-foreground'
                    : 'bg-surface-container-low text-muted-foreground'
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Type toggle (mobile only — desktop shows both side-by-side) */}
      <div className="flex gap-2 rounded-full bg-surface-container-low p-1 lg:hidden">
        {(['expense', 'income'] as const).map((t) => {
          const isActive = type === t
          const Icon = t === 'expense' ? TrendingDown : TrendingUp
          return (
            <button
              key={t}
              type="button"
              onClick={() => onTypeChange(t)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold transition-all active:scale-95',
                isActive
                  ? 'bg-primary-container text-primary-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <Icon size={16} />
              <span>{t === 'expense' ? 'Ausgaben' : 'Einnahmen'}</span>
            </button>
          )
        })}
      </div>

      {/* Category multi-select chips */}
      {spending.length > 0 && (
        <div className="-mx-6 overflow-x-auto px-6 lg:mx-0 lg:overflow-visible lg:px-0">
          <div className="flex gap-2 lg:flex-wrap">
            {spending.map((cat) => {
              const Icon = ICON_MAP[cat.icon]
              const isExcluded = excludedCategoryIds.has(cat.id)
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryToggle(cat.id)}
                  aria-pressed={!isExcluded}
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all active:scale-95',
                    isExcluded
                      ? 'bg-surface-container-low text-muted-foreground line-through opacity-60'
                      : 'bg-surface-container text-foreground'
                  )}
                  style={{
                    boxShadow: isExcluded ? undefined : `inset 0 0 0 1.5px ${cat.color}40`,
                  }}
                >
                  {Icon && (
                    <Icon size={12} style={{ color: isExcluded ? undefined : cat.color }} />
                  )}
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
