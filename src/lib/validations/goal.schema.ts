import { z } from 'zod'

export const MAX_GOAL_AMOUNT = 9_999_999

export const goalSchema = z
  .object({
    name: z.string().min(1, 'Name ist erforderlich.').max(50, 'Name ist zu lang.'),
    target_amount: z.coerce
      .number()
      .positive('Zielbetrag muss größer als 0 sein.')
      .max(MAX_GOAL_AMOUNT, `Zielbetrag darf höchstens ${MAX_GOAL_AMOUNT.toLocaleString('de-DE')} € sein.`),
    current_amount: z.coerce
      .number()
      .min(0, 'Betrag kann nicht negativ sein.')
      .max(MAX_GOAL_AMOUNT, `Gesparter Betrag darf höchstens ${MAX_GOAL_AMOUNT.toLocaleString('de-DE')} € sein.`)
      .default(0),
    image_aspect: z.enum(['21:9', '16:9', '4:3', '1:1']).optional().default('16:9'),
  })
  .refine((data) => data.current_amount <= data.target_amount, {
    message: 'Gespart kann nicht größer als das Ziel sein.',
    path: ['current_amount'],
  })

export type GoalFormData = z.infer<typeof goalSchema>
