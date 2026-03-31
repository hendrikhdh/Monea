\# New Page: $ARGUMENTS



\## Task

Create a new page or screen for: $ARGUMENTS



\## Process



\### Step 1: Route

Determine the correct path in src/app/:

\- Authenticated page: src/app/(app)/\[route]/page.tsx

\- Public page: src/app/(marketing)/\[route]/page.tsx



\### Step 2: Page structure

Use Server Component (default) unless interactivity is needed.



Template for Server Component:



import { type Metadata } from 'next'



export const metadata: Metadata = {

&#x20; title: '\[Page Title] | \[App Name]',

&#x20; description: '\[Description]',

}



export default async function PageName() {

&#x20; return (

&#x20;   <main className="flex flex-col min-h-screen p-4 pb-20">

&#x20;     {/\* pb-20 accounts for BottomNav \*/}

&#x20;   </main>

&#x20; )

}



Add 'use client' ONLY when the page needs state, effects, or event handlers.



\### Step 3: Design requirements

\- Mobile viewport (375px) as primary design target

\- Respect safe areas (notch, bottom bar)

\- Skeleton loading states for async content

\- Empty states when no data exists

\- Pull-to-refresh if the page shows dynamic data



\### Step 4: Navigation

\- Add to BottomNav if it is a primary screen

\- Add back button in header if it is a detail or sub-screen

\- Update any links pointing to this page



\### Step 5: Verify

\- Run npm run build

\- Check: Does the page work without JavaScript? (Server Component parts should)

