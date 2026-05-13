'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { profileSchema } from '@/lib/validations/profile.schema'

export async function updateProfile(formData: FormData) {
  const result = profileSchema.safeParse({
    name: formData.get('name'),
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    data: { name: result.data.name },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings')
  revalidatePath('/settings/profile')
  return { success: true }
}
