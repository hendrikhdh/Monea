'use server'

import { revalidatePath } from 'next/cache'
import { createCategory, updateCategory, deleteCategory } from '@/lib/supabase/categories'
import { categorySchema } from '@/lib/validations/category.schema'

export async function addCategory(formData: FormData) {
  const result = categorySchema.safeParse({
    name: formData.get('name'),
    icon: formData.get('icon'),
    color: formData.get('color'),
    type: formData.get('type'),
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    await createCategory(result.data)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to create category.' }
  }

  revalidatePath('/categories')
  return { success: true }
}

export async function editCategory(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'Category ID is required.' }

  const result = categorySchema.safeParse({
    name: formData.get('name'),
    icon: formData.get('icon'),
    color: formData.get('color'),
    type: formData.get('type'),
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    await updateCategory(id, result.data)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to update category.' }
  }

  revalidatePath('/categories')
  return { success: true }
}

export async function removeCategory(formData: FormData) {
  const id = formData.get('id') as string

  if (!id) return { error: 'Category ID is required.' }

  try {
    await deleteCategory(id)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to delete category.' }
  }

  revalidatePath('/categories')
  return { success: true }
}
