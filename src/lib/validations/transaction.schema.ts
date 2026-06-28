import { z } from 'zod'

export const MAX_TRANSACTION_AMOUNT = 99_999.99

export const transactionSchema = z
  .object({
    amount: z.coerce
      .number()
      .positive('Betrag muss größer als 0 sein.')
      .max(MAX_TRANSACTION_AMOUNT, `Betrag darf höchstens ${MAX_TRANSACTION_AMOUNT.toLocaleString('de-DE')} € sein.`),
    type: z.enum(['income', 'expense', 'savings_deposit', 'transfer']),
    category_id: z.string().uuid('Invalid category.').nullable(),
    goal_id: z.string().uuid('Invalid goal.').nullable(),
    account_id: z.string().uuid('Ungültiges Konto.').nullable().optional(),
    to_account_id: z.string().uuid('Ungültiges Konto.').nullable().optional(),
    date: z.string().min(1, 'Date is required.'),
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
    } else if (d.type === 'transfer') {
      if (!d.account_id) {
        ctx.addIssue({ code: 'custom', path: ['account_id'], message: 'Quellkonto fehlt.' })
      }
      if (!d.to_account_id) {
        ctx.addIssue({ code: 'custom', path: ['to_account_id'], message: 'Zielkonto fehlt.' })
      }
      if (d.account_id && d.to_account_id && d.account_id === d.to_account_id) {
        ctx.addIssue({ code: 'custom', path: ['to_account_id'], message: 'Quell- und Zielkonto müssen unterschiedlich sein.' })
      }
    } else {
      // income | expense
      if (!d.account_id) {
        ctx.addIssue({ code: 'custom', path: ['account_id'], message: 'Konto fehlt.' })
      }
      if (d.goal_id) {
        ctx.addIssue({ code: 'custom', path: ['goal_id'], message: 'Nur Spareinlagen haben ein Sparziel.' })
      }
    }
  })

export type TransactionFormData = z.infer<typeof transactionSchema>
