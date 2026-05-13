import { z } from 'zod'

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name ist erforderlich.')
    .max(50, 'Name darf höchstens 50 Zeichen lang sein.')
    .trim(),
})

export type ProfileFormData = z.infer<typeof profileSchema>
