\# Code Review



\## Task

Review the current project state for issues and report findings.

Do NOT fix anything. Only report. I will decide what to fix.



\## Checklist



\### Critical (must fix before deploy)

\- TypeScript errors: run npx tsc --noEmit

\- Build errors: run npm run build

\- Hardcoded secrets or API keys in any file

\- Missing error handling on API calls or Supabase queries

\- Missing input validation on API routes

\- Missing RLS policies on Supabase tables



\### Important (should fix soon)

\- Files exceeding 150 lines (components) or 200 lines (utils)

\- Code duplication (same logic in multiple places)

\- Missing loading states on async operations

\- Missing error states and empty states

\- Unused imports or variables

\- Console.log statements left in production code



\### Mobile PWA specific

\- Touch targets smaller than 44x44px

\- Hover-only interactions without touch alternative

\- Text smaller than 16px on mobile

\- Content hidden behind notch or safe areas

\- Bottom content hidden behind BottomNav (needs pb-20 or similar)

\- Horizontal scroll on mobile viewport (375px)



\### Nice to have

\- Missing JSDoc comments on exported functions

\- Missing aria labels on interactive elements

\- Server Components unnecessarily marked as client components



\## Output format

🔴 Critical: \[issue] in \[file] -> Fix: \[specific fix]

🟡 Important: \[issue] in \[file] -> Fix: \[specific fix]

🟢 Nice-to-have: \[issue] in \[file] -> Fix: \[specific fix]

