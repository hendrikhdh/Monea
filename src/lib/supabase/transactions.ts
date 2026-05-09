import { createClient } from './server'
import type { Transaction, TransactionWithCategory } from '@/lib/types/database'

export async function getTransactions(limit = 50): Promise<TransactionWithCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('transactions')
    .select('*, category:categories(*)')
    .order('date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as TransactionWithCategory[]
}

export async function getMonthlyStats(year: number, month: number) {
  const supabase = await createClient()
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate =
    month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, '0')}-01`

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

  return { income, expenses, balance: income - expenses }
}

export async function getTotalBalance() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('transactions')
    .select('amount, type')

  if (error) throw error

  let balance = 0
  for (const tx of data as Pick<Transaction, 'amount' | 'type'>[]) {
    if (tx.type === 'income') balance += Number(tx.amount)
    else balance -= Number(tx.amount)
  }

  return balance
}

export async function getSpendingByCategory(year: number, month: number) {
  const supabase = await createClient()
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate =
    month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, '0')}-01`

  const { data, error } = await supabase
    .from('transactions')
    .select('category_id, amount')
    .eq('type', 'expense')
    .gte('date', startDate)
    .lt('date', endDate)

  if (error) throw error

  const map = new Map<string, number>()
  for (const tx of data ?? []) {
    if (!tx.category_id) continue
    const current = map.get(tx.category_id) ?? 0
    map.set(tx.category_id, current + Number(tx.amount))
  }

  return map
}

export async function createTransaction(
  tx: Pick<Transaction, 'category_id' | 'amount' | 'type' | 'date' | 'note'>
): Promise<Transaction> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('transactions')
    .insert({ ...tx, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data as Transaction
}

export async function updateTransaction(
  id: string,
  tx: Partial<Pick<Transaction, 'category_id' | 'amount' | 'type' | 'date' | 'note'>>
): Promise<Transaction> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('transactions')
    .update(tx)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Transaction
}

export async function deleteTransaction(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) throw error
}
