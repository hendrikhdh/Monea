'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import {
  createAccount,
  updateAccount,
  deleteAccount,
  freezeMonth,
  unfreezeMonth,
} from '@/lib/supabase/portfolio'

const accountSchema = z.object({
  name: z.string().min(1, 'Name fehlt').max(80),
  type: z.enum(['checking', 'savings', 'brokerage', 'cash', 'other']),
  initial_amount: z.coerce.number().finite(),
  icon: z.string().min(1).max(40),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Ungültige Farbe'),
})

export async function addAccount(formData: FormData) {
  const parsed = accountSchema.safeParse({
    name: formData.get('name'),
    type: formData.get('type'),
    initial_amount: formData.get('initial_amount'),
    icon: formData.get('icon'),
    color: formData.get('color'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe' }
  }

  try {
    await createAccount(parsed.data)
    revalidatePath('/portfolio')
    revalidatePath('/')
    return { ok: true as const }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Konnte nicht speichern' }
  }
}

export async function editAccount(formData: FormData) {
  const id = formData.get('id')
  if (typeof id !== 'string' || !id) return { error: 'ID fehlt' }

  const parsed = accountSchema.safeParse({
    name: formData.get('name'),
    type: formData.get('type'),
    initial_amount: formData.get('initial_amount'),
    icon: formData.get('icon'),
    color: formData.get('color'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe' }
  }

  try {
    await updateAccount(id, parsed.data)
    revalidatePath('/portfolio')
    revalidatePath('/')
    return { ok: true as const }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Konnte nicht speichern' }
  }
}

export async function removeAccount(formData: FormData) {
  const id = formData.get('id')
  if (typeof id !== 'string' || !id) return { error: 'ID fehlt' }

  try {
    await deleteAccount(id)
    revalidatePath('/portfolio')
    revalidatePath('/')
    return { ok: true as const }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Konnte nicht löschen' }
  }
}

const customMonthSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
  amount: z.coerce.number().finite(),
})

export async function saveCustomMonthAction(formData: FormData) {
  const parsed = customMonthSchema.safeParse({
    year: formData.get('year'),
    month: formData.get('month'),
    amount: formData.get('amount'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe' }
  }

  try {
    await freezeMonth(parsed.data.year, parsed.data.month, parsed.data.amount)
    revalidatePath('/portfolio')
    revalidatePath('/')
    return { ok: true as const }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Konnte nicht speichern' }
  }
}

export async function unfreezeMonthAction(formData: FormData) {
  const year = Number(formData.get('year'))
  const month = Number(formData.get('month'))
  if (!Number.isInteger(year) || !Number.isInteger(month)) {
    return { error: 'Ungültiges Datum' }
  }

  try {
    await unfreezeMonth(year, month)
    revalidatePath('/portfolio')
    revalidatePath('/')
    return { ok: true as const }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Konnte nicht aufheben' }
  }
}
