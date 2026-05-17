import Link from 'next/link'

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'So funktioniert’s' },
  { href: '#showcase', label: 'Einblicke' },
]

export function MarketingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between px-6 md:px-12 lg:px-20">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-foreground lowercase"
        >
          Monéa
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-on-surface-variant transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden font-sans text-sm font-medium text-foreground transition-opacity hover:opacity-70 sm:inline-block"
          >
            Anmelden
          </Link>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 font-sans text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
          >
            Jetzt starten
          </Link>
        </div>
      </div>
    </nav>
  )
}
