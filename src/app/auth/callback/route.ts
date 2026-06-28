import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { seedDefaultCategories } from '@/lib/supabase/seedCategories'
import { ensurePrimaryAccount } from '@/lib/supabase/portfolio'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await seedDefaultCategories(supabase, user.id)
        await ensurePrimaryAccount()
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
