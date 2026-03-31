\# Deploy Checklist



\## Task

Run through the complete deployment checklist before pushing to production.



\## Pre-deployment checks (run ALL of these)



\### 1. Code quality

Run these commands and report results:

\- npx tsc --noEmit (must show zero errors)

\- npm run lint (must show zero errors)

\- npm run build (must complete successfully)

\- npm run test (all tests must pass)



If ANY of these fail: STOP and report the errors. Do not proceed.



\### 2. Environment variables

\- All environment variables documented in .env.example?

\- No .env.local file committed to git? (check .gitignore)

\- Remind me to set production values in Vercel dashboard



\### 3. Security

\- No hardcoded secrets or API keys in any source file?

\- Supabase RLS enabled on all tables?

\- All API routes validate input with Zod?

\- All API routes check authentication?



\### 4. PWA readiness

\- manifest.ts exists with all required fields (name, short\_name, icons, theme\_color, background\_color, display standalone, start\_url)?

\- Icons at public/icons/icon-192x192.png and public/icons/icon-512x512.png?

\- layout.tsx has apple-touch-icon link tag?

\- layout.tsx has theme-color meta tag?

\- viewport meta tag includes viewport-fit=cover?



\### 5. Git state

\- All changes committed?

\- Current branch is main?

\- No merge conflicts?



\## Deploy steps

If all checks pass:



git add .

git commit -m "chore: prepare for deployment"

git push origin main



Vercel will auto-deploy from main branch.



\## Post-deployment

Remind me to manually verify:

\- Visit the production URL and check if it loads

\- Test login and signup flow on production

\- Test on a real phone (iOS Safari and Android Chrome)

\- Try adding to home screen to verify PWA works

\- Check Vercel dashboard for any runtime errors

