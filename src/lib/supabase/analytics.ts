import { createClient } from './server'
import type { Transaction } from '@/lib/types/database'

export type AnalyticsPeriod = 'month' | '3m' | '6m' | '1y'
export type AnalyticsType = 'expense' | 'income'

export interface SpendingByCategory {
  id: string
  name: string
  color: string
  icon: string
  total: number
}

export interface TrendPoint {
  month: string
  income: number
  expenses: number
}

export interface AnalyticsRange {
  from: string // YYYY-MM-DD inclusive
  to: string // YYYY-MM-DD exclusive
  monthCount: number
}

export function getRangeForPeriod(period: AnalyticsPeriod): AnalyticsRange {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const toDate =
    month === 12
      ? new Date(year + 1, 0, 1)
      : new Date(year, month, 1)
  const to = toDate.toISOString().slice(0, 10)

  if (period === 'month') {
    const from = `${year}-${String(month).padStart(2, '0')}-01`
    return { from, to, monthCount: 1 }
  }

  const monthsBack = period === '3m' ? 3 : period === '6m' ? 6 : 12
  const fromDate = new Date(year, month - monthsBack, 1)
  const from = fromDate.toISOString().slice(0, 10)
  return { from, to, monthCount: monthsBack }
}

export async function getSpendingByCategoryForRange(
  from: string,
  to: string,
  type: AnalyticsType
): Promise<SpendingByCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('transactions')
    .select('amount, category:categories(id, name, color, icon)')
    .eq('type', type)
    .gte('date', from)
    .lt('date', to)

  if (error) throw error

  const map = new Map<string, SpendingByCategory>()
  for (const tx of data ?? []) {
    const rawCat = tx.category as unknown as {
      id: string
      name: string
      color: string
      icon: string
    } | null
    if (!rawCat) continue
    const existing = map.get(rawCat.id)
    if (existing) {
      existing.total += Number(tx.amount)
    } else {
      map.set(rawCat.id, {
        id: rawCat.id,
        name: rawCat.name,
        color: rawCat.color,
        icon: rawCat.icon,
        total: Number(tx.amount),
      })
    }
  }

  return Array.from(map.values()).sort((a, b) => b.total - a.total)
}

export async function getMonthlyTrend(months: number): Promise<TrendPoint[]> {
  const supabase = await createClient()
  const now = new Date()
  const results: TrendPoint[] = []

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
      .in('type', ['income', 'expense'])
      .gte('date', startDate)
      .lt('date', endDate)

    if (error) throw error

    let income = 0
    let expenses = 0
    for (const tx of data as Pick<Transaction, 'amount' | 'type'>[]) {
      if (tx.type === 'income') income += Number(tx.amount)
      else if (tx.type === 'expense') expenses += Number(tx.amount)
    }

    const label = d.toLocaleDateString('de-DE', { month: 'short' })
    results.push({ month: label, income, expenses })
  }

  return results
}
