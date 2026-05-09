import { z } from 'zod'

export const transactionSchema = z.object({
  amount: z.coerce
    .number()
    .positive('Amount must be greater than 0.'),
  type: z.enum(['income', 'expense']),
  category_id: z.string().uuid('Invalid category.').nullable(),
  date: z.string().min(1, 'Date is required.'),
  note: z.string().max(200).optional().default(''),
})

export type TransactionFormData = z.infer<typeof transactionSchema>
