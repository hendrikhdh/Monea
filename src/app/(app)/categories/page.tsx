import { getCategories } from '@/lib/supabase/categories'
import { CategoriesShell } from '@/components/features/categories/CategoriesShell'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return <CategoriesShell categories={categories} />
}
