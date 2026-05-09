import type { SupabaseClient } from '@supabase/supabase-js'
import { DEFAULT_CATEGORIES } from '@/lib/data/defaultCategories'

export async function seedDefaultCategories(
  supabase: SupabaseClient,
  userId: string
) {
  const { count } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (count && count > 0) return

  const rows = DEFAULT_CATEGORIES.map((c) => ({
    name: c.name,
    icon: c.icon,
    color: c.color,
    type: c.type,
    user_id: userId,
  }))

  await supabase.from('categories').insert(rows)
}
