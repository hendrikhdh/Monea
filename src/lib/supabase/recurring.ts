import { createClient } from './server'
import type { RecurringTransaction, RecurringTransactionWithCategory } from '@/lib/types/database'

export async function getRecurringTransactions(): Promise<RecurringTransactionWithCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('recurring_transactions')
    .select('*, category:categories(*), goal:goals(id, name)')
    .order('next_due', { ascending: true })

  if (error) throw error
  return (data ?? []) as RecurringTransactionWithCategory[]
}

export async function createRecurring(
  recurring: Pick<RecurringTransaction, 'category_id' | 'goal_id' | 'amount' | 'type' | 'note' | 'interval' | 'start_date'>
): Promise<RecurringTransaction> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('recurring_transactions')
    .insert({
      ...recurring,
      user_id: user.id,
      next_due: recurring.start_date,
    })
    .select()
    .single()

  if (error) throw error
  return data as RecurringTransaction
}

export async function updateRecurring(
  id: string,
  updates: Partial<Pick<RecurringTransaction, 'amount' | 'category_id' | 'goal_id' | 'type' | 'note' | 'interval' | 'is_active'>>
): Promise<RecurringTransaction> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('recurring_transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as RecurringTransaction
}

export async function deleteRecurring(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('recurring_transactions')
    .delete()
    .eq('id', id)

  if (error) throw error
}

function advanceDate(date: Date, interval: string): Date {
  const next = new Date(date)
  switch (interval) {
    case 'weekly':
      next.setDate(next.getDate() + 7)
      break
    case 'monthly':
      next.setMonth(next.getMonth() + 1)
      break
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1)
      break
  }
  return next
}

export async function processRecurringTransactions(): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const today = new Date().toISOString().slice(0, 10)

  // Throttle: skip if we already ran today for this user
  const { data: meta } = await supabase
    .from('user_meta')
    .select('last_recurring_processed_at')
    .eq('user_id', user.id)
    .maybeSingle()

  if (meta?.last_recurring_processed_at) {
    const lastRunDay = new Date(meta.last_recurring_processed_at)
      .toISOString()
      .slice(0, 10)
    if (lastRunDay === today) return 0
  }

  const { data: dueItems, error } = await supabase
    .from('recurring_transactions')
    .select('*')
    .eq('is_active', true)
    .lte('next_due', today)

  if (error) throw error

  if (!dueItems || dueItems.length === 0) {
    // Mark throttle even when nothing was due, so subsequent reloads skip the lookup
    await supabase
      .from('user_meta')
      .upsert({ user_id: user.id, last_recurring_processed_at: new Date().toISOString() })
    return 0
  }

  let created = 0

  for (const item of dueItems as RecurringTransaction[]) {
    let nextDue = new Date(item.next_due + 'T00:00:00')

    while (nextDue.toISOString().slice(0, 10) <= today) {
      const txDate = nextDue.toISOString().slice(0, 10)

      // Check for duplicate
      const { count } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('recurring_transaction_id', item.id)
        .eq('date', txDate)

      if (!count || count === 0) {
        await supabase.from('transactions').insert({
          user_id: item.user_id,
          category_id: item.category_id,
          goal_id: item.goal_id,
          amount: item.amount,
          type: item.type,
          date: txDate,
          note: item.note || '',
          recurring_transaction_id: item.id,
        })
        created++
      }

      nextDue = advanceDate(nextDue, item.interval)
    }

    // Update next_due
    await supabase
      .from('recurring_transactions')
      .update({ next_due: nextDue.toISOString().slice(0, 10) })
      .eq('id', item.id)
  }

  // Record successful run to throttle future calls
  await supabase
    .from('user_meta')
    .upsert({ user_id: user.id, last_recurring_processed_at: new Date().toISOString() })

  return created
}
