import { z } from 'zod'

export const recurringSchema = z.object({
  amount: z.coerce.number().positive('Betrag muss größer als 0 sein.'),
  type: z.enum(['income', 'expense']),
  category_id: z.string().uuid().nullable(),
  interval: z.enum(['weekly', 'monthly', 'yearly']),
  start_date: z.string().min(1, 'Startdatum ist erforderlich.'),
  note: z.string().max(200).optional().default(''),
})

export type RecurringFormData = z.infer<typeof recurringSchema>
