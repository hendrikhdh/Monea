import Link from 'next/link'
import { ArrowRight, Sparkles, Plane } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden pt-32 pb-16 md:pt-40 lg:min-h-[88vh] lg:py-24">
      <div className="mx-auto flex w-full max-w-[1600px] items-center px-6 md:px-12 lg:px-20">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: copy */}
          <div className="max-w-xl">
            <p className="mb-4 font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant">
              Personal finance, elevated
            </p>
            <h1 className="mb-6 font-display text-[clamp(44px,8vw,96px)] font-semibold leading-[1.05] tracking-tight text-foreground">
              Your money —
              <br />
              but elevated.
            </h1>
            <p className="mb-10 max-w-md font-sans text-lg leading-relaxed text-on-surface-variant md:text-xl">
              Die Ruhe, die deine Finanzen brauchen. Behalte den Überblick über
              Ausgaben und Sparziele — ohne den Stress herkömmlicher
              Banking-Apps.
            </p>
            <div className="flex flex-col items-stretch gap-5 sm:flex-row sm:items-center">
              <Link
                href="/login"
                className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 font-sans text-base font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
              >
                Kostenlos starten
              </Link>
              <Link
                href="#how-it-works"
                className="group inline-flex items-center justify-center gap-2 px-2 font-sans text-base font-medium text-foreground transition-opacity hover:opacity-70"
              >
                So funktioniert&rsquo;s
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* Right: tilted phone mockup */}
          <div className="relative hidden h-[600px] w-full items-center justify-center lg:flex">
            <div
              className="relative w-full max-w-md"
              style={{ transform: 'rotateY(-8deg) rotateX(4deg)' }}
            >
              {/* Balance card */}
              <div className="absolute right-4 top-10 z-20 w-72 rounded-[2rem_1rem_2.5rem_1.5rem] bg-card p-6">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Gesamtsaldo
                </p>
                <p className="font-display text-[40px] font-semibold leading-none tabular-nums text-foreground">
                  €4.280,50
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="rounded-full bg-success/20 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-success">
                    +2.4%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    diesen Monat
                  </span>
                </div>
              </div>

              {/* Motivation card */}
              <div className="absolute left-0 top-48 z-10 w-64 rounded-[1.5rem_2rem_1rem_2.5rem] bg-secondary-container p-5">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center"
                    style={{
                      background: '#f5c4b8',
                      borderRadius: '60% 42% 40% 72%/42% 65% 60% 42%',
                    }}
                  >
                    <Sparkles size={18} className="text-foreground" />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-bold text-foreground">
                      On Track
                    </p>
                    <p className="mt-0.5 font-sans text-xs leading-snug text-on-surface-variant">
                      Du triffst deine Monatsziele beautifully.
                    </p>
                  </div>
                </div>
              </div>

              {/* Goal card */}
              <div className="absolute bottom-10 right-10 z-30 w-80 rounded-[2.5rem_1.5rem_2rem_1rem] bg-card p-6">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Paris Trip
                    </p>
                    <p className="font-display text-2xl font-semibold leading-none tabular-nums text-foreground">
                      €1.200
                    </p>
                  </div>
                  <Plane size={20} className="text-muted-foreground" />
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                  <div className="h-full w-[65%] rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
