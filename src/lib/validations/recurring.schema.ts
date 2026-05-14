import { z } from 'zod'

export const MAX_RECURRING_AMOUNT = 99_999.99

export const recurringSchema = z
  .object({
    amount: z.coerce
      .number()
      .positive('Betrag muss größer als 0 sein.')
      .max(MAX_RECURRING_AMOUNT, `Betrag darf höchstens ${MAX_RECURRING_AMOUNT.toLocaleString('de-DE')} € sein.`),
    type: z.enum(['income', 'expense', 'savings_deposit']),
    category_id: z.string().uuid().nullable(),
    goal_id: z.string().uuid().nullable(),
    interval: z.enum(['weekly', 'monthly', 'yearly']),
    start_date: z.string().min(1, 'Startdatum ist erforderlich.'),
    note: z.string().max(200).optional().default(''),
  })
  .refine(
    (d) => (d.type === 'savings_deposit' ? !!d.goal_id && !d.category_id : !d.goal_id),
    {
      message: 'Spareinlage benötigt ein Sparziel und keine Kategorie.',
      path: ['goal_id'],
    }
  )

export type RecurringFormData = z.infer<typeof recurringSchema>
