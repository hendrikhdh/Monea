import { createClient } from './server'
import type { Category } from '@/lib/types/database'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  return data as Category[]
}

export async function getCategoriesByType(type: 'income' | 'expense'): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .or(`type.eq.${type},type.eq.both`)
    .order('name')

  if (error) throw error
  return data as Category[]
}

export async function createCategory(
  category: Pick<Category, 'name' | 'icon' | 'color' | 'type'>
): Promise<Category> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('categories')
    .insert({ ...category, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data as Category
}

export async function updateCategory(
  id: string,
  category: Partial<Pick<Category, 'name' | 'icon' | 'color' | 'type'>>
): Promise<Category> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Category
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw error
}
