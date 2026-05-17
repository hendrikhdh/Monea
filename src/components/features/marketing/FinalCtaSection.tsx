import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function FinalCtaSection() {
  return (
    <section className="relative w-full overflow-hidden bg-card py-24 md:py-32">
      {/* Soft rose blob behind */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-30 blur-3xl"
        style={{
          background: '#c9a69e',
          borderRadius: '50% 50% 42% 65%/68% 40% 40% 72%',
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-6 font-display text-[clamp(36px,6vw,64px)] font-semibold leading-[1.1] tracking-tight text-foreground">
          Bereit, deinen Überblick zu finden?
        </h2>
        <p className="mx-auto mb-12 max-w-2xl font-sans text-lg leading-relaxed text-on-surface-variant md:text-xl">
          Schließe dich allen an, die ihre Finanzen mit Eleganz verwalten.
        </p>
        <div className="flex flex-col items-stretch justify-center gap-5 sm:flex-row sm:items-center">
          <Link
            href="/login"
            className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 font-sans text-base font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
          >
            Kostenlos starten
          </Link>
          <Link
            href="#features"
            className="group inline-flex items-center justify-center gap-2 px-2 font-sans text-base font-medium text-foreground transition-opacity hover:opacity-70"
          >
            Mehr erfahren
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
        </div>
      </div>
    </section>
  )
}
