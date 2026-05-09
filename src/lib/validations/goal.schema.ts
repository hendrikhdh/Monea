import { z } from 'zod'

export const goalSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(50, 'Name is too long.'),
  target_amount: z.coerce
    .number()
    .positive('Target must be greater than 0.'),
  current_amount: z.coerce
    .number()
    .min(0, 'Amount cannot be negative.')
    .default(0),
})

export type GoalFormData = z.infer<typeof goalSchema>
