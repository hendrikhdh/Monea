\# Debug: $ARGUMENTS



\## Problem

$ARGUMENTS



\## Process (follow strictly in this order)



\### Step 1: Reproduce

\- Identify the relevant files (max 5)

\- Read ONLY those files

\- Understand: What SHOULD happen vs what DOES happen?



\### Step 2: Diagnose

Run these diagnostics:

\- npx tsc --noEmit

\- npm run lint

\- npm run build

Check browser console errors if applicable.



\### Step 3: Hypothesize

State your hypothesis clearly in this format:

"The bug is caused by \[X] in \[file] at \[location] because \[reason]."

Show me the hypothesis and WAIT for my confirmation before fixing.



\### Step 4: Fix

\- Change ONLY what is necessary to fix the bug

\- Do NOT refactor other code at the same time

\- Max 3 files changed



\### Step 5: Verify

\- Run npm run build (must succeed)

\- Run npm run test (must pass)

\- Explain what was wrong and why the fix works (2-3 sentences in German)

