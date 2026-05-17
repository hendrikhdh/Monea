import Link from 'next/link'

const columns = [
  {
    title: 'Produkt',
    links: [
      { href: '#features', label: 'Features' },
      { href: '#how-it-works', label: 'So funktioniert’s' },
      { href: '#showcase', label: 'Einblicke' },
    ],
  },
  {
    title: 'Unternehmen',
    links: [
      { href: '#', label: 'Über uns' },
      { href: '#', label: 'Kontakt' },
    ],
  },
  {
    title: 'Rechtliches',
    links: [
      { href: '#', label: 'Impressum' },
      { href: '#', label: 'Datenschutz' },
      { href: '#', label: 'AGB' },
    ],
  },
]

export function MarketingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 w-full rounded-t-[2rem] bg-surface-container md:rounded-t-[4rem]">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-2 gap-10 px-6 py-16 md:grid-cols-4 md:gap-12 md:px-12 md:py-24 lg:px-20">
        <div className="col-span-2 md:col-span-1">
          <Link
            href="/"
            className="mb-4 block font-display text-2xl tracking-tight text-foreground lowercase"
          >
            Monéa
          </Link>
          <p className="font-sans text-sm leading-relaxed text-on-surface-variant">
            Your money — but elevated.
            <br />
            Made with care for the intentional.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground">
              {col.title}
            </span>
            {col.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-sans text-sm text-on-surface-variant transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-border/40 px-6 py-6 md:px-12 lg:px-20">
        <p className="mx-auto max-w-[1600px] text-center font-sans text-xs text-muted-foreground md:text-left">
          © {year} Monéa. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  )
}
