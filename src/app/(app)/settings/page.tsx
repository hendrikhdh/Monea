import Link from 'next/link'
import {
  ChevronRight,
  FolderOpen,
  PiggyBank,
  Repeat,
  Wallet,
  Info,
  User,
  Download,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/features/settings/SignOutButton'

type MenuItem = {
  href: string
  label: string
  description: string
  icon: LucideIcon
}

const SECTIONS: { title: string; items: MenuItem[] }[] = [
  {
    title: 'Persönlich',
    items: [
      {
        href: '/settings/profile',
        label: 'Profil',
        description: 'Dein Name auf dem Avatar',
        icon: User,
      },
    ],
  },
  {
    title: 'Finanzen',
    items: [
      {
        href: '/portfolio',
        label: 'Portfolio',
        description: 'Konten und Monatssalden verwalten',
        icon: Wallet,
      },
      {
        href: '/budgets',
        label: 'Budgets',
        description: 'Monatsgrenzen pro Kategorie',
        icon: PiggyBank,
      },
      {
        href: '/transactions?tab=recurring',
        label: 'Wiederkehrend',
        description: 'Abos, Miete und automatische Buchungen',
        icon: Repeat,
      },
    ],
  },
  {
    title: 'Konfiguration',
    items: [
      {
        href: '/categories',
        label: 'Kategorien',
        description: 'Eigene Kategorien anlegen und anpassen',
        icon: FolderOpen,
      },
    ],
  },
]

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const name = user?.user_metadata?.name || 'User'
  const email = user?.email || ''
  const initials = name.charAt(0).toUpperCase()

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-6 pb-24">
      <h2 className="font-heading text-2xl font-bold">Einstellungen</h2>

      {/* Profile Card */}
      <section className="avatar-gradient relative overflow-hidden rounded-[2.5rem_1.25rem_3rem_1.75rem] p-6 shadow-sm">
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-background/30 blur-2xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/60 font-heading text-2xl font-bold text-secondary-foreground shadow-inner backdrop-blur-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading text-lg font-bold text-secondary-foreground">{name}</p>
            <p className="truncate text-sm text-secondary-foreground/75">{email}</p>
          </div>
        </div>
      </section>

      {/* Sections */}
      {SECTIONS.map((section) => (
        <section key={section.title} className="space-y-3">
          <h3 className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {section.title}
          </h3>
          <div className="space-y-2">
            {section.items.map(({ href, label, description, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-4 rounded-2xl bg-surface-container-low p-5 transition-all hover:bg-surface-container active:scale-[0.98]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container/70 text-secondary-foreground">
                  <Icon size={18} strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="truncate text-xs text-muted-foreground">{description}</p>
                </div>
                <ChevronRight size={18} className="shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Data — uses native anchor so the browser handles the download */}
      <section className="space-y-3">
        <h3 className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Daten
        </h3>
        <a
          href="/api/export/transactions"
          download
          className="flex items-center gap-4 rounded-2xl bg-surface-container-low p-5 transition-all hover:bg-surface-container active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container/70 text-secondary-foreground">
            <Download size={18} strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground">Transaktionen exportieren</p>
            <p className="truncate text-xs text-muted-foreground">
              Als CSV-Datei für Excel oder Numbers
            </p>
          </div>
          <ChevronRight size={18} className="shrink-0 text-muted-foreground" />
        </a>
      </section>

      {/* About */}
      <section className="space-y-3">
        <h3 className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Über
        </h3>
        <div className="flex items-center gap-4 rounded-2xl bg-surface-container-low p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container/70 text-secondary-foreground">
            <Info size={18} strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground">Monéa</p>
            <p className="text-xs text-muted-foreground">Version 0.1.0</p>
          </div>
        </div>
      </section>

      {/* Sign Out */}
      <SignOutButton />
    </div>
  )
}
