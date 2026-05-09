/**
 * 10 unique organic border-radius shapes for category icon backgrounds.
 * Each shape is intentionally asymmetric and curvy to feel hand-crafted.
 */
export const ORGANIC_SHAPES = [
  'rounded-[70%_42%_50%_50%/42%_65%_42%_65%]',
  'rounded-[42%_70%_65%_42%/60%_42%_70%_40%]',
  'rounded-[55%_45%_40%_70%/70%_40%_55%_45%]',
  'rounded-[65%_42%_70%_40%/40%_70%_42%_60%]',
  'rounded-[42%_65%_42%_60%/65%_42%_68%_40%]',
  'rounded-[72%_40%_55%_45%/42%_60%_40%_68%]',
  'rounded-[40%_72%_60%_42%/68%_40%_65%_42%]',
  'rounded-[60%_42%_40%_72%/42%_65%_60%_42%]',
  'rounded-[42%_60%_68%_40%/40%_72%_45%_55%]',
  'rounded-[50%_50%_42%_65%/68%_40%_40%_72%]',
] as const

/**
 * Returns a stable organic shape class for a given category ID.
 * Uses a simple string hash so the same category always gets the same shape,
 * regardless of rendering order or page.
 */
export function getShapeForCategory(categoryId: string): string {
  let hash = 0
  for (let i = 0; i < categoryId.length; i++) {
    hash = ((hash << 5) - hash + categoryId.charCodeAt(i)) | 0
  }
  const index = Math.abs(hash) % ORGANIC_SHAPES.length
  return ORGANIC_SHAPES[index]
}
