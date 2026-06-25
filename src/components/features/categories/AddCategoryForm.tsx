'use client'

import { useActionState, useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { addCategory, editCategory, removeCategory } from '@/app/(app)/categories/actions'
import type { Category } from '@/lib/types/database'
import { ICON_MAP, ICON_NAMES } from './iconMap'
import { cn } from '@/lib/utils'

const PRESET_COLORS = [
  '#6f5a52', '#ba1a1a', '#e3beb8', '#34a853',
  '#4285f4', '#f4b400', '#9c27b0', '#271310',
]

interface AddCategoryFormProps {
  category?: Category | null
  onDone?: () => void
}

export function AddCategoryForm({ category, onDone }: AddCategoryFormProps) {
  const isEdit = !!category

  const [name, setName] = useState(category?.name ?? '')
  const [selectedType, setSelectedType] = useState<'expense' | 'income' | 'both'>(category?.type ?? 'expense')
  const [selectedIcon, setSelectedIcon] = useState(category?.icon ?? 'Tag')
  const [selectedColor, setSelectedColor] = useState(category?.color ?? PRESET_COLORS[0])
  const [showIcons, setShowIcons] = useState(false)

  // Re-sync local state when the edited category changes (sheet reused across opens)
  const [prevCategory, setPrevCategory] = useState(category)
  if (category !== prevCategory) {
    setPrevCategory(category)
    if (category) {
      setName(category.name)
      setSelectedType(category.type)
      setSelectedIcon(category.icon)
      setSelectedColor(category.color)
    } else {
      setName('')
      setSelectedType('expense')
      setSelectedIcon('Tag')
      setSelectedColor(PRESET_COLORS[0])
    }
  }

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      if (isEdit) {
        formData.set('id', category.id)
        const result = await editCategory(formData)
        if (result?.error) {
          toast.error(result.error)
        } else {
          toast.success('Kategorie aktualisiert!')
          onDone?.()
        }
        return result
      }

      const result = await addCategory(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Kategorie erstellt!')
        setName('')
        setSelectedIcon('Tag')
        setSelectedColor(PRESET_COLORS[0])
        onDone?.()
      }
      return result
    },
    undefined
  )

  const [, deleteAction, deletePending] = useActionState(
    async () => {
      if (!category) return
      const formData = new FormData()
      formData.set('id', category.id)
      const result = await removeCategory(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Kategorie gelöscht.')
        onDone?.()
      }
      return result
    },
    undefined
  )

  const SelectedIconComponent = ICON_MAP[selectedIcon]

  return (
    <form action={action} className="flex flex-col items-center gap-4">
      {/* Title */}
      <h3 className="font-heading text-lg font-bold">
        {isEdit ? 'Kategorie bearbeiten' : 'Neue Kategorie'}
      </h3>

      {/* Type toggle — same style as transaction form */}
      <div className="flex gap-2 rounded-full bg-surface-container-low p-1">
        {(['expense', 'income', 'both'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setSelectedType(t)}
            className={cn(
              'rounded-full px-5 py-2 text-sm font-semibold capitalize transition-all active:scale-95',
              selectedType === t
                ? 'bg-primary-container text-primary-foreground'
                : 'text-muted-foreground'
            )}
          >
            {t === 'expense' ? 'Ausgabe' : t === 'income' ? 'Einnahme' : 'Beides'}
          </button>
        ))}
      </div>
      <input type="hidden" name="type" value={selectedType} />

      {/* Icon + Color preview */}
      <button
        type="button"
        onClick={() => setShowIcons(!showIcons)}
        className="flex h-20 w-20 items-center justify-center rounded-[2rem] transition-all active:scale-95"
        style={{ backgroundColor: `${selectedColor}25` }}
      >
        {SelectedIconComponent && (
          <SelectedIconComponent size={32} style={{ color: selectedColor }} />
        )}
      </button>
      <input type="hidden" name="icon" value={selectedIcon} />

      {/* Icon grid */}
      {showIcons && (
        <div className="grid w-full grid-cols-7 gap-2 rounded-3xl bg-surface-container-low p-3">
          {ICON_NAMES.map((iconName) => {
            const Icon = ICON_MAP[iconName]
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => {
                  setSelectedIcon(iconName)
                  setShowIcons(false)
                }}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-90',
                  selectedIcon === iconName
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Icon size={18} />
              </button>
            )
          })}
        </div>
      )}

      {/* Color picker */}
      <div className="flex gap-3">
        <input type="hidden" name="color" value={selectedColor} />
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setSelectedColor(color)}
            className={cn(
              'h-9 w-9 rounded-full transition-all active:scale-90',
              selectedColor === color
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110'
                : ''
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Name input */}
      <div className="w-full">
        <input
          id="cat-name"
          name="name"
          placeholder="Kategorie-Name"
          className="h-14 w-full rounded-2xl border border-input bg-transparent px-5 text-center text-base font-medium placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
          required
          disabled={pending}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      {/* Action buttons — same style as transaction form */}
      <div className="flex w-full gap-3">
        {isEdit && (
          <button
            type="button"
            disabled={deletePending}
            onClick={() => deleteAction()}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-destructive/20 text-destructive transition-all active:scale-95 disabled:opacity-40"
          >
            <Trash2 size={20} />
          </button>
        )}
        <button
          type="submit"
          disabled={pending || !name.trim()}
          className="flex h-14 flex-1 items-center justify-center gap-3 rounded-full bg-primary-container font-heading text-lg font-bold tracking-wide text-primary-foreground shadow-[0_15px_30px_rgba(62,39,35,0.2)] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
        >
          <span>{pending ? 'Speichern…' : isEdit ? 'Aktualisieren' : 'Speichern'}</span>
          {!pending && <Check size={20} />}
        </button>
      </div>
    </form>
  )
}
