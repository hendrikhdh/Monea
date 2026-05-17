'use client'

import type { ReactNode } from 'react'
import { AnimatedSection } from '@/components/ui/animated-section'

interface DashboardShellProps {
  motivationCard?: ReactNode
  monthlyView: ReactNode
  balanceCard: ReactNode
  monthlyBudget: ReactNode
  goals?: ReactNode
  recentTransactions: ReactNode
}

export function DashboardShell({
  motivationCard,
  monthlyView,
  balanceCard,
  monthlyBudget,
  goals,
  recentTransactions,
}: DashboardShellProps) {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 lg:max-w-[1200px] lg:px-10">
      <div className="space-y-10 lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-10 lg:space-y-0">
        <div className="space-y-10">
          {motivationCard && <AnimatedSection delay={0}>{motivationCard}</AnimatedSection>}
          <AnimatedSection delay={0.05}>{monthlyView}</AnimatedSection>
          <AnimatedSection delay={0.1}>{balanceCard}</AnimatedSection>
          <AnimatedSection delay={0.15}>{monthlyBudget}</AnimatedSection>
        </div>
        <div className="space-y-10">
          {goals && <AnimatedSection delay={0.2}>{goals}</AnimatedSection>}
          <AnimatedSection delay={0.25}>{recentTransactions}</AnimatedSection>
        </div>
      </div>
    </div>
  )
}
