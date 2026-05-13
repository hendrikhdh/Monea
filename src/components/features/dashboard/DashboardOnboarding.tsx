'use client'

import Link from 'next/link'
import { Sparkles, ArrowRight, Receipt, PiggyBank, Target } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/animated-section'

const QUICK_ACTIONS: { icon: typeof Receipt; title: string; description: string; href: string }[] = [
  {
    icon: Receipt,
    title: 'Erste Transaktion',
    description: 'Halte Einnahmen und Ausgaben fest.',
    href: '/transactions',
  },
  {
    icon: PiggyBank,
    title: 'Budgets setzen',
    description: 'Definiere Monatsgrenzen pro Kategorie.',
    href: '/budgets',
  },
  {
    icon: Target,
    title: 'Sparziel anlegen',
    description: 'Vom Wochenendtrip bis zur eigenen Wohnung.',
    href: '/goals',
  },
]

interface DashboardOnboardingProps {
  name?: string
}

export function DashboardOnboarding({ name }: DashboardOnboardingProps) {
  const firstName = name?.split(' ')[0]

  return (
    <div className="mx-auto w-full max-w-2xl space-y-10 px-6">
      <AnimatedSection delay={0}>
        <section className="relative overflow-hidden rounded-[3rem_1rem_4rem_3rem] bg-gradient-to-br from-primary to-primary-container p-8 text-primary-foreground shadow-xl">
          <div className="absolute -top-12 -right-12 h-56 w-56 rounded-full bg-secondary-container/40 blur-3xl" />
          <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-secondary/30 blur-3xl" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-background/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary backdrop-blur-md">
              <Sparkles size={12} />
              Willkommen bei Monéa
            </div>
            <h1 className="font-display text-4xl font-normal leading-tight">
              {firstName ? `Hi ${firstName},` : 'Schön, dass du da bist.'}
              <br />
              <span className="text-secondary">leg los.</span>
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-primary-foreground/85">
              In wenigen Sekunden hast du dein erstes Setup. Erfasse eine Transaktion, definiere ein Budget oder setze dir ein Sparziel — der Rest läuft von selbst.
            </p>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-foreground">Quick Start</h2>
          <div className="space-y-3">
            {QUICK_ACTIONS.map(({ icon: Icon, title, description, href }, i) => {
              const SHAPES = [
                'rounded-[2.5rem_1.25rem_3rem_1.75rem]',
                'rounded-[1.5rem_3rem_1.5rem_2.5rem]',
                'rounded-[3rem_1.75rem_2.25rem_1.5rem]',
              ]
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex items-center gap-4 bg-surface-container-low p-5 transition-all active:scale-[0.98] ${SHAPES[i]}`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-container text-secondary-foreground">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-base font-bold text-foreground">{title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="shrink-0 text-muted-foreground transition-transform group-active:translate-x-1"
                  />
                </Link>
              )
            })}
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
