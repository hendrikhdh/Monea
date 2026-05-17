import { TrendingUp } from 'lucide-react'

export function ShowcaseSection() {
  return (
    <section id="showcase" className="w-full py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-12 lg:px-20">
        <h2 className="mx-auto mb-16 max-w-3xl text-center font-display text-[clamp(36px,6vw,64px)] font-semibold leading-[1.1] tracking-tight text-foreground">
          Gemacht für dein Leben.
        </h2>

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-card md:aspect-[21/9] md:rounded-[3rem]">
        <div className="absolute inset-0 grid grid-cols-1 gap-6 p-8 md:grid-cols-3 md:p-12">
          {/* Left col — Analytics + Lifestyle (md+) */}
          <div className="hidden flex-col gap-6 md:flex">
            <div className="flex h-64 flex-col items-center justify-center rounded-[1.5rem_2rem_1rem_2rem] bg-background p-6">
              <div
                className="relative flex h-32 w-32 items-center justify-center rounded-full"
                style={{
                  background:
                    'conic-gradient(#271310 0% 35%, #d4a49a 35% 60%, #fadcd2 60% 80%, #e3beb8 80% 100%)',
                }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background">
                  <span className="font-display text-xl font-semibold tabular-nums text-foreground">
                    €1k
                  </span>
                </div>
              </div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Spending
              </p>
            </div>
            <div className="grow rounded-[2rem_1rem_1.5rem_2rem] bg-secondary-container p-6">
              <p className="font-heading text-lg font-bold text-secondary-foreground">
                Lifestyle
              </p>
              <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-secondary-foreground">
                €450
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-on-secondary-container" />
                <span className="text-xs text-on-secondary-container">
                  −8% vs. letzter Monat
                </span>
              </div>
            </div>
          </div>

          {/* Center col — Goal + Recent */}
          <div className="flex flex-col gap-6">
            <div className="relative h-48 overflow-hidden rounded-[2.5rem_1.5rem_2.5rem_1rem] bg-secondary/40">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, #d4a49a 0%, #f5c4b8 50%, #c9a69e 100%)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="font-display text-2xl text-white">Paris</p>
                <div className="mt-2 h-1 w-full rounded-full bg-white/30">
                  <div className="h-full w-[80%] rounded-full bg-white" />
                </div>
              </div>
            </div>
            <div className="grow rounded-[1.5rem_2.5rem_1rem_2.5rem] bg-background p-6">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Recent
              </p>
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm text-foreground">Aesop</span>
                  <span className="font-display text-sm tabular-nums text-foreground">
                    −€45,00
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm text-foreground">
                    Café Verlet
                  </span>
                  <span className="font-display text-sm tabular-nums text-foreground">
                    −€12,50
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm text-foreground">
                    Sparen → Paris
                  </span>
                  <span className="font-display text-sm tabular-nums text-success">
                    +€200,00
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right col — Transactions (md+) */}
          <div className="hidden flex-col gap-6 md:flex">
            <div className="h-full rounded-[2rem_2rem_1.5rem_2.5rem] bg-background p-6">
              <h3 className="mb-6 font-heading text-lg font-bold text-foreground">
                Transaktionen
              </h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-surface-container-high" />
                  <div className="grow">
                    <p className="font-sans text-sm text-foreground">
                      Freelance Invoice
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Einnahmen
                    </p>
                  </div>
                  <p className="font-display text-sm tabular-nums text-success">
                    +€1.200
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-surface-container-high" />
                  <div className="grow">
                    <p className="font-sans text-sm text-foreground">Céline</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Shopping
                    </p>
                  </div>
                  <p className="font-display text-sm tabular-nums text-foreground">
                    −€350
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-secondary-container" />
                  <div className="grow">
                    <p className="font-sans text-sm text-foreground">Paris Trip</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Spareinlage
                    </p>
                  </div>
                  <p className="font-display text-sm tabular-nums text-foreground">
                    €200
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
