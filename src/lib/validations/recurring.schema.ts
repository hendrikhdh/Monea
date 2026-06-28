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
    account_id: z.string().uuid('Ungültiges Konto.').nullable().optional(),
    interval: z.enum(['weekly', 'monthly', 'yearly']),
    start_date: z.string().min(1, 'Startdatum ist erforderlich.'),
    note: z.string().max(200).optional().default(''),
  })
  .superRefine((d, ctx) => {
    if (d.type === 'savings_deposit') {
      if (!d.goal_id) {
        ctx.addIssue({ code: 'custom', path: ['goal_id'], message: 'Spareinlage benötigt ein Sparziel.' })
      }
      if (d.category_id) {
        ctx.addIssue({ code: 'custom', path: ['category_id'], message: 'Spareinlage hat keine Kategorie.' })
      }
    } else {
      if (!d.account_id) {
        ctx.addIssue({ code: 'custom', path: ['account_id'], message: 'Konto fehlt.' })
      }
      if (d.goal_id) {
        ctx.addIssue({ code: 'custom', path: ['goal_id'], message: 'Nur Spareinlagen haben ein Sparziel.' })
      }
    }
  })

export type RecurringFormData = z.infer<typeof recurringSchema>
