import { z } from 'zod'

export const budgetSchema = z.object({
  category_id: z.string().uuid(),
  amount: z.coerce.number().positive('Budget muss größer als 0 sein.'),
})

export type BudgetFormData = z.infer<typeof budgetSchema>
