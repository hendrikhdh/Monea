'use server'

import { revalidatePath } from 'next/cache'
import { createTransaction, updateTransaction, deleteTransaction } from '@/lib/supabase/transactions'
import { transactionSchema } from '@/lib/validations/transaction.schema'
import { recurringSchema } from '@/lib/validations/recurring.schema'
import { createRecurring, updateRecurring, deleteRecurring } from '@/lib/supabase/recurring'

export async function addTransaction(formData: FormData) {
  const categoryId = formData.get('category_id') as string
  const goalId = formData.get('goal_id') as string
  const accountId = formData.get('account_id') as string
  const toAccountId = formData.get('to_account_id') as string

  const result = transactionSchema.safeParse({
    amount: formData.get('amount'),
    type: formData.get('type'),
    category_id: categoryId || null,
    goal_id: goalId || null,
    account_id: accountId || null,
    to_account_id: toAccountId || null,
    date: formData.get('date'),
    note: formData.get('note'),
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    await createTransaction({
      ...result.data,
      account_id: result.data.account_id ?? null,
      to_account_id: result.data.to_account_id ?? null,
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to create transaction.' }
  }

  revalidatePath('/transactions')
  revalidatePath('/')
  revalidatePath('/goals')
  revalidatePath('/portfolio')
  return { success: true }
}

export async function editTransaction(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'Transaction ID is required.' }

  const categoryId = formData.get('category_id') as string
  const goalId = formData.get('goal_id') as string
  const accountId = formData.get('account_id') as string
  const toAccountId = formData.get('to_account_id') as string

  const result = transactionSchema.safeParse({
    amount: formData.get('amount'),
    type: formData.get('type'),
    category_id: categoryId || null,
    goal_id: goalId || null,
    account_id: accountId || null,
    to_account_id: toAccountId || null,
    date: formData.get('date'),
    note: formData.get('note'),
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    await updateTransaction(id, {
      ...result.data,
      account_id: result.data.account_id ?? null,
      to_account_id: result.data.to_account_id ?? null,
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to update transaction.' }
  }

  revalidatePath('/transactions')
  revalidatePath('/')
  revalidatePath('/goals')
  revalidatePath('/portfolio')
  return { success: true }
}

export async function removeTransaction(formData: FormData) {
  const id = formData.get('id') as string

  if (!id) return { error: 'Transaction ID is required.' }

  try {
    await deleteTransaction(id)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to delete transaction.' }
  }

  revalidatePath('/transactions')
  revalidatePath('/')
  revalidatePath('/goals')
  revalidatePath('/portfolio')
  return { success: true }
}

export async function addRecurring(formData: FormData) {
  const categoryId = formData.get('category_id') as string
  const goalId = formData.get('goal_id') as string
  const accountId = formData.get('account_id') as string

  const result = recurringSchema.safeParse({
    amount: formData.get('amount'),
    type: formData.get('type'),
    category_id: categoryId || null,
    goal_id: goalId || null,
    account_id: accountId || null,
    interval: formData.get('interval'),
    start_date: formData.get('start_date'),
    note: formData.get('note'),
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    await createRecurring({
      ...result.data,
      account_id: result.data.account_id ?? null,
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Fehler beim Erstellen.' }
  }

  revalidatePath('/transactions')
  revalidatePath('/')
  revalidatePath('/goals')
  return { success: true }
}

export async function editRecurring(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'ID fehlt.' }

  const categoryId = formData.get('category_id') as string
  const goalId = formData.get('goal_id') as string
  const accountId = formData.get('account_id') as string

  const result = recurringSchema.safeParse({
    amount: formData.get('amount'),
    type: formData.get('type'),
    category_id: categoryId || null,
    goal_id: goalId || null,
    account_id: accountId || null,
    interval: formData.get('interval'),
    start_date: formData.get('start_date'),
    note: formData.get('note'),
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    await updateRecurring(id, {
      amount: result.data.amount,
      type: result.data.type,
      category_id: result.data.category_id,
      goal_id: result.data.goal_id,
      account_id: result.data.account_id ?? null,
      note: result.data.note,
      interval: result.data.interval,
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Fehler beim Aktualisieren.' }
  }

  revalidatePath('/transactions')
  revalidatePath('/')
  revalidatePath('/goals')
  return { success: true }
}

export async function toggleRecurring(formData: FormData) {
  const id = formData.get('id') as string
  const isActive = formData.get('is_active') === 'true'

  if (!id) return { error: 'ID fehlt.' }

  try {
    await updateRecurring(id, { is_active: !isActive })
  } catch {
    return { error: 'Fehler beim Aktualisieren.' }
  }

  revalidatePath('/transactions')
  return { success: true }
}

export async function removeRecurring(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'ID fehlt.' }

  try {
    await deleteRecurring(id)
  } catch {
    return { error: 'Fehler beim Löschen.' }
  }

  revalidatePath('/transactions')
  return { success: true }
}
