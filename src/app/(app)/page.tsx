import { getTotalBalance, getMonthlyStats, getTransactions } from '@/lib/supabase/transactions'
import { getGoals } from '@/lib/supabase/goals'
import { BalanceCard } from '@/components/features/dashboard/BalanceCard'
import { MonthlyOverview } from '@/components/features/dashboard/MonthlyOverview'
import { MonthlyBudget } from '@/components/features/dashboard/MonthlyBudget'
import { RecentTransactions } from '@/components/features/dashboard/RecentTransactions'
import { DashboardGoals } from '@/components/features/dashboard/DashboardGoals'
import { DashboardShell } from '@/components/features/dashboard/DashboardShell'
import { MotivationCard } from '@/components/features/dashboard/MotivationCard'

export default async function DashboardPage() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const [balance, monthlyStats, recentTransactions, goals] = await Promise.all([
    getTotalBalance(),
    getMonthlyStats(currentYear, currentMonth),
    getTransactions(5),
    getGoals(),
  ])

  return (
    <DashboardShell
      motivationCard={<MotivationCard />}
      balanceCard={<BalanceCard balance={balance} />}
      monthlyOverview={
        <MonthlyOverview
          initialYear={currentYear}
          initialMonth={currentMonth}
          initialIncome={monthlyStats.income}
          initialExpenses={monthlyStats.expenses}
        />
      }
      monthlyBudget={<MonthlyBudget spent={monthlyStats.expenses} />}
      goals={<DashboardGoals goals={goals} />}
      recentTransactions={<RecentTransactions transactions={recentTransactions} />}
    />
  )
}
