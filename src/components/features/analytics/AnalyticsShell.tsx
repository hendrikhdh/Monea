'use client'

import { AnimatedSection } from '@/components/ui/animated-section'
import { SpendingDonut } from './SpendingDonut'
import { TrendChart } from './TrendChart'
import { TopCategories } from './TopCategories'

interface AnalyticsShellProps {
  monthLabel: string
  spending: { name: string; color: string; icon: string; total: number }[]
  trend: { month: string; income: number; expenses: number }[]
}

export function AnalyticsShell({ monthLabel, spending, trend }: AnalyticsShellProps) {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-6">
      <AnimatedSection delay={0}>
        <h2 className="font-heading text-2xl font-bold">Analyse</h2>
        <p className="text-sm text-muted-foreground">{monthLabel}</p>
      </AnimatedSection>

      {/* Spending by category donut */}
      <AnimatedSection delay={0.05}>
        <div className="rounded-xl bg-surface-container p-6">
          <h3 className="mb-4 text-sm font-semibold text-on-surface-variant">
            Ausgaben nach Kategorie
          </h3>
          <SpendingDonut data={spending} />
        </div>
      </AnimatedSection>

      {/* Monthly trend */}
      <AnimatedSection delay={0.1}>
        <div className="rounded-xl bg-surface-container p-6">
          <h3 className="mb-4 text-sm font-semibold text-on-surface-variant">
            Trend (letzte 6 Monate)
          </h3>
          <TrendChart data={trend} />
        </div>
      </AnimatedSection>

      {/* Top categories */}
      <AnimatedSection delay={0.15}>
        <div className="rounded-xl bg-surface-container p-6">
          <h3 className="mb-4 text-sm font-semibold text-on-surface-variant">
            Top Ausgaben
          </h3>
          <TopCategories data={spending} />
        </div>
      </AnimatedSection>
    </div>
  )
}
