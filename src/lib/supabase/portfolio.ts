import { createClient } from './server'
import type {
  PortfolioAccount,
  MonthlyBalanceSnapshot,
  Transaction,
} from '@/lib/types/database'

export async function getAccounts(): Promise<PortfolioAccount[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('portfolio_accounts')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []).map((a) => ({
    ...a,
    current_amount: Number(a.current_amount),
  })) as PortfolioAccount[]
}

export async function createAccount(
  account: Pick<PortfolioAccount, 'name' | 'type' | 'current_amount' | 'icon' | 'color'>
): Promise<PortfolioAccount> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('portfolio_accounts')
    .insert({ ...account, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data as PortfolioAccount
}

export async function updateAccount(
  id: string,
  patch: Partial<Pick<PortfolioAccount, 'name' | 'type' | 'current_amount' | 'icon' | 'color'>>
): Promise<PortfolioAccount> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('portfolio_accounts')
    .update(patch)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as PortfolioAccount
}

export async function deleteAccount(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('portfolio_accounts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getSnapshots(): Promise<MonthlyBalanceSnapshot[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('monthly_balance_snapshots')
    .select('*')

  if (error) throw error
  return (data ?? []).map((s) => ({
    ...s,
    frozen_amount: Number(s.frozen_amount),
  })) as MonthlyBalanceSnapshot[]
}

export async function freezeMonth(
  year: number,
  month: number,
  amount: number
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('monthly_balance_snapshots')
    .upsert(
      { user_id: user.id, year, month, frozen_amount: amount },
      { onConflict: 'user_id,year,month' }
    )

  if (error) throw error
}

export async function unfreezeMonth(year: number, month: number): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('monthly_balance_snapshots')
    .delete()
    .eq('user_id', user.id)
    .eq('year', year)
    .eq('month', month)

  if (error) throw error
}

export interface MonthlyBalance {
  year: number
  month: number
  amount: number
  frozen: boolean
  liveAmount: number
  customAmount: number | null
}

export async function getMonthlyBalances(): Promise<MonthlyBalance[]> {
  const supabase = await createClient()
  const { data: txData, error: txError } = await supabase
    .from('transactions')
    .select('amount, type, date')
    .in('type', ['income', 'expense'])

  if (txError) throw txError

  const liveByKey = new Map<string, number>()
  for (const tx of (txData ?? []) as Pick<Transaction, 'amount' | 'type' | 'date'>[]) {
    const d = new Date(tx.date)
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`
    const delta = tx.type === 'income' ? Number(tx.amount) : -Number(tx.amount)
    liveByKey.set(key, (liveByKey.get(key) ?? 0) + delta)
  }

  const snapshots = await getSnapshots()
  const snapshotByKey = new Map(
    snapshots.map((s) => [`${s.year}-${s.month}`, s.frozen_amount])
  )

  const allKeys = new Set([...liveByKey.keys(), ...snapshotByKey.keys()])
  const result: MonthlyBalance[] = []
  for (const key of allKeys) {
    const [yStr, mStr] = key.split('-')
    const year = Number(yStr)
    const month = Number(mStr)
    const liveAmount = liveByKey.get(key) ?? 0
    const customAmount = snapshotByKey.has(key) ? snapshotByKey.get(key)! : null
    const frozen = customAmount !== null
    const amount = frozen ? customAmount : liveAmount
    result.push({ year, month, amount, frozen, liveAmount, customAmount })
  }

  result.sort((a, b) => (b.year - a.year) || (b.month - a.month))
  return result
}

export async function getMonthlyBalanceLive(year: number, month: number): Promise<number> {
  const supabase = await createClient()
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate =
    month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, '0')}-01`

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, type')
    .in('type', ['income', 'expense'])
    .gte('date', startDate)
    .lt('date', endDate)

  if (error) throw error

  let total = 0
  for (const tx of (data ?? []) as Pick<Transaction, 'amount' | 'type'>[]) {
    total += tx.type === 'income' ? Number(tx.amount) : -Number(tx.amount)
  }
  return total
}

export async function computeTotalPortfolio(): Promise<number> {
  const [accounts, monthlyBalances] = await Promise.all([
    getAccounts(),
    getMonthlyBalances(),
  ])

  const accountsSum = accounts.reduce((acc, a) => acc + a.current_amount, 0)
  const monthlySum = monthlyBalances.reduce((acc, m) => acc + m.amount, 0)
  return accountsSum + monthlySum
}

