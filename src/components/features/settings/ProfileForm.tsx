'use client'

import { useActionState, useState } from 'react'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { updateProfile } from '@/app/(app)/settings/profile/actions'

interface ProfileFormProps {
  initialName: string
}

export function ProfileForm({ initialName }: ProfileFormProps) {
  const [name, setName] = useState(initialName)

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await updateProfile(formData)
      if (result?.error) toast.error(result.error)
      else toast.success('Profil aktualisiert!')
      return result
    },
    null
  )

  const isDirty = name.trim() !== initialName.trim() && name.trim().length > 0

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="profile-name"
          className="block px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
        >
          Name
        </label>
        <input
          id="profile-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 50))}
          maxLength={50}
          required
          disabled={pending}
          className="h-14 w-full rounded-2xl border border-input bg-transparent px-5 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
          placeholder="Dein Name"
        />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <button
        type="submit"
        disabled={pending || !isDirty}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-primary-container font-heading text-lg font-bold tracking-wide text-primary-foreground shadow-[0_15px_30px_rgba(62,39,35,0.2)] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
      >
        <span>{pending ? 'Speichern…' : 'Speichern'}</span>
        {!pending && <Check size={20} />}
      </button>
    </form>
  )
}
