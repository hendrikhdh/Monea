import { createClient } from './server'
import type { Goal } from '@/lib/types/database'
import { randomId } from '@/lib/utils/randomId'

export async function getGoals(): Promise<Goal[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Goal[]
}

export async function createGoal(
  goal: Pick<Goal, 'name' | 'target_amount' | 'current_amount' | 'image_path' | 'image_aspect'>
): Promise<Goal> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('goals')
    .insert({ ...goal, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data as Goal
}

export async function updateGoal(
  id: string,
  goal: Partial<Pick<Goal, 'name' | 'target_amount' | 'current_amount' | 'image_path' | 'image_aspect'>>
): Promise<Goal> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('goals')
    .update(goal)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Goal
}

export async function deleteGoal(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function uploadGoalImage(file: File): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const ext = file.name.split('.').pop()
  const path = `${user.id}/${randomId()}.${ext}`

  const { error } = await supabase.storage
    .from('goal-images')
    .upload(path, file, { upsert: true })

  if (error) throw error
  return path
}

// Re-export for server usage
export { getGoalImageUrl } from './goalImage'
