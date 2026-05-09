import { createClient } from './server'
import type { Budget, BudgetWithCategory } from '@/lib/types/database'

export async function getBudgetsForMonth(
  year: number,
  month: number
): Promise<BudgetWithCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('budgets')
    .select('*, category:categories(*)')
    .eq('year', year)
    .eq('month', month)
    .order('amount', { ascending: false })

  if (error) throw error
  return (data ?? []) as BudgetWithCategory[]
}

export async function getTotalBudgetForMonth(
  year: number,
  month: number
): Promise<number> {
  const budgets = await getBudgetsForMonth(year, month)
  return budgets.reduce((sum, b) => sum + Number(b.amount), 0)
}

export async function upsertBudget(budget: {
  category_id: string
  year: number
  month: number
  amount: number
}): Promise<Budget> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('budgets')
    .upsert(
      { ...budget, user_id: user.id },
      { onConflict: 'user_id,category_id,year,month' }
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
