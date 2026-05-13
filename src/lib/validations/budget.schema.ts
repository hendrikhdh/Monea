import { z } from 'zod'

export const MAX_BUDGET_AMOUNT = 99_999

export const budgetSchema = z.object({
  category_id: z.string().uuid(),
  amount: z.coerce
    .number()
    .positive('Budget muss größer als 0 sein.')
    .max(MAX_BUDGET_AMOUNT, `Budget darf höchstens ${MAX_BUDGET_AMOUNT.toLocaleString('de-DE')} € sein.`),
})

export type BudgetFormData = z.infer<typeof budgetSchema>
