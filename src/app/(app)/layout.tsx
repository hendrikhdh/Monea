import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { Sidebar } from '@/components/layout/Sidebar'
import { createClient } from '@/lib/supabase/server'

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <Sidebar />
      <main className="flex flex-1 flex-col pt-24 pb-24 lg:pt-10 lg:pb-10 lg:pl-[260px]">
        {children}
      </main>
      <BottomNav />
    </>
  )
}
