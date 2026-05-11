import { createClient } from './server'
import { getSpendingByCategory } from './transactions'
import type { Budget, BudgetWithCategory } from '@/lib/types/database'

export interface BudgetAtRisk {
  budget: BudgetWithCategory
  spent: number
  percentage: number
}

export async function getBudgets(): Promise<BudgetWithCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('budgets')
    .select('*, category:categories(*)')
    .order('amount', { ascending: false })

  if (error) throw error
  return (data ?? []).map((b) => ({
    ...b,
    amount: Number(b.amount),
  })) as BudgetWithCategory[]
}

export async function getTotalBudget(): Promise<number> {
  const budgets = await getBudgets()
  return budgets.reduce((sum, b) => sum + Number(b.amount), 0)
}

export async function upsertBudget(budget: {
  category_id: string
  amount: number
}): Promise<Budget> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('budgets')
    .upsert(
      { ...budget, user_id: user.id },
      { onConflict: 'user_id,category_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data as Budget
}

export async function deleteBudget(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('budgets').delete().eq('id', id)
  if (error) throw error
}

export async function getBudgetsAtRisk(
  year: number,
  month: number,
  threshold = 0.8
): Promise<BudgetAtRisk[]> {
  const [budgets, spentMap] = await Promise.all([
    getBudgets(),
    getSpendingByCategory(year, month),
  ])

  const result: BudgetAtRisk[] = []
  for (const budget of budgets) {
    const limit = Number(budget.amount)
    if (limit <= 0) continue
    const spent = spentMap.get(budget.category_id) ?? 0
    const ratio = spent / limit
    if (ratio >= threshold) {
      result.push({
        budget,
        spent,
        percentage: Math.round(ratio * 100),
      })
    }
  }

  result.sort((a, b) => b.percentage - a.percentage)
  return result
}
