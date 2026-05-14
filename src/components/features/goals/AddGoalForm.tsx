'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import { Check, Trash2, ImagePlus, X, RotateCw } from 'lucide-react'
import { toast } from 'sonner'
import { addGoal, editGoal, removeGoal } from '@/app/(app)/goals/actions'
import { createClient } from '@/lib/supabase/client'
import { getGoalImageUrl } from '@/lib/supabase/goalImage'
import { resizeImage } from '@/lib/utils/resizeImage'
import { randomId } from '@/lib/utils/randomId'
import { MAX_GOAL_AMOUNT } from '@/lib/validations/goal.schema'
import { ImageCropper } from './ImageCropper'
import type { Goal } from '@/lib/types/database'
import { cn } from '@/lib/utils'

interface AddGoalFormProps {
  goal?: Goal | null
  onDone?: () => void
}

export function AddGoalForm({ goal, onDone }: AddGoalFormProps) {
  const isEdit = !!goal

  const [name, setName] = useState(goal?.name ?? '')
  const [target, setTarget] = useState(goal ? String(goal.target_amount) : '')
  const [current, setCurrent] = useState(goal ? String(goal.current_amount) : '0')
  const [imagePath, setImagePath] = useState<string | null>(goal?.image_path ?? null)
  const [imageAspect, setImageAspect] = useState<string>(goal?.image_aspect ?? '16:9')
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    goal?.image_path ? getGoalImageUrl(goal.image_path) : null
  )
  const [failedUpload, setFailedUpload] = useState<{ blob: Blob; aspect: string } | null>(null)
  // Cropper state
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (goal) {
      setName(goal.name)
      setTarget(String(goal.target_amount))
      setCurrent(String(goal.current_amount))
      setImagePath(goal.image_path)
      setImageAspect(goal.image_aspect ?? '16:9')
      setPreviewUrl(goal.image_path ? getGoalImageUrl(goal.image_path) : null)
    } else {
      setName('')
      setTarget('')
      setCurrent('0')
      setImagePath(null)
      setImageAspect('16:9')
      setPreviewUrl(null)
    }
  }, [goal])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Resize to max 1200px JPEG (handles HEIC + large files)
      const resized = await resizeImage(file, 1200)
      const url = URL.createObjectURL(resized)
      setCropSrc(url)
    } catch {
      toast.error('Bild konnte nicht geladen werden.')
    }
  }

  const handleCropDone = async (blob: Blob, aspect: string) => {
    setCropSrc(null)
    setPreviewUrl(URL.createObjectURL(blob))
    setImageAspect(aspect)
    setUploading(true)
    setFailedUpload(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const path = `${user.id}/${randomId()}.jpg`

      const { error } = await supabase.storage
        .from('goal-images')
        .upload(path, blob, { upsert: true, contentType: 'image/jpeg' })

      if (error) throw error
      setImagePath(path)
      toast.success('Bild hochgeladen!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload fehlgeschlagen.')
      // Keep preview visible so the user can retry without re-cropping
      setFailedUpload({ blob, aspect })
    } finally {
      setUploading(false)
    }
  }

  const handleRetryUpload = () => {
    if (failedUpload) handleCropDone(failedUpload.blob, failedUpload.aspect)
  }

  const handleCropCancel = () => {
    setCropSrc(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeImage = () => {
    setImagePath(null)
    setPreviewUrl(null)
    setCropSrc(null)
    setFailedUpload(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      formData.set('image_path', imagePath || '')
      formData.set('image_aspect', imageAspect)

      if (isEdit) {
        formData.set('id', goal.id)
        const result = await editGoal(formData)
        if (result?.error) toast.error(result.error)
        else { toast.success('Sparziel aktualisiert!'); onDone?.() }
        return result
      }

      const result = await addGoal(formData)
      if (result?.error) toast.error(result.error)
      else {
        toast.success('Sparziel erstellt!')
        setName(''); setTarget(''); setCurrent('0')
        setImagePath(null); setPreviewUrl(null)
        setImageAspect('16:9')
        onDone?.()
      }
      return result
    },
    undefined
  )

  const [, deleteAction, deletePending] = useActionState(
    async (_prev: unknown) => {
      if (!goal) return
      const formData = new FormData()
      formData.set('id', goal.id)
      const result = await removeGoal(formData)
      if (result?.error) toast.error(result.error)
      else { toast.success('Sparziel gelöscht.'); onDone?.() }
      return result
    },
    undefined
  )

  // Show cropper if a file was selected
  if (cropSrc) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-center font-heading text-lg font-bold">Bildausschnitt wählen</h3>
        <ImageCropper
          imageSrc={cropSrc}
          onCropDone={handleCropDone}
          onCancel={handleCropCancel}
        />
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col items-center gap-6">
      <h3 className="font-heading text-lg font-bold">
        {isEdit ? 'Sparziel bearbeiten' : 'Neues Sparziel'}
      </h3>

      {/* Image upload area */}
      <div className="relative w-full">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        {previewUrl ? (
          <div className="relative w-full max-h-[30vh] overflow-hidden rounded-[2rem_1rem_2rem_2.5rem]"
            style={{ aspectRatio: imageAspect.replace(':', '/') }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${previewUrl})` }}
            />
            <div className="absolute inset-0 bg-black/20" />
            <button
              type="button"
              onClick={removeImage}
              aria-label="Bild entfernen"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition-all active:scale-90"
            >
              <X size={16} />
            </button>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="text-sm font-semibold text-white">Uploading…</span>
              </div>
            )}
            {failedUpload && !uploading && (
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-black/60 px-4 py-3 backdrop-blur-sm">
                <span className="text-xs font-semibold text-white">
                  Upload fehlgeschlagen
                </span>
                <button
                  type="button"
                  onClick={handleRetryUpload}
                  className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-foreground transition-all active:scale-95"
                >
                  <RotateCw size={14} />
                  Erneut versuchen
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-[2rem_1rem_2rem_2.5rem] border-2 border-dashed border-border bg-surface-container-low text-muted-foreground transition-all active:scale-[0.98]"
          >
            <ImagePlus size={28} />
            <span className="text-sm font-medium">Bild hinzufügen</span>
          </button>
        )}
      </div>

      {/* Name */}
      <input
        name="name"
        placeholder="Name des Sparziels"
        className="h-14 w-full rounded-2xl border border-input bg-transparent px-5 text-center font-display text-xl placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
        required
        disabled={pending}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Target amount */}
      <div className="flex w-full gap-3">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Ziel
          </label>
          <input
            name="target_amount"
            type="number"
            step="1"
            min="1"
            max={MAX_GOAL_AMOUNT}
            placeholder="5.000"
            className="h-14 w-full rounded-2xl border border-input bg-transparent px-5 text-center text-base font-semibold placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
            required
            disabled={pending}
            value={target}
            onChange={(e) => {
              const next = e.target.value
              if (next === '' || Number(next) <= MAX_GOAL_AMOUNT) setTarget(next)
            }}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {isEdit ? 'Gespart (Auto)' : 'Startbetrag'}
          </label>
          <input
            name="current_amount"
            type="number"
            step="1"
            min="0"
            max={MAX_GOAL_AMOUNT}
            placeholder="0"
            className="h-14 w-full rounded-2xl border border-input bg-transparent px-5 text-center text-base font-semibold placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50 read-only:bg-surface-container-low read-only:cursor-not-allowed"
            disabled={pending}
            readOnly={isEdit}
            value={current}
            onChange={(e) => {
              if (isEdit) return
              const next = e.target.value
              if (next === '' || Number(next) <= MAX_GOAL_AMOUNT) setCurrent(next)
            }}
          />
        </div>
      </div>

      {isEdit && (
        <p className="text-xs text-muted-foreground -mt-3">
          Der gesparte Betrag wird automatisch aus deinen Spareinlagen berechnet.
        </p>
      )}

      {!isEdit && target && current && Number(current) > Number(target) && (
        <p className="text-sm text-destructive">
          Startbetrag kann nicht größer als das Ziel sein.
        </p>
      )}

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      {/* Action buttons */}
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
          disabled={
            pending ||
            uploading ||
            !name.trim() ||
            !target ||
            (!!current && Number(current) > Number(target))
          }
          className={cn(
            'flex h-14 flex-1 items-center justify-center gap-3 rounded-full font-heading text-lg font-bold tracking-wide shadow-[0_15px_30px_rgba(62,39,35,0.2)] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none',
            'bg-primary-container text-primary-foreground'
          )}
        >
          <span>{pending ? 'Speichern…' : isEdit ? 'Aktualisieren' : 'Speichern'}</span>
          {!pending && <Check size={20} />}
        </button>
      </div>
    </form>
  )
}
