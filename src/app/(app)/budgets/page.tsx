import { getBudgetsForMonth } from '@/lib/supabase/budgets'
import { getCategories } from '@/lib/supabase/categories'
import { getMonthlyStats } from '@/lib/supabase/transactions'
import { BudgetsShell } from '@/components/features/budgets/BudgetsShell'

export default async function BudgetsPage() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const [budgets, categories, stats] = await Promise.all([
    getBudgetsForMonth(year, month),
    getCategories(),
    getMonthlyStats(year, month),
  ])

  return (
    <BudgetsShell
      initialYear={year}
      initialMonth={month}
      budgets={budgets}
      categories={categories}
      spent={stats.expenses}
    />
  )
}
