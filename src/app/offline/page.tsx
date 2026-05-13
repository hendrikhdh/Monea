import { WifiOff } from 'lucide-react'

export const metadata = {
  title: 'Offline — Monéa',
}

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary-container/60 text-secondary-foreground">
        <WifiOff size={36} strokeWidth={1.5} />
      </div>
      <h1 className="mt-6 font-display text-3xl tracking-tight text-foreground">
        Keine Verbindung
      </h1>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        Du bist offline. Sobald du wieder im Netz bist, ist Monéa direkt für dich da.
      </p>
    </main>
  )
}
