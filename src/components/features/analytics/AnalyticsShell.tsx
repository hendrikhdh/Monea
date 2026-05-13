'use client'

import { useEffect, useMemo, useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/animated-section'
import { EmptyState } from '@/components/ui/empty-state'
import { AnalyticsFilters } from './AnalyticsFilters'
import { SpendingDonut } from './SpendingDonut'
import { TrendChart } from './TrendChart'
import { TopCategories } from './TopCategories'
import type {
  AnalyticsPeriod,
  AnalyticsType,
  SpendingByCategory,
  TrendPoint,
} from '@/lib/supabase/analytics'

const PERIOD_LABELS: Record<AnalyticsPeriod, string> = {
  month: 'Diesen Monat',
  '3m': 'Letzte 3 Monate',
  '6m': 'Letzte 6 Monate',
  '1y': 'Letztes Jahr',
}

interface AnalyticsShellProps {
  initialPeriod: AnalyticsPeriod
  initialType: AnalyticsType
  initialSpending: SpendingByCategory[]
  initialTrend: TrendPoint[]
}

export function AnalyticsShell({
  initialPeriod,
  initialType,
  initialSpending,
  initialTrend,
}: AnalyticsShellProps) {
  const [period, setPeriod] = useState<AnalyticsPeriod>(initialPeriod)
  const [type, setType] = useState<AnalyticsType>(initialType)
  const [spending, setSpending] = useState(initialSpending)
  const [trend, setTrend] = useState(initialTrend)
  const [excluded, setExcluded] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (period === initialPeriod && type === initialType) return

    let cancelled = false
    const controller = new AbortController()
    setLoading(true)
    fetch(`/api/analytics?period=${period}&type=${type}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (cancelled) return
        setSpending(data.spending)
        setTrend(data.trend)
      })
      .catch(() => {
        // Network/abort errors are fine — leave previous data shown
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [period, type, initialPeriod, initialType])

  const filteredSpending = useMemo(
    () => spending.filter((s) => !excluded.has(s.id)),
    [spending, excluded]
  )

  const trendHasData = trend.some((t) => t.income > 0 || t.expenses > 0)
  const isEmpty = filteredSpending.length === 0 && !trendHasData

  const handleCategoryToggle = (id: string) => {
    setExcluded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-6">
      <AnimatedSection delay={0}>
        <h2 className="font-heading text-2xl font-bold">Analyse</h2>
        <p className="text-sm text-muted-foreground">{PERIOD_LABELS[period]}</p>
      </AnimatedSection>

      <AnimatedSection delay={0.03}>
        <AnalyticsFilters
          period={period}
          type={type}
          spending={spending}
          excludedCategoryIds={excluded}
          onPeriodChange={setPeriod}
          onTypeChange={setType}
          onCategoryToggle={handleCategoryToggle}
        />
      </AnimatedSection>

      {isEmpty ? (
        <AnimatedSection delay={0.05}>
          <EmptyState
            icon={BarChart3}
            title="Noch keine Daten zum Auswerten"
            description="Erfasse Transaktionen, dann zeigen wir dir hier Spendings nach Kategorie, Trends und deine Top-Posten."
            cta={{ label: 'Transaktion erfassen', href: '/transactions' }}
            variant="feature"
          />
        </AnimatedSection>
      ) : (
        <div
          className={`space-y-6 transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}
        >
          {/* Spending by category donut */}
          <AnimatedSection delay={0.05}>
            <div className="rounded-[2rem_1rem_2.5rem_1.5rem] bg-surface-container p-6">
              <h3 className="mb-4 text-sm font-semibold text-on-surface-variant">
                {type === 'expense' ? 'Ausgaben' : 'Einnahmen'} nach Kategorie
              </h3>
              <SpendingDonut data={filteredSpending} />
            </div>
          </AnimatedSection>

          {/* Monthly trend */}
          <AnimatedSection delay={0.1}>
            <div className="rounded-[2rem_1rem_2.5rem_1.5rem] bg-surface-container p-6">
              <h3 className="mb-4 text-sm font-semibold text-on-surface-variant">
                Trend
              </h3>
              <TrendChart data={trend} />
            </div>
          </AnimatedSection>

          {/* Top categories */}
          <AnimatedSection delay={0.15}>
            <div className="rounded-[2rem_1rem_2.5rem_1.5rem] bg-surface-container p-6">
              <h3 className="mb-4 text-sm font-semibold text-on-surface-variant">
                Top {type === 'expense' ? 'Ausgaben' : 'Einnahmen'}
              </h3>
              <TopCategories data={filteredSpending} />
            </div>
          </AnimatedSection>
        </div>
      )}
    </div>
  )
}
