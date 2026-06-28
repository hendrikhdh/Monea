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
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []).map((a) => ({
    ...a,
    initial_amount: Number(a.initial_amount),
    current_amount: Number(a.current_amount),
  })) as PortfolioAccount[]
}

// Persist a new drag-and-drop ordering (sort_order = array index). RLS scopes to the user.
export async function reorderAccounts(orderedIds: string[]): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from('portfolio_accounts')
        .update({ sort_order: index })
        .eq('id', id)
        .eq('user_id', user.id)
    )
  )
}

// Guarantee the user has a primary "Girokonto" account (lazily create it for
// new users; existing users got one via the 20260628_account_ledger migration).
export async function ensurePrimaryAccount(): Promise<PortfolioAccount> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: existing } = await supabase
    .from('portfolio_accounts')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_primary', true)
    .maybeSingle()

  if (existing) {
    return {
      ...existing,
      initial_amount: Number(existing.initial_amount),
      current_amount: Number(existing.current_amount),
    } as PortfolioAccount
  }

  const { data, error } = await supabase
    .from('portfolio_accounts')
    .insert({
      user_id: user.id,
      name: 'Girokonto',
      type: 'checking',
      initial_amount: 0,
      current_amount: 0,
      is_primary: true,
      sort_order: 0,
      icon: 'Landmark',
      color: '#56423b',
    })
    .select()
    .single()

  if (error) throw error
  return data as PortfolioAccount
}

export async function createAccount(
  account: Pick<PortfolioAccount, 'name' | 'type' | 'initial_amount' | 'icon' | 'color'>
): Promise<PortfolioAccount> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // New accounts go to the end of the list.
  const { data: maxRow } = await supabase
    .from('portfolio_accounts')
    .select('sort_order')
    .eq('user_id', user.id)
    .order('sort_order', { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle()
  const nextOrder = (maxRow?.sort_order ?? -1) + 1

  // No transactions yet → current_amount starts equal to the start balance.
  const { data, error } = await supabase
    .from('portfolio_accounts')
    .insert({ ...account, current_amount: account.initial_amount, sort_order: nextOrder, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data as PortfolioAccount
}

export async function updateAccount(
  id: string,
  patch: Partial<Pick<PortfolioAccount, 'name' | 'type' | 'initial_amount' | 'icon' | 'color'>>
): Promise<PortfolioAccount> {
  // Changing initial_amount triggers a DB recompute of current_amount.
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

  const { data: account } = await supabase
    .from('portfolio_accounts')
    .select('is_primary')
    .eq('id', id)
    .maybeSingle()

  if (account?.is_primary) {
    throw new Error('Das Girokonto kann nicht gelöscht werden.')
  }

  const [{ count: txCount }, { count: recCount }] = await Promise.all([
    supabase
      .from('transactions')
      .select('id', { count: 'exact', head: true })
      .or(`account_id.eq.${id},to_account_id.eq.${id}`),
    supabase
      .from('recurring_transactions')
      .select('id', { count: 'exact', head: true })
      .eq('account_id', id),
  ])

  if ((txCount ?? 0) + (recCount ?? 0) > 0) {
    throw new Error('Konto hat Buchungen und kann nicht gelöscht werden. Bitte zuerst umbuchen.')
  }

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

// Total = sum of all account balances. Account balances already include every
// income/expense/transfer (the migration moved historical cash flow into the
// auto-created Girokonto), so the monthly cash-flow is no longer added separately.
export async function computeTotalPortfolio(): Promise<number> {
  const accounts = await getAccounts()
  return accounts.reduce((acc, a) => acc + a.current_amount, 0)
}

