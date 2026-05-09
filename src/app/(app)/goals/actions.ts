'use server'

import { revalidatePath } from 'next/cache'
import { createGoal, updateGoal, deleteGoal } from '@/lib/supabase/goals'
import { goalSchema } from '@/lib/validations/goal.schema'

export async function addGoal(formData: FormData) {
  const result = goalSchema.safeParse({
    name: formData.get('name'),
    target_amount: formData.get('target_amount'),
    current_amount: formData.get('current_amount'),
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const imagePath = formData.get('image_path') as string | null

  try {
    await createGoal({ ...result.data, image_path: imagePath || null })
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to create goal.' }
  }

  revalidatePath('/goals')
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
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const imagePath = formData.get('image_path') as string | null

  try {
    await updateGoal(id, { ...result.data, image_path: imagePath || null })
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
