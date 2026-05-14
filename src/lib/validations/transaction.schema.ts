import { z } from 'zod'

export const MAX_TRANSACTION_AMOUNT = 99_999.99

export const transactionSchema = z
  .object({
    amount: z.coerce
      .number()
      .positive('Betrag muss größer als 0 sein.')
      .max(MAX_TRANSACTION_AMOUNT, `Betrag darf höchstens ${MAX_TRANSACTION_AMOUNT.toLocaleString('de-DE')} € sein.`),
    type: z.enum(['income', 'expense', 'savings_deposit']),
    category_id: z.string().uuid('Invalid category.').nullable(),
    goal_id: z.string().uuid('Invalid goal.').nullable(),
    date: z.string().min(1, 'Date is required.'),
    note: z.string().max(200).optional().default(''),
  })
  .refine(
    (d) => (d.type === 'savings_deposit' ? !!d.goal_id && !d.category_id : !d.goal_id),
    {
      message: 'Spareinlage benötigt ein Sparziel und keine Kategorie.',
      path: ['goal_id'],
    }
  )

export type TransactionFormData = z.infer<typeof transactionSchema>
