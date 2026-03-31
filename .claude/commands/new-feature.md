\# New Feature: $ARGUMENTS



\## Task

Implement the following feature: $ARGUMENTS



\## Process



\### Step 1: Plan (REQUIRED before coding)

Show me:

\- New files to create (path + purpose)

\- Existing files to modify (path + what changes)

\- New dependencies needed (if any)

\- Database changes needed (if any)

Then WAIT for my confirmation.



\### Step 2: Types and Validation

\- Create or extend types in src/lib/types/

\- Create Zod schemas in src/lib/validations/ for any user input



\### Step 3: Database layer (if needed)

\- Create Supabase queries in src/lib/supabase/

\- Create API routes in src/app/api/ if needed

\- Add RLS policies for new tables



\### Step 4: UI Components

\- Create components in src/components/features/

\- Use shadcn/ui base components

\- Mobile-first: Design for 375px width first

\- Add loading states (skeleton or spinner)

\- Add error states with toast notifications

\- Touch targets: Min 44x44px



\### Step 5: Page integration

\- Add or update page in src/app/

\- Update navigation if needed (BottomNav tabs)



\### Step 6: Verify

\- Run npm run build and fix any errors

\- Run npm run lint and fix any errors



\## Rules

\- Max 5 file changes per batch

\- Each component file max 150 lines

\- Follow ALL conventions from CLAUDE.md

\- Use existing utils and hooks before creating new ones

\- Every user action needs visual feedback (toast, loading state, animation)

