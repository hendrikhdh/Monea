import { AnimatedBlobs } from '@/components/features/auth/AnimatedBlobs'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="relative flex h-dvh flex-col items-center justify-center overflow-hidden px-6">
      <AnimatedBlobs />
      <div className="relative w-full max-w-sm">{children}</div>
    </main>
  )
}
