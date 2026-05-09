import { createClient } from './server'
import type { Transaction } from '@/lib/types/database'

export async function getSpendingByCategoryWithNames(year: number, month: number) {
  const supabase = await createClient()
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate =
    month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, '0')}-01`

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, category:categories(id, name, color, icon)')
    .eq('type', 'expense')
    .gte('date', startDate)
    .lt('date', endDate)

  if (error) throw error

  const map = new Map<string, { name: string; color: string; icon: string; total: number }>()
  for (const tx of data ?? []) {
    const rawCat = tx.category as unknown as { id: string; name: string; color: string; icon: string } | null
    if (!rawCat) continue
    const existing = map.get(rawCat.id)
    if (existing) {
      existing.total += Number(tx.amount)
    } else {
      map.set(rawCat.id, { name: rawCat.name, color: rawCat.color, icon: rawCat.icon, total: Number(tx.amount) })
    }
  }

  return Array.from(map.values()).sort((a, b) => b.total - a.total)
}

export async function getMonthlyTrend(months: number) {
  const supabase = await createClient()
  const now = new Date()
  const results: { month: string; income: number; expenses: number }[] = []

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endMonth = month === 12 ? 1 : month + 1
    const endYear = month === 12 ? year + 1 : year
    const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`

    const { data, error } = await supabase
      .from('transactions')
      .select('amount, type')
      .gte('date', startDate)
      .lt('date', endDate)

    if (error) throw error

    let income = 0
    let expenses = 0
    for (const tx of data as Pick<Transaction, 'amount' | 'type'>[]) {
      if (tx.type === 'income') income += Number(tx.amount)
      else expenses += Number(tx.amount)
    }

    const label = d.toLocaleDateString('de-DE', { month: 'short' })
    results.push({ month: label, income, expenses })
  }

  return results
}
