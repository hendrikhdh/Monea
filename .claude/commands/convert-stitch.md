\# Convert Stitch Import: $ARGUMENTS



\## Source

Read the Stitch export file at: .claude/references/stitch-imports/$ARGUMENTS



\## Process



\### Step 1: Analyze (REQUIRED before converting)

Tell me:

\- How many distinct sections or components are in the design?

\- Which shadcn/ui components can replace custom elements?

\- What colors, fonts, and spacing does the design use?

\- What needs to change to make it mobile-first?

Then WAIT for my confirmation.



\### Step 2: HTML to React Components

\- Each visual section becomes its own component file

\- Place in appropriate folder (features/, layout/, ui/)

\- TypeScript with Props interfaces

\- Named exports only



\### Step 3: CSS to Tailwind

\- Convert ALL inline styles and CSS classes to Tailwind utility classes

\- Map custom colors to CSS variables in globals.css:

&#x20; --primary: \[hsl value];

&#x20; --secondary: \[hsl value];

\- Use shadcn/ui color tokens where possible (bg-primary, text-muted-foreground, etc.)



\### Step 4: Replace elements with shadcn/ui

Apply these replacements:

\- button elements -> shadcn Button

\- input elements -> shadcn Input with Label

\- Custom card divs -> shadcn Card, CardHeader, CardContent

\- Modals and popups -> shadcn Dialog

\- Dropdowns -> shadcn DropdownMenu

\- Toggle switches -> shadcn Switch

\- Tab interfaces -> shadcn Tabs

\- Accordions and FAQs -> shadcn Accordion

\- Alert messages -> sonner toast



\### Step 5: Make it mobile-first

\- Set base styles for 375px viewport width

\- Ensure all touch targets are min 44x44px

\- Add md: and lg: prefixes ONLY for tablet and desktop enhancements



\### Step 6: Add interactivity

\- Loading states where data will be fetched

\- Framer Motion entrance animations (subtle fade-up, not flashy)

\- Touch feedback on buttons and cards: active:scale-\[0.98] transition-transform

\- Smooth transitions: transition-all duration-200



\### Step 7: Integrate into project

\- Place files in correct project folders

\- Connect to navigation if needed

\- Wire up to Supabase data or add TODO comments for data connection later



\## Output

After conversion, list:

\- All files created and their locations

\- shadcn/ui components that need to be installed (npx shadcn@latest add \[name])

\- Any manual adjustments still needed

