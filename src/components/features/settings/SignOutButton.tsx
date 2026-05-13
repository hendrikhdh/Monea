'use client'

import { LogOut } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

export function SignOutButton() {
  const { signOut } = useAuth()

  return (
    <button
      onClick={signOut}
      className="flex w-full items-center gap-4 rounded-2xl bg-destructive/5 p-5 text-destructive transition-colors hover:bg-destructive/10 active:scale-[0.98]"
    >
      <LogOut size={20} />
      <span className="flex-1 text-left font-medium">Abmelden</span>
    </button>
  )
}
