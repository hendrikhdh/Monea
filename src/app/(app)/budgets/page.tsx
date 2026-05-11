import { getBudgets } from '@/lib/supabase/budgets'
import { getCategories } from '@/lib/supabase/categories'
import { getSpendingByCategory } from '@/lib/supabase/transactions'
import { BudgetsView } from '@/components/features/budgets/BudgetsView'

export default async function BudgetsPage() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const [budgets, categories, spentMap] = await Promise.all([
    getBudgets(),
    getCategories(),
    getSpendingByCategory(year, month),
  ])

  const spentByCategory: Record<string, number> = Object.fromEntries(spentMap)

  return (
    <BudgetsView
      budgets={budgets}
      categories={categories}
      spentByCategory={spentByCategory}
    />
  )
}
