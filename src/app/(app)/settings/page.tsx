import Link from 'next/link'
import { ChevronRight, FolderOpen, PiggyBank, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/features/settings/SignOutButton'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const name = user?.user_metadata?.name || 'User'
  const email = user?.email || ''
  const initials = name.charAt(0).toUpperCase()

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-6">
      <h2 className="font-heading text-2xl font-bold">Settings</h2>

      {/* Profile Card */}
      <div className="flex items-center gap-4 rounded-xl bg-surface-container-low p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary font-heading text-lg font-bold text-secondary-foreground">
          {initials}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-on-surface-variant">{email}</p>
        </div>
        <User size={20} className="text-muted-foreground" />
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        <Link
          href="/categories"
          className="flex items-center gap-4 rounded-xl bg-surface-container-low p-5 transition-colors hover:bg-surface-container-high active:scale-[0.98]"
        >
          <FolderOpen size={20} className="text-muted-foreground" />
          <span className="flex-1 font-medium">Kategorien</span>
          <ChevronRight size={18} className="text-muted-foreground" />
        </Link>
        <Link
          href="/budgets"
          className="flex items-center gap-4 rounded-xl bg-surface-container-low p-5 transition-colors hover:bg-surface-container-high active:scale-[0.98]"
        >
          <PiggyBank size={20} className="text-muted-foreground" />
          <span className="flex-1 font-medium">Budgets</span>
          <ChevronRight size={18} className="text-muted-foreground" />
        </Link>
      </div>

      {/* Sign Out */}
      <SignOutButton />
    </div>
  )
}
