\# Optimize



\## Task

Analyze the current project for performance and code quality.

Do NOT implement changes. Only report findings. I will decide what to fix.



\## Checks (run in this order)



\### 1. Build check

Run: npm run build

Report: Build time, any warnings, output size.



\### 2. File size audit

Find all files exceeding limits:

\- Component files over 150 lines: Must be split

\- Utility and lib files over 200 lines: Must be split

\- Single imports pulling in entire large libraries



\### 3. Client vs Server components

List all files that contain 'use client'.

For each file: Is 'use client' actually needed?

Could any of them be converted to Server Components?



\### 4. Bundle impact

Check for heavy dependencies in package.json:

\- Are there lighter alternatives for any package?

\- Are we importing entire libraries when we only use one function?

&#x20; Example: import \_ from 'lodash' should be import debounce from 'lodash/debounce'



\### 5. Image optimization

\- Any img tags that should be next/image Image component?

\- Any images missing width and height attributes?

\- Any images missing alt text?



\### 6. PWA audit

\- Is manifest.ts complete with name, icons, theme\_color, display standalone, start\_url?

\- Are all meta tags set: viewport, theme-color, apple-mobile-web-app-capable?

\- Are PWA icons present in public/icons/ at 192x192 and 512x512?

\- Is there an apple-touch-icon?



\## Output format

Prioritized list grouped by impact:



🔴 High impact, easy fix: \[issue] in \[file] -> Fix: \[specific fix]

🟡 Medium impact: \[issue] in \[file] -> Fix: \[specific fix]

🟢 Low impact, optional: \[issue] in \[file] -> Fix: \[specific fix]

