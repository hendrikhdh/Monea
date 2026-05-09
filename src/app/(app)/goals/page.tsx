import { getGoals } from '@/lib/supabase/goals'
import { GoalsShell } from '@/components/features/goals/GoalsShell'

export default async function GoalsPage() {
  const goals = await getGoals()

  return <GoalsShell goals={goals} />
}
