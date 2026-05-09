import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required.').max(30, 'Name is too long.'),
  icon: z.string().min(1, 'Icon is required.'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color format.'),
  type: z.enum(['income', 'expense', 'both']),
})

export type CategoryFormData = z.infer<typeof categorySchema>
