import { createClient } from '@/lib/supabase/server'
import { getMonthlyStats, getTransactions } from '@/lib/supabase/transactions'
import { computeTotalPortfolio } from '@/lib/supabase/portfolio'
import { getGoals } from '@/lib/supabase/goals'
import { getBudgets, getBudgetsAtRisk } from '@/lib/supabase/budgets'
import { processRecurringTransactions } from '@/lib/supabase/recurring'
import { BalanceCard } from '@/components/features/dashboard/BalanceCard'
import { MonthlyView } from '@/components/features/dashboard/MonthlyView'
import { MonthlyBudget } from '@/components/features/dashboard/MonthlyBudget'
import { RecentTransactions } from '@/components/features/dashboard/RecentTransactions'
import { DashboardGoals } from '@/components/features/dashboard/DashboardGoals'
import { DashboardShell } from '@/components/features/dashboard/DashboardShell'
import { DashboardOnboarding } from '@/components/features/dashboard/DashboardOnboarding'
import { MotivationCard } from '@/components/features/dashboard/MotivationCard'

export default async function DashboardPage() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  // Process any due recurring transactions before loading data
  await processRecurringTransactions().catch(() => {})

  const [balance, monthlyStats, recentTransactions, goals, atRiskBudgets, allBudgets] = await Promise.all([
    computeTotalPortfolio(),
    getMonthlyStats(currentYear, currentMonth),
    getTransactions(5),
    getGoals(),
    getBudgetsAtRisk(currentYear, currentMonth),
    getBudgets(),
  ])

  const isNewUser =
    recentTransactions.length === 0 &&
    goals.length === 0 &&
    allBudgets.length === 0 &&
    balance === 0

  if (isNewUser) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const name = user?.user_metadata?.name as string | undefined
    return <DashboardOnboarding name={name} />
  }

  return (
    <DashboardShell
      motivationCard={<MotivationCard />}
      monthlyView={
        <MonthlyView
          initialYear={currentYear}
          initialMonth={currentMonth}
          initialIncome={monthlyStats.income}
          initialExpenses={monthlyStats.expenses}
        />
      }
      balanceCard={<BalanceCard balance={balance} />}
      monthlyBudget={<MonthlyBudget atRisk={atRiskBudgets} hasAnyBudget={allBudgets.length > 0} />}
      goals={<DashboardGoals goals={goals} />}
      recentTransactions={<RecentTransactions transactions={recentTransactions} />}
    />
  )
}
