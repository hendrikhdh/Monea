const steps = [
  {
    number: '01',
    title: 'Anmelden',
    description:
      'Erstelle deinen Account in Sekunden — sicher, privat, völlig unkompliziert.',
  },
  {
    number: '02',
    title: 'Eintragen',
    description:
      'Trage Transaktionen ein, definiere Budgets, lege deine Sparziele an. Alles aus einer Hand.',
  },
  {
    number: '03',
    title: 'Wachsen',
    description:
      'Lehne dich zurück und sieh zu, wie sich dein Überblick — und dein Sparstand — entwickelt.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full bg-surface-container-low py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-12 lg:px-20">
        <h2 className="mx-auto mb-16 max-w-3xl text-center font-heading text-3xl font-bold tracking-tight text-foreground md:mb-24 md:text-[40px] md:leading-[1.1]">
          In drei Schritten zu mehr Klarheit
        </h2>

        <div className="relative grid grid-cols-1 gap-12 text-center md:grid-cols-3">
          {/* Connecting line — desktop only */}
          <div className="absolute left-[16%] right-[16%] top-12 -z-0 hidden h-px bg-border md:block" />

          {steps.map(({ number, title, description }) => (
            <div key={number} className="relative z-10 flex flex-col items-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-background">
                <span
                  className="font-display text-[56px] font-semibold leading-none tabular-nums"
                  style={{ color: '#d4a49a' }}
                >
                  {number}
                </span>
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-foreground">
                {title}
              </h3>
              <p className="max-w-xs px-4 font-sans text-base leading-relaxed text-on-surface-variant">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
