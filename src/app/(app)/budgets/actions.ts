'use server'

import { revalidatePath } from 'next/cache'
import { budgetSchema } from '@/lib/validations/budget.schema'
import { upsertBudget, deleteBudget } from '@/lib/supabase/budgets'

export async function saveBudget(formData: FormData) {
  const result = budgetSchema.safeParse({
    category_id: formData.get('category_id'),
    year: formData.get('year'),
    month: formData.get('month'),
    amount: formData.get('amount'),
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    await upsertBudget(result.data)
    revalidatePath('/budgets')
    revalidatePath('/')
    return { success: true }
  } catch {
    return { error: 'Budget konnte nicht gespeichert werden.' }
  }
}

export async function removeBudget(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'Budget ID fehlt.' }

  try {
    await deleteBudget(id)
    revalidatePath('/budgets')
    revalidatePath('/')
    return { success: true }
  } catch {
    return { error: 'Budget konnte nicht gelöscht werden.' }
  }
}
