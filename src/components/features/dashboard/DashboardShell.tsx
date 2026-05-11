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
    <div className="mx-auto w-full max-w-2xl space-y-10 px-6">
      {motivationCard && <AnimatedSection delay={0}>{motivationCard}</AnimatedSection>}
      <AnimatedSection delay={0.05}>{monthlyView}</AnimatedSection>
      <AnimatedSection delay={0.1}>{balanceCard}</AnimatedSection>
      <AnimatedSection delay={0.15}>{monthlyBudget}</AnimatedSection>
      {goals && <AnimatedSection delay={0.2}>{goals}</AnimatedSection>}
      <AnimatedSection delay={0.25}>{recentTransactions}</AnimatedSection>
    </div>
  )
}
