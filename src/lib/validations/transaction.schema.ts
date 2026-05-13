import { z } from 'zod'

export const MAX_TRANSACTION_AMOUNT = 99_999.99

export const transactionSchema = z.object({
  amount: z.coerce
    .number()
    .positive('Betrag muss größer als 0 sein.')
    .max(MAX_TRANSACTION_AMOUNT, `Betrag darf höchstens ${MAX_TRANSACTION_AMOUNT.toLocaleString('de-DE')} € sein.`),
  type: z.enum(['income', 'expense']),
  category_id: z.string().uuid('Invalid category.').nullable(),
  date: z.string().min(1, 'Date is required.'),
  note: z.string().max(200).optional().default(''),
})

export type TransactionFormData = z.infer<typeof transactionSchema>
