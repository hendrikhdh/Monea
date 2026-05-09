'use server'

import { revalidatePath } from 'next/cache'
import { createTransaction, updateTransaction, deleteTransaction } from '@/lib/supabase/transactions'
import { transactionSchema } from '@/lib/validations/transaction.schema'
import { recurringSchema } from '@/lib/validations/recurring.schema'
import { createRecurring, updateRecurring, deleteRecurring } from '@/lib/supabase/recurring'

export async function addTransaction(formData: FormData) {
  const categoryId = formData.get('category_id') as string

  const result = transactionSchema.safeParse({
    amount: formData.get('amount'),
    type: formData.get('type'),
    category_id: categoryId || null,
    date: formData.get('date'),
    note: formData.get('note'),
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    await createTransaction(result.data)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to create transaction.' }
  }

  revalidatePath('/transactions')
  revalidatePath('/')
  return { success: true }
}

export async function editTransaction(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'Transaction ID is required.' }

  const categoryId = formData.get('category_id') as string

  const result = transactionSchema.safeParse({
    amount: formData.get('amount'),
    type: formData.get('type'),
    category_id: categoryId || null,
    date: formData.get('date'),
    note: formData.get('note'),
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    await updateTransaction(id, result.data)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to update transaction.' }
  }

  revalidatePath('/transactions')
  revalidatePath('/')
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
  return { success: true }
}

export async function addRecurring(formData: FormData) {
  const categoryId = formData.get('category_id') as string

  const result = recurringSchema.safeParse({
    amount: formData.get('amount'),
    type: formData.get('type'),
    category_id: categoryId || null,
    interval: formData.get('interval'),
    start_date: formData.get('start_date'),
    note: formData.get('note'),
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    await createRecurring(result.data)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Fehler beim Erstellen.' }
  }

  revalidatePath('/transactions')
  revalidatePath('/')
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
