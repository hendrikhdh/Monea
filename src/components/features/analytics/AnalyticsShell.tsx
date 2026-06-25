'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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

interface AnalyticsData {
  expense: SpendingByCategory[]
  income: SpendingByCategory[]
  trend: TrendPoint[]
}

export function AnalyticsShell({
  initialPeriod,
  initialType,
  initialSpending,
  initialTrend,
}: AnalyticsShellProps) {
  const [period, setPeriod] = useState<AnalyticsPeriod>(initialPeriod)
  const [type, setType] = useState<AnalyticsType>(initialType)
  const [data, setData] = useState<AnalyticsData>(() => ({
    expense: initialType === 'expense' ? initialSpending : [],
    income: initialType === 'income' ? initialSpending : [],
    trend: initialTrend,
  }))
  const [excluded, setExcluded] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const didMount = useRef(false)

  useEffect(() => {
    const isFirstRender = !didMount.current
    didMount.current = true

    const controller = new AbortController()

    if (isFirstRender) {
      // Background prefetch of the inactive type — no loading indicator needed
      const otherType: AnalyticsType = initialType === 'expense' ? 'income' : 'expense'
      fetch(`/api/analytics?period=${period}&type=${otherType}`, { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : Promise.reject(r)))
        .then((d) => {
          setData((prev) => ({ ...prev, [otherType]: d.spending }))
        })
        .catch(() => {})

      return () => controller.abort()
    }

    Promise.all([
      fetch(`/api/analytics?period=${period}&type=expense`, { signal: controller.signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(r)
      ),
      fetch(`/api/analytics?period=${period}&type=income`, { signal: controller.signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(r)
      ),
    ])
      .then(([exp, inc]) => {
        setData({ expense: exp.spending, income: inc.spending, trend: exp.trend })
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [period, initialType])

  // Loading is set here (event handler) rather than in the effect to avoid a
  // synchronous setState during the effect body. The effect clears it in `finally`.
  const handlePeriodChange = (next: AnalyticsPeriod) => {
    if (next === period) return
    setLoading(true)
    setPeriod(next)
  }

  const activeSpending = type === 'expense' ? data.expense : data.income

  const filteredActive = useMemo(
    () => activeSpending.filter((s) => !excluded.has(s.id)),
    [activeSpending, excluded]
  )
  const filteredExpense = useMemo(
    () => data.expense.filter((s) => !excluded.has(s.id)),
    [data.expense, excluded]
  )
  const filteredIncome = useMemo(
    () => data.income.filter((s) => !excluded.has(s.id)),
    [data.income, excluded]
  )

  const trendHasData = data.trend.some((t) => t.income > 0 || t.expenses > 0)
  const isEmpty =
    filteredExpense.length === 0 && filteredIncome.length === 0 && !trendHasData

  const handleCategoryToggle = (id: string) => {
    setExcluded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-6 lg:max-w-[1400px] lg:px-10">
      <AnimatedSection delay={0}>
        <h2 className="font-heading text-2xl font-bold">Analyse</h2>
        <p className="text-sm text-muted-foreground">{PERIOD_LABELS[period]}</p>
      </AnimatedSection>

      <AnimatedSection delay={0.03}>
        <AnalyticsFilters
          period={period}
          type={type}
          spending={activeSpending}
          excludedCategoryIds={excluded}
          onPeriodChange={handlePeriodChange}
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
          className={`transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}
        >
          {/* Mobile: active-type only */}
          <div className="space-y-6 lg:hidden">
            <AnimatedSection delay={0.05}>
              <div className="rounded-[2rem_1rem_2.5rem_1.5rem] bg-surface-container p-6">
                <h3 className="mb-4 text-sm font-semibold text-on-surface-variant">
                  {type === 'expense' ? 'Ausgaben' : 'Einnahmen'} nach Kategorie
                </h3>
                <SpendingDonut data={filteredActive} />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="rounded-[2rem_1rem_2.5rem_1.5rem] bg-surface-container p-6">
                <h3 className="mb-4 text-sm font-semibold text-on-surface-variant">
                  Trend
                </h3>
                <TrendChart data={data.trend} />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="rounded-[2rem_1rem_2.5rem_1.5rem] bg-surface-container p-6">
                <h3 className="mb-4 text-sm font-semibold text-on-surface-variant">
                  Top {type === 'expense' ? 'Ausgaben' : 'Einnahmen'}
                </h3>
                <TopCategories data={filteredActive} />
              </div>
            </AnimatedSection>
          </div>

          {/* Desktop: two columns side-by-side + full-width trend below */}
          <div className="hidden space-y-6 lg:block">
            <div className="grid grid-cols-2 gap-6">
              {(
                [
                  { kind: 'expense', label: 'Ausgaben', data: filteredExpense, delay: 0.05 },
                  { kind: 'income', label: 'Einnahmen', data: filteredIncome, delay: 0.08 },
                ] as const
              ).map((col) => (
                <AnimatedSection key={col.kind} delay={col.delay}>
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      {col.label}
                    </p>
                    <div className="rounded-[2rem_1rem_2.5rem_1.5rem] bg-surface-container p-6">
                      <h3 className="mb-4 text-sm font-semibold text-on-surface-variant">
                        {col.label} nach Kategorie
                      </h3>
                      <SpendingDonut data={col.data} />
                    </div>
                    <div className="rounded-[2rem_1rem_2.5rem_1.5rem] bg-surface-container p-6">
                      <h3 className="mb-4 text-sm font-semibold text-on-surface-variant">
                        Top {col.label}
                      </h3>
                      <TopCategories data={col.data} />
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.12}>
              <div className="rounded-[2rem_1rem_2.5rem_1.5rem] bg-surface-container p-6">
                <h3 className="mb-4 text-sm font-semibold text-on-surface-variant">
                  Trend
                </h3>
                <TrendChart data={data.trend} />
              </div>
            </AnimatedSection>
          </div>
        </div>
      )}
    </div>
  )
}
