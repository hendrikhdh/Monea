\# New API Route: $ARGUMENTS



\## Task

Create an API route for: $ARGUMENTS



\## Template

Place at: src/app/api/\[route]/route.ts



import { createClient } from '@/lib/supabase/server'

import { NextResponse } from 'next/server'



export async function POST(request: Request) {

&#x20; try {

&#x20;   // 1. Auth check

&#x20;   const supabase = await createClient()

&#x20;   const { data: { user }, error: authError } = await supabase.auth.getUser()

&#x20;   if (authError || !user) {

&#x20;     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

&#x20;   }



&#x20;   // 2. Validate input

&#x20;   const body = await request.json()

&#x20;   const validated = Schema.safeParse(body)

&#x20;   if (!validated.success) {

&#x20;     return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

&#x20;   }



&#x20;   // 3. Business logic

&#x20;   const { data, error } = await supabase

&#x20;     .from('\[table]')

&#x20;     .insert({ ...validated.data, user\_id: user.id })

&#x20;     .select()

&#x20;     .single()

&#x20;   if (error) throw error



&#x20;   // 4. Return response

&#x20;   return NextResponse.json(data, { status: 201 })



&#x20; } catch (error) {

&#x20;   console.error('\[ROUTE\_NAME]:', error)

&#x20;   return NextResponse.json({ error: 'Internal server error' }, { status: 500 })

&#x20; }

}



\## Rules

\- ALWAYS validate input with Zod

\- ALWAYS check authentication first

\- ALWAYS handle errors with try-catch

\- ALWAYS return proper HTTP status codes (200, 201, 400, 401, 404, 500)

\- NEVER expose internal error details to the client

\- Log errors server-side with console.error

