import { z } from 'zod'

export const budgetSchema = z.object({
  category_id: z.string().uuid(),
  year: z.coerce.number().int().min(2020).max(2100),
  month: z.coerce.number().int().min(1).max(12),
  amount: z.coerce.number().positive('Budget must be greater than 0.'),
})

export type BudgetFormData = z.infer<typeof budgetSchema>
