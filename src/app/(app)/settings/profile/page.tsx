import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/features/settings/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const name = (user?.user_metadata?.name as string | undefined) ?? ''
  const email = user?.email ?? ''
  const initials = (name || email).charAt(0).toUpperCase()

  return (
    <div className="mx-auto w-full max-w-2xl px-6 pb-24">
      {/* Sticky header */}
      <div className="sticky top-20 z-30 -mx-6 -mt-4 bg-background/70 px-6 pb-4 pt-7 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            aria-label="Zurück"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container transition-all active:scale-90"
          >
            <ChevronLeft size={20} className="text-foreground" />
          </Link>
          <h1 className="font-heading text-2xl font-bold text-foreground">Profil</h1>
        </div>
      </div>

      <div className="space-y-8 pt-6">
        {/* Avatar preview */}
        <section className="avatar-gradient flex flex-col items-center gap-4 rounded-[2.5rem_1.25rem_3rem_1.75rem] p-8 shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background/60 font-heading text-3xl font-bold text-secondary-foreground shadow-inner backdrop-blur-sm">
            {initials}
          </div>
          <p className="text-sm text-secondary-foreground/75">{email}</p>
        </section>

        <ProfileForm initialName={name} />
      </div>
    </div>
  )
}
