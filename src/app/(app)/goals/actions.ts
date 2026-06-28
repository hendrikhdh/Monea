'use server'

import { revalidatePath } from 'next/cache'
import { createGoal, updateGoal, deleteGoal } from '@/lib/supabase/goals'
import { createTransaction } from '@/lib/supabase/transactions'
import { goalSchema } from '@/lib/validations/goal.schema'

export async function addGoal(formData: FormData) {
  const result = goalSchema.safeParse({
    name: formData.get('name'),
    target_amount: formData.get('target_amount'),
    current_amount: formData.get('current_amount'),
    image_aspect: formData.get('image_aspect') || '16:9',
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const imagePath = formData.get('image_path') as string | null
  const initialAmount = result.data.current_amount

  try {
    const goal = await createGoal({
      name: result.data.name,
      target_amount: result.data.target_amount,
      current_amount: 0,
      image_path: imagePath || null,
      image_aspect: result.data.image_aspect ?? '16:9',
    })

    if (initialAmount > 0) {
      await createTransaction({
        category_id: null,
        goal_id: goal.id,
        account_id: null,
        to_account_id: null,
        amount: initialAmount,
        type: 'savings_deposit',
        date: new Date().toISOString().slice(0, 10),
        note: 'Initialbetrag',
      })
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to create goal.' }
  }

  revalidatePath('/goals')
  revalidatePath('/transactions')
  revalidatePath('/')
  return { success: true }
}

export async function editGoal(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'Goal ID is required.' }

  const result = goalSchema.safeParse({
    name: formData.get('name'),
    target_amount: formData.get('target_amount'),
    current_amount: formData.get('current_amount'),
    image_aspect: formData.get('image_aspect') || '16:9',
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const imagePath = formData.get('image_path') as string | null

  try {
    // current_amount is derived from savings_deposit transactions via DB trigger.
    // Don't overwrite it from the form.
    await updateGoal(id, {
      name: result.data.name,
      target_amount: result.data.target_amount,
      image_path: imagePath || null,
      image_aspect: result.data.image_aspect ?? '16:9',
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to update goal.' }
  }

  revalidatePath('/goals')
  revalidatePath('/')
  return { success: true }
}

export async function removeGoal(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'Goal ID is required.' }

  try {
    await deleteGoal(id)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to delete goal.' }
  }

  revalidatePath('/goals')
  revalidatePath('/')
  return { success: true }
}
