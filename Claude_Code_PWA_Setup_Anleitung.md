# Claude Code System – Vollständige Schritt-für-Schritt-Anleitung für PWA-Entwicklung

> **Ziel:** Ein professionelles, token-effizientes Entwicklungssystem mit Claude Code aufbauen, das alle Schritte von der Idee bis zum Deployment für Progressive Web Apps abdeckt.
>
> **Hinweis zu den Datei-Inhalten:** Jede Datei wird in zwei Schritten angelegt. Zuerst ein **PowerShell-Befehl** zum Öffnen der Datei in Notepad, dann ein **Inhalt-Block** zum Hineinkopieren. Alles was du kopieren musst, steht in einem grauen Code-Kasten.

---

## Inhaltsverzeichnis

- [Schnellstart (empfohlen)](#schnellstart-empfohlen)

1. [Grundverständnis](#1-grundverständnis)
2. [Phase 1 – Software installieren](#2-phase-1--software-installieren)
3. [Phase 2 – Globale Konfiguration](#3-phase-2--globale-konfiguration)
4. [Phase 3 – Projekt-Vorlagen anlegen](#4-phase-3--projekt-vorlagen-anlegen)
5. [Phase 4 – Supabase einrichten (Datenbank)](#5-phase-4--supabase-einrichten-datenbank)
6. [Phase 5 – Vercel einrichten (Deployment)](#6-phase-5--vercel-einrichten-deployment)
7. [Phase 6 – Erstes PWA-Projekt starten](#7-phase-6--erstes-pwa-projekt-starten)
8. [Phase 7 – Stitch-Designs integrieren](#8-phase-7--stitch-designs-integrieren)
9. [Der vollständige Entwicklungs-Workflow](#9-der-vollständige-entwicklungs-workflow)
10. [Token-Optimierung im Alltag](#10-token-optimierung-im-alltag)
11. [Schnellreferenz](#11-schnellreferenz)

---

## Schnellstart (empfohlen)

> Wenn du zum ersten Mal einrichtest: Mache **Phase 1 und 2** (Software + Globale Konfiguration), dann springe direkt zu **Phase 6** (Erstes Projekt starten). Supabase (Phase 4) und Vercel (Phase 5) richtest du ein, sobald du die Keys brauchst – parallel zur Entwicklung.

**Optimale Reihenfolge für Accounts:**
1. **GitHub** zuerst (github.com) → wird von Supabase und Vercel für Login benötigt
2. **Supabase** zweiter (supabase.com → "Login with GitHub")
3. **Vercel** dritter (vercel.com → "Continue with GitHub")

---

## 1. Grundverständnis

Bevor du anfängst zu tippen, kurz das große Bild:

```
Was du baust:

~/.claude/                     <- Das "Gehirn" - gilt fuer ALLE Projekte
|-- CLAUDE.md                  <- Deine globalen Coding-Regeln
|-- settings.json              <- Sicherheitsregeln & Berechtigungen
+-- commands/                  <- Globale Shortcuts (explain, plan, quick-fix)

~/projekte/
|-- _vorlagen/                 <- Kopiervorlagen fuer neue Projekte
|   |-- CLAUDE-projekt.md
|   +-- commands/
|
+-- mein-projekt/              <- Ein konkretes Projekt
    |-- CLAUDE.md              <- Projektspezifische Regeln
    |-- .claude/
    |   |-- commands/          <- Projekt-Shortcuts (new-feature, deploy, ...)
    |   |-- references/        <- Stitch-Exports, Design-Tokens, API-Specs
    |   +-- settings.json      <- MCP-Server (Supabase-Direktverbindung)
    +-- src/                   <- Der eigentliche App-Code
```

**Wie das CLAUDE.md-System funktioniert (Kaskade):**

Claude liest beim Start alle CLAUDE.md-Dateien von oben nach unten und kombiniert sie:

```
Schicht 1: ~/.claude/CLAUDE.md       -> "Antworte auf Deutsch, nutze TypeScript..."
Schicht 2: ~/projekte/app/CLAUDE.md  -> "Tech-Stack: Next.js, Supabase, Farben: #a0bb3c..."
Schicht 3: (optional) frontend/CLAUDE.md -> "Nur shadcn/ui, keine eigenen CSS-Module"

-> Claude wendet ALLE drei Schichten kombiniert an.
-> Bei Widerspruechen gewinnt die tiefere (spezifischere) Datei.
```

---

## 2. Phase 1 – Software installieren

### Schritt 1.1 – Node.js installieren

Claude Code braucht Node.js Version 18 oder höher.

```powershell
node --version
```

Falls nicht vorhanden: [nodejs.org](https://nodejs.org) → LTS-Version herunterladen und installieren.

### Schritt 1.2 – Git installieren

```powershell
git --version
```

Falls nicht vorhanden: [git-scm.com](https://git-scm.com) → Windows-Version herunterladen.

Nach der Installation einmalig konfigurieren:

```powershell
git config --global user.name "Dein Name"
git config --global user.email "deine@email.de"
git config --global core.autocrlf input
```

### Schritt 1.3 – Claude Code installieren (nativer Windows-Weg)

```powershell
irm https://claude.ai/install.ps1 | iex
```

PowerShell danach **komplett schließen und neu öffnen**, dann testen:

```powershell
claude --version
```

### Schritt 1.4 – Claude Code authentifizieren

```powershell
mkdir "$env:USERPROFILE\test-claude"
cd "$env:USERPROFILE\test-claude"
claude
```

Beim ersten Start öffnet sich ein Browser zur Anmeldung mit deinem Claude-Account (claude.ai).

---

## 3. Phase 2 – Globale Konfiguration

Diese Dateien erstellst du **einmalig**. Sie gelten dann für alle zukünftigen Projekte.

### Schritt 2.1 – Ordnerstruktur erstellen

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\commands"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\projekte\_vorlagen\commands"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\projekte\_vorlagen\references"
```

### Schritt 2.2 – Globale CLAUDE.md erstellen

Datei öffnen:

```powershell
notepad "$env:USERPROFILE\.claude\CLAUDE.md"
```

Folgenden Inhalt hineinkopieren und speichern:

```
# Global Development Guidelines

## Communication
- Respond in German (Deutsch)
- Write ALL code, comments, commit messages, and variable names in English
- Be concise - avoid repeating information already in CLAUDE.md
- For complex tasks: Show the plan FIRST and wait for confirmation before implementing
- When uncertain about requirements: ASK instead of guessing

## Operating Environment
- OS: Windows with PowerShell
- Use PowerShell-compatible commands (no bash/unix-only syntax)
- Use forward slashes or path.join() in code (cross-platform compatibility)
- Line endings: LF (git config: core.autocrlf=input)

## Primary Tech Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript (strict mode) - NEVER plain JavaScript
- Styling: Tailwind CSS 4
- UI Components: shadcn/ui
- Database: Supabase (PostgreSQL + Auth + Storage + Realtime)
- State Management: Zustand
- Forms: React Hook Form + Zod validation
- Animations: Framer Motion
- Icons: Lucide React
- Notifications: Sonner (toast)
- Deployment: Vercel

## App Type: Progressive Web App (PWA)
- ALL projects are mobile-first PWAs
- Primary target: Smartphone browsers (iOS Safari, Android Chrome)
- Apps must feel native: Smooth animations, touch gestures, no browser-UI feel
- Desktop/PC layouts are ALWAYS optional and secondary
- Desktop adaptation only AFTER the mobile version is fully complete
- PWA requirements:
  - Web App Manifest (name, icons, theme color, display: standalone)
  - Service Worker for caching (offline functionality is NOT required)
  - Apple touch icon and meta tags for iOS
  - Splash screens for iOS/Android

## Code Quality Standards

### General
- DRY principle: No code duplication - extract shared logic into utils/hooks
- Single Responsibility: Each file/function does ONE thing
- Explicit over implicit: Clear naming, no magic numbers, no abbreviations
- Error handling is mandatory: Never silent fails, always user feedback via toast

### TypeScript
- strict mode always enabled
- No `any` type - use `unknown` and narrow with type guards
- Define interfaces for all component props
- Use Zod schemas for runtime validation (API inputs, forms)
- Export types from `src/lib/types/`

### React / Next.js
- Server Components as default - only add 'use client' when truly needed
- Named exports only (no `export default` except for Next.js pages/layouts)
- Components must be small: Max ~150 lines per file
- If a component exceeds 150 lines: Split into sub-components
- Custom hooks for reusable logic in `src/lib/hooks/`
- Images always via `next/image` with alt text
- Links always via `next/link`

### Styling (Tailwind)
- NO inline styles - Tailwind classes only
- NO CSS modules - Tailwind only
- Use `cn()` utility for conditional classes (from lib/utils)
- Mobile-first: Start with base styles, add `md:` and `lg:` for larger screens
- Consistent spacing: Use Tailwind's spacing scale (4, 8, 12, 16, 24, 32, 48, 64)
- Dark mode: Use shadcn/ui CSS variables (works automatically)

### File Size and Token Efficiency
- Max ~150 lines per component file
- Max ~200 lines per utility/lib file
- Split large features into multiple small files
- Keep imports minimal: Only import what you use
- When reading files: Only read files that are directly relevant

### Change Management
- Never change more than 5 files in a single response
- If more files need changes: Show the plan, implement in batches
- Each batch must be completable within a few minutes
- After each batch: Verify the app still builds (npm run build)

## File Naming Conventions
- Components: PascalCase.tsx (UserProfile.tsx)
- Hooks: use[Name].ts (useAuth.ts)
- Utilities: camelCase.ts (formatDate.ts)
- Types: camelCase.ts with PascalCase exports
- Zod schemas: camelCase.schema.ts (login.schema.ts)
- Constants: UPPER_SNAKE_CASE exports
- API routes: kebab-case folders (api/user-profile/route.ts)

## Standard Project Structure
src/
├── app/
│   ├── (app)/              # Authenticated routes (route group)
│   ├── (marketing)/        # Public pages: landing, pricing etc.
│   ├── api/                # API routes
│   ├── layout.tsx          # Root layout
│   └── manifest.ts         # PWA manifest
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── forms/              # Form components
│   ├── layout/             # Shell, Header, BottomNav, Sidebar
│   └── features/           # Feature-specific components
├── lib/
│   ├── supabase/           # Supabase client, queries, helpers
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript type definitions
│   ├── validations/        # Zod schemas
│   └── utils/              # Helper functions
├── styles/
│   └── globals.css         # Global styles + Tailwind directives
└── public/
    ├── icons/              # PWA icons (192x192, 512x512)
    └── screenshots/        # PWA install screenshots

## Git Conventions
- Commit message format: type(scope): description
- Types: feat, fix, docs, style, refactor, test, chore, pwa
- Language: English
- Examples:
  - feat(auth): add Google OAuth login
  - fix(tasks): resolve drag-drop not updating state
  - pwa(manifest): add iOS splash screens

## Security
- NEVER hardcode secrets, API keys, or passwords in code
- Always use .env.local for sensitive values
- .env.local MUST be in .gitignore
- Provide .env.example with placeholder values for documentation
- Supabase Row Level Security (RLS) must be enabled on all tables
- Validate ALL user inputs server-side (Zod schemas in API routes)

## Mobile-First Design Principles
- Touch targets: Minimum 44x44px for interactive elements
- Bottom navigation for primary app navigation (thumb-friendly)
- No hover-dependent interactions (hover is enhancement only)
- Smooth transitions: 200-300ms for UI feedback
- Safe area insets: Account for notch/dynamic island
- Font sizes: Minimum 16px for body text (prevents iOS zoom on input focus)
- Viewport: width=device-width, initial-scale=1, viewport-fit=cover
```

### Schritt 2.3 – Globale settings.json erstellen

Datei öffnen:

```powershell
notepad "$env:USERPROFILE\.claude\settings.json"
```

Folgenden Inhalt hineinkopieren und speichern:

```
{
  "autoUpdatesChannel": "latest",
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Edit",
      "MultiEdit",
      "Bash(npm run *)",
      "Bash(npx *)",
      "Bash(git *)",
      "Bash(node *)",
      "Bash(mkdir *)",
      "Bash(cp *)",
      "Bash(cat *)",
      "Bash(cd *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(del /f /s *)",
      "Bash(Format-*)",
      "Bash(Remove-Item -Recurse -Force C:*)",
      "Bash(npm publish*)",
      "Bash(npx supabase db reset --linked*)"
    ]
  }
}
```

> **Erklärung:** `allow` = was Claude ohne Nachfrage darf. `deny` = was Claude niemals tun darf (kein rekursives Löschen, kein versehentliches Publizieren, kein Datenbank-Reset in Produktion).

### Schritt 2.4 – Globale Commands erstellen

Diese drei Commands sind in **allen** Projekten verfügbar.

---

**Datei 1: explain.md**

Öffnen:

```powershell
notepad "$env:USERPROFILE\.claude\commands\explain.md"
```

Inhalt hineinkopieren:

```
# Explain: $ARGUMENTS

Explain $ARGUMENTS in simple terms for someone with basic programming knowledge.

Rules:
- Use a real-world analogy first
- Then show a short code example (max 15 lines)
- Max 10 sentences total
- Respond in German
- If $ARGUMENTS relates to code in the current project: Reference the actual file
```

---

**Datei 2: quick-fix.md**

Öffnen:

```powershell
notepad "$env:USERPROFILE\.claude\commands\quick-fix.md"
```

Inhalt hineinkopieren:

```
# Quick Fix: $ARGUMENTS

The following issue needs a quick fix: $ARGUMENTS

Rules:
- Read ONLY the file(s) directly related to the issue
- Do NOT refactor surrounding code
- Do NOT change more than 2 files
- Fix the specific issue, nothing else
- Run `npm run build` after to verify
- If the fix requires changing more than 2 files: STOP and explain why before proceeding
```

---

**Datei 3: plan.md**

Öffnen:

```powershell
notepad "$env:USERPROFILE\.claude\commands\plan.md"
```

Inhalt hineinkopieren:

```
# Plan: $ARGUMENTS

Create a development plan for: $ARGUMENTS

Do NOT write any code yet. Only create a plan.

## Output format

### 1. Summary
One paragraph: What will be built and why.

### 2. Files to create (new)
List each new file with:
- Path
- Purpose (one sentence)

### 3. Files to modify (existing)
List each existing file with:
- Path
- What changes (one sentence)

### 4. Dependencies
List any new npm packages needed with:
- Package name
- Why it is needed

### 5. Database changes
List any new tables or columns needed (if applicable).

### 6. Implementation order
Numbered steps. Group into batches of max 5 files each.
Mark which batch should be done first.

### 7. Open questions
List anything unclear that you need me to decide before starting.

Wait for my confirmation before implementing anything.
```

---

## 4. Phase 3 – Projekt-Vorlagen anlegen

Diese Vorlagen kopierst du für jedes neue Projekt – du musst sie nur noch anpassen, nicht neu erstellen.

### Schritt 3.1 – Projekt-CLAUDE.md Vorlage erstellen

Datei öffnen:

```powershell
notepad "$env:USERPROFILE\projekte\_vorlagen\CLAUDE-projekt.md"
```

Inhalt hineinkopieren:

```
# Project: [PROJECT NAME]

## Overview
- **Description**: [One sentence: What does this app do?]
- **Target audience**: [Who uses this?]
- **Design reference**: [Link to Stitch export or reference app]
- **Status**: [Planning / In Development / MVP Ready / Live]

## Core Features (MVP)
1. [ ] [Feature 1 - e.g. User Registration and Login]
2. [ ] [Feature 2 - e.g. Dashboard with overview]
3. [ ] [Feature 3 - e.g. Core functionality]
4. [ ] [Feature 4 - e.g. Settings / Profile]

## Feature Backlog (Post-MVP)
- [ ] Desktop-optimized layout
- [ ] [Additional feature]

## Design
- **Source**: Stitch AI export in `.claude/references/stitch-imports/`
- **Color palette**: [e.g. "Blue primary #3B82F6, dark backgrounds #1c1c1e"]
- **Style**: [e.g. "Clean, minimal" or "Bold, colorful"]
- **Brand colors**: [hex values]
- **Key screens**: [List main screens: Login, Dashboard, Detail View, Settings]

## App Navigation
Bottom Navigation (mobile):
- Tab 1: [Home/Dashboard] (icon: Home)
- Tab 2: [Feature] (icon: xxx)
- Tab 3: [Feature] (icon: xxx)
- Tab 4: [Profile/Settings] (icon: User)

## Database Schema

### Table: users (auto-created by Supabase Auth)
| Column     | Type      | Notes              |
|------------|-----------|--------------------|
| id         | uuid (PK) | auto-generated     |
| email      | text      | unique, from auth  |
| name       | text      |                    |
| avatar_url | text      | nullable           |
| created_at | timestamp | auto-generated     |

### Table: [your_table]
| Column     | Type      | Notes                    |
|------------|-----------|--------------------------|
| id         | uuid (PK) | auto-generated           |
| [column]   | [type]    | [notes]                  |
| user_id    | uuid (FK) | references users.id      |
| created_at | timestamp | auto-generated           |

### Row Level Security (RLS)
- users: Users can only read/update their own row
- [table]: Users can only CRUD their own rows (WHERE user_id = auth.uid())

## Supabase Configuration
- **Project URL**: Set in .env.local as NEXT_PUBLIC_SUPABASE_URL
- **Anon Key**: Set in .env.local as NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Auth providers**: [Email/Password, Google, Apple - list what you need]

## Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

## Available Commands
npm run dev       # Start dev server
npm run build     # Production build
npm run test      # Run tests
npm run lint      # Lint check

## Current Sprint / Focus
**Currently working on**: [e.g. "Feature 2 - Dashboard"]
**Blocked by**: [e.g. "Nothing"]
**Next up**: [e.g. "Feature 3 - Core functionality"]

## Known Issues
- [ ] [Bug description if any]

## Notes
- [e.g. "The Stitch design uses a custom font - replace with Inter"]
```

### Schritt 3.2 – Alle Projekt-Command-Vorlagen erstellen

Alle 10 Command-Dateien kommen in den Ordner `_vorlagen\commands\`. So gehst du vor:

**Schritt 3.2.0 – Alle Dateien auf einmal in Notepad öffnen:**

```powershell
notepad "$env:USERPROFILE\projekte\_vorlagen\commands\new-feature.md"
notepad "$env:USERPROFILE\projekte\_vorlagen\commands\new-page.md"
notepad "$env:USERPROFILE\projekte\_vorlagen\commands\new-component.md"
notepad "$env:USERPROFILE\projekte\_vorlagen\commands\new-api.md"
notepad "$env:USERPROFILE\projekte\_vorlagen\commands\debug.md"
notepad "$env:USERPROFILE\projekte\_vorlagen\commands\review.md"
notepad "$env:USERPROFILE\projekte\_vorlagen\commands\test.md"
notepad "$env:USERPROFILE\projekte\_vorlagen\commands\convert-stitch.md"
notepad "$env:USERPROFILE\projekte\_vorlagen\commands\optimize.md"
notepad "$env:USERPROFILE\projekte\_vorlagen\commands\deploy.md"
```

Es öffnen sich 10 leere Notepad-Fenster. Kopiere nun den Inhalt jeweils in das passende Fenster und speichere es.

---

**Datei: new-feature.md**

```
# New Feature: $ARGUMENTS

## Task
Implement the following feature: $ARGUMENTS

## Process

### Step 1: Plan (REQUIRED before coding)
Show me:
- New files to create (path + purpose)
- Existing files to modify (path + what changes)
- New dependencies needed (if any)
- Database changes needed (if any)
Then WAIT for my confirmation.

### Step 2: Types and Validation
- Create or extend types in src/lib/types/
- Create Zod schemas in src/lib/validations/ for any user input

### Step 3: Database layer (if needed)
- Create Supabase queries in src/lib/supabase/
- Create API routes in src/app/api/ if needed
- Add RLS policies for new tables

### Step 4: UI Components
- Create components in src/components/features/
- Use shadcn/ui base components
- Mobile-first: Design for 375px width first
- Add loading states (skeleton or spinner)
- Add error states with toast notifications
- Touch targets: Min 44x44px

### Step 5: Page integration
- Add or update page in src/app/
- Update navigation if needed (BottomNav tabs)

### Step 6: Verify
- Run npm run build and fix any errors
- Run npm run lint and fix any errors

## Rules
- Max 5 file changes per batch
- Each component file max 150 lines
- Follow ALL conventions from CLAUDE.md
- Use existing utils and hooks before creating new ones
- Every user action needs visual feedback (toast, loading state, animation)
```

---

**Datei: new-page.md**

```
# New Page: $ARGUMENTS

## Task
Create a new page or screen for: $ARGUMENTS

## Process

### Step 1: Route
Determine the correct path in src/app/:
- Authenticated page: src/app/(app)/[route]/page.tsx
- Public page: src/app/(marketing)/[route]/page.tsx

### Step 2: Page structure
Use Server Component (default) unless interactivity is needed.

Template for Server Component:

import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: '[Page Title] | [App Name]',
  description: '[Description]',
}

export default async function PageName() {
  return (
    <main className="flex flex-col min-h-screen p-4 pb-20">
      {/* pb-20 accounts for BottomNav */}
    </main>
  )
}

Add 'use client' ONLY when the page needs state, effects, or event handlers.

### Step 3: Design requirements
- Mobile viewport (375px) as primary design target
- Respect safe areas (notch, bottom bar)
- Skeleton loading states for async content
- Empty states when no data exists
- Pull-to-refresh if the page shows dynamic data

### Step 4: Navigation
- Add to BottomNav if it is a primary screen
- Add back button in header if it is a detail or sub-screen
- Update any links pointing to this page

### Step 5: Verify
- Run npm run build
- Check: Does the page work without JavaScript? (Server Component parts should)
```

---

**Datei: new-component.md**

```
# New Component: $ARGUMENTS

## Task
Create a reusable component: $ARGUMENTS

## Template

/**
 * [Brief description of what this component does]
 * @example <ComponentName prop1="value" onAction={() => {}} />
 */
import { cn } from '@/lib/utils'

interface ComponentNameProps {
  className?: string
  // Define all props here
}

export function ComponentName({ className }: ComponentNameProps) {
  return (
    <div className={cn('', className)}>
      {/* Content */}
    </div>
  )
}

## Rules
- Named export (no default export)
- Props interface explicitly defined
- cn() for conditional classes
- Max 150 lines. If larger: split into sub-components
- Accessibility: Appropriate aria labels and roles
- Touch-friendly sizing (min 44x44px for interactive elements)

## File location
- Generic UI element: src/components/ui/
- Form component: src/components/forms/
- Layout element (Header, Nav, Shell): src/components/layout/
- Feature-specific: src/components/features/
```

---

**Datei: new-api.md**

```
# New API Route: $ARGUMENTS

## Task
Create an API route for: $ARGUMENTS

## Template
Place at: src/app/api/[route]/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // 1. Auth check
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Validate input
    const body = await request.json()
    const validated = Schema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // 3. Business logic
    const { data, error } = await supabase
      .from('[table]')
      .insert({ ...validated.data, user_id: user.id })
      .select()
      .single()
    if (error) throw error

    // 4. Return response
    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    console.error('[ROUTE_NAME]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

## Rules
- ALWAYS validate input with Zod
- ALWAYS check authentication first
- ALWAYS handle errors with try-catch
- ALWAYS return proper HTTP status codes (200, 201, 400, 401, 404, 500)
- NEVER expose internal error details to the client
- Log errors server-side with console.error
```

---

**Datei: debug.md**

```
# Debug: $ARGUMENTS

## Problem
$ARGUMENTS

## Process (follow strictly in this order)

### Step 1: Reproduce
- Identify the relevant files (max 5)
- Read ONLY those files
- Understand: What SHOULD happen vs what DOES happen?

### Step 2: Diagnose
Run these diagnostics:
- npx tsc --noEmit
- npm run lint
- npm run build
Check browser console errors if applicable.

### Step 3: Hypothesize
State your hypothesis clearly in this format:
"The bug is caused by [X] in [file] at [location] because [reason]."
Show me the hypothesis and WAIT for my confirmation before fixing.

### Step 4: Fix
- Change ONLY what is necessary to fix the bug
- Do NOT refactor other code at the same time
- Max 3 files changed

### Step 5: Verify
- Run npm run build (must succeed)
- Run npm run test (must pass)
- Explain what was wrong and why the fix works (2-3 sentences in German)
```

---

**Datei: review.md**

```
# Code Review

## Task
Review the current project state for issues and report findings.
Do NOT fix anything. Only report. I will decide what to fix.

## Checklist

### Critical (must fix before deploy)
- TypeScript errors: run npx tsc --noEmit
- Build errors: run npm run build
- Hardcoded secrets or API keys in any file
- Missing error handling on API calls or Supabase queries
- Missing input validation on API routes
- Missing RLS policies on Supabase tables

### Important (should fix soon)
- Files exceeding 150 lines (components) or 200 lines (utils)
- Code duplication (same logic in multiple places)
- Missing loading states on async operations
- Missing error states and empty states
- Unused imports or variables
- Console.log statements left in production code

### Mobile PWA specific
- Touch targets smaller than 44x44px
- Hover-only interactions without touch alternative
- Text smaller than 16px on mobile
- Content hidden behind notch or safe areas
- Bottom content hidden behind BottomNav (needs pb-20 or similar)
- Horizontal scroll on mobile viewport (375px)

### Nice to have
- Missing JSDoc comments on exported functions
- Missing aria labels on interactive elements
- Server Components unnecessarily marked as client components

## Output format
🔴 Critical: [issue] in [file] -> Fix: [specific fix]
🟡 Important: [issue] in [file] -> Fix: [specific fix]
🟢 Nice-to-have: [issue] in [file] -> Fix: [specific fix]
```

---

**Datei: test.md**

```
# Write Tests: $ARGUMENTS

## Target
Write tests for: $ARGUMENTS

## Rules
- Framework: Vitest
- File location: Next to the source file as [name].test.ts or [name].test.tsx
- Cover: Happy path, error cases, and edge cases
- Do NOT test pure UI components with no logic
- Do NOT test Next.js pages (those need e2e tests)
- Do NOT test third-party library behavior

## Template

import { describe, it, expect } from 'vitest'

describe('[function or component name]', () => {
  describe('happy path', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange: Set up test data
      // Act: Call the function
      // Assert: Check the result
    })
  })

  describe('error cases', () => {
    it('should [expected behavior] when [invalid input]', () => {
      // Arrange
      // Act
      // Assert
    })
  })

  describe('edge cases', () => {
    it('should handle [edge case description]', () => {
      // Arrange
      // Act
      // Assert
    })
  })
})

## Priority
1. Zod schemas: Test with valid AND invalid data
2. Utility functions: Test all branches and return values
3. Zustand stores: Test actions and state changes
4. Custom hooks: Test with renderHook from @testing-library/react
```

---

**Datei: convert-stitch.md**

```
# Convert Stitch Import: $ARGUMENTS

## Source
Read the Stitch export file at: .claude/references/stitch-imports/$ARGUMENTS

## Process

### Step 1: Analyze (REQUIRED before converting)
Tell me:
- How many distinct sections or components are in the design?
- Which shadcn/ui components can replace custom elements?
- What colors, fonts, and spacing does the design use?
- What needs to change to make it mobile-first?
Then WAIT for my confirmation.

### Step 2: HTML to React Components
- Each visual section becomes its own component file
- Place in appropriate folder (features/, layout/, ui/)
- TypeScript with Props interfaces
- Named exports only

### Step 3: CSS to Tailwind
- Convert ALL inline styles and CSS classes to Tailwind utility classes
- Map custom colors to CSS variables in globals.css:
  --primary: [hsl value];
  --secondary: [hsl value];
- Use shadcn/ui color tokens where possible (bg-primary, text-muted-foreground, etc.)

### Step 4: Replace elements with shadcn/ui
Apply these replacements:
- button elements -> shadcn Button
- input elements -> shadcn Input with Label
- Custom card divs -> shadcn Card, CardHeader, CardContent
- Modals and popups -> shadcn Dialog
- Dropdowns -> shadcn DropdownMenu
- Toggle switches -> shadcn Switch
- Tab interfaces -> shadcn Tabs
- Accordions and FAQs -> shadcn Accordion
- Alert messages -> sonner toast

### Step 5: Make it mobile-first
- Set base styles for 375px viewport width
- Ensure all touch targets are min 44x44px
- Add md: and lg: prefixes ONLY for tablet and desktop enhancements

### Step 6: Add interactivity
- Loading states where data will be fetched
- Framer Motion entrance animations (subtle fade-up, not flashy)
- Touch feedback on buttons and cards: active:scale-[0.98] transition-transform
- Smooth transitions: transition-all duration-200

### Step 7: Integrate into project
- Place files in correct project folders
- Connect to navigation if needed
- Wire up to Supabase data or add TODO comments for data connection later

## Output
After conversion, list:
- All files created and their locations
- shadcn/ui components that need to be installed (npx shadcn@latest add [name])
- Any manual adjustments still needed
```

---

**Datei: optimize.md**

```
# Optimize

## Task
Analyze the current project for performance and code quality.
Do NOT implement changes. Only report findings. I will decide what to fix.

## Checks (run in this order)

### 1. Build check
Run: npm run build
Report: Build time, any warnings, output size.

### 2. File size audit
Find all files exceeding limits:
- Component files over 150 lines: Must be split
- Utility and lib files over 200 lines: Must be split
- Single imports pulling in entire large libraries

### 3. Client vs Server components
List all files that contain 'use client'.
For each file: Is 'use client' actually needed?
Could any of them be converted to Server Components?

### 4. Bundle impact
Check for heavy dependencies in package.json:
- Are there lighter alternatives for any package?
- Are we importing entire libraries when we only use one function?
  Example: import _ from 'lodash' should be import debounce from 'lodash/debounce'

### 5. Image optimization
- Any img tags that should be next/image Image component?
- Any images missing width and height attributes?
- Any images missing alt text?

### 6. PWA audit
- Is manifest.ts complete with name, icons, theme_color, display standalone, start_url?
- Are all meta tags set: viewport, theme-color, apple-mobile-web-app-capable?
- Are PWA icons present in public/icons/ at 192x192 and 512x512?
- Is there an apple-touch-icon?

## Output format
Prioritized list grouped by impact:

🔴 High impact, easy fix: [issue] in [file] -> Fix: [specific fix]
🟡 Medium impact: [issue] in [file] -> Fix: [specific fix]
🟢 Low impact, optional: [issue] in [file] -> Fix: [specific fix]
```

---

**Datei: deploy.md**

```
# Deploy Checklist

## Task
Run through the complete deployment checklist before pushing to production.

## Pre-deployment checks (run ALL of these)

### 1. Code quality
Run these commands and report results:
- npx tsc --noEmit (must show zero errors)
- npm run lint (must show zero errors)
- npm run build (must complete successfully)
- npm run test (all tests must pass)

If ANY of these fail: STOP and report the errors. Do not proceed.

### 2. Environment variables
- All environment variables documented in .env.example?
- No .env.local file committed to git? (check .gitignore)
- Remind me to set production values in Vercel dashboard

### 3. Security
- No hardcoded secrets or API keys in any source file?
- Supabase RLS enabled on all tables?
- All API routes validate input with Zod?
- All API routes check authentication?

### 4. PWA readiness
- manifest.ts exists with all required fields (name, short_name, icons, theme_color, background_color, display standalone, start_url)?
- Icons at public/icons/icon-192x192.png and public/icons/icon-512x512.png?
- layout.tsx has apple-touch-icon link tag?
- layout.tsx has theme-color meta tag?
- viewport meta tag includes viewport-fit=cover?

### 5. Git state
- All changes committed?
- Current branch is main?
- No merge conflicts?

## Deploy steps
If all checks pass:

git add .
git commit -m "chore: prepare for deployment"
git push origin main

Vercel will auto-deploy from main branch.

## Post-deployment
Remind me to manually verify:
- Visit the production URL and check if it loads
- Test login and signup flow on production
- Test on a real phone (iOS Safari and Android Chrome)
- Try adding to home screen to verify PWA works
- Check Vercel dashboard for any runtime errors
```

### Schritt 3.3 – Projekt-Settings-Vorlage erstellen

Datei öffnen:

```powershell
notepad "$env:USERPROFILE\projekte\_vorlagen\project-settings.json"
```

Inhalt hineinkopieren:

```
{
  "permissions": {
    "allow": [
      "Bash(npm run dev)",
      "Bash(npm run build)",
      "Bash(npm run test)",
      "Bash(npm run lint)",
      "Bash(npx supabase *)",
      "Bash(npx shadcn@latest *)"
    ]
  },
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_URL": "PLATZHALTER - hier deine Supabase Project URL eintragen",
        "SUPABASE_SERVICE_ROLE_KEY": "PLATZHALTER - hier deinen Service Role Key eintragen"
      }
    }
  }
}
```

> **MCP-Server erklärt:** Mit dem Supabase MCP kann Claude direkt mit deiner Datenbank sprechen – Tabellen erstellen, Daten abfragen – ohne dass du SQL manuell kopieren musst. Die echten Schlüssel trägst du ein, sobald du ein Supabase-Projekt erstellt hast (Phase 4).

---

## 5. Phase 4 – Supabase einrichten (Datenbank)

### Schritt 4.1 – Supabase Account erstellen

1. Gehe zu [supabase.com](https://supabase.com)
2. „Start your project" → mit GitHub anmelden
3. Du bist jetzt im Supabase Dashboard

### Schritt 4.2 – Neues Supabase-Projekt anlegen

1. Im Dashboard: **„New Project"** klicken
2. Projektname eingeben (z.B. `meine-pwa-app`)
3. Datenbank-Passwort vergeben (sicher aufschreiben!)
4. Region wählen: **Frankfurt (eu-central-1)**
5. „Create new project" klicken und ~2 Minuten warten

### Schritt 4.3 – API-Keys notieren

Im Supabase Dashboard: **Project Settings → API**

Notiere dir:
- **Project URL** → z.B. `https://abcdefghijkl.supabase.co`
- **anon public key** → langer String beginnend mit `eyJ...`
- **service_role key** → anderer langer String (NUR lokal verwenden, nie im Frontend-Code!)

### Schritt 4.4 – Supabase CLI installieren

```powershell
npx supabase login
```

Das öffnet einen Browser zur Authentifizierung. (Keine globale Installation nötig – npx lädt supabase bei Bedarf.)

### Schritt 4.5 – MCP-Server konfigurieren (pro Projekt)

In der `.claude/settings.json` deines Projekts (nicht die globale!):

```
{
  "permissions": {
    "allow": [
      "Bash(npm run dev)",
      "Bash(npm run build)",
      "Bash(npm run test)",
      "Bash(npm run lint)",
      "Bash(npx supabase *)",
      "Bash(npx shadcn@latest *)"
    ]
  },
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_URL": "https://abcdefghijkl.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "dein-service-role-key-hier"
      }
    }
  }
}
```

> **Wichtig:** Diese settings.json sollte in der `.gitignore` stehen, da sie echte API-Keys enthält.

---

## 6. Phase 5 – Vercel einrichten (Deployment)

### Schritt 5.1 – GitHub Account erstellen (falls nicht vorhanden)

[github.com](https://github.com) → kostenlosen Account erstellen.

### Schritt 5.2 – Vercel Account erstellen

1. [vercel.com](https://vercel.com) → „Sign Up" → „Continue with GitHub"
2. GitHub-Berechtigungen bestätigen

### Schritt 5.3 – GitHub-Repository für dein Projekt erstellen

```powershell
# Im Projektordner (muss bereits existieren):
git init
git add .
git commit -m "feat: initial commit"
```

Dann auf github.com ein neues leeres Repository anlegen (ohne README, ohne .gitignore), dann:

```powershell
git remote add origin https://github.com/DEIN-USERNAME/DEIN-REPO.git
git branch -M main
git push -u origin main
```

> **Hinweis:** Falls der Projektordner noch leer ist, erstelle zuerst eine README.md als Platzhalter, bevor du commitest:
> ```powershell
> New-Item -ItemType File -Name "README.md"
> Add-Content README.md "# Projektname"
> git add .
> git commit -m "feat: initial commit"
> git push -u origin main
> ```

### Schritt 5.4 – Vercel mit GitHub verbinden

> **Hinweis:** Vercel erkennt Next.js automatisch anhand der `next.config.ts` Datei, die Claude später beim Projekt-Setup anlegt. Du kannst das Repo bereits jetzt in Vercel importieren – Vercel wartet einfach auf den ersten richtigen Push mit Next.js Code.

1. Im Vercel Dashboard: **„Add New → Project"**
2. Dein GitHub-Repository auswählen
3. Framework: **Next.js** (wird nach dem ersten Push automatisch erkannt)
4. **Environment Variables** eintragen (kannst du auch später noch nachtragen):
   - `NEXT_PUBLIC_SUPABASE_URL` → deine Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → dein Supabase Anon Key
5. „Deploy" klicken

Ab jetzt: Jedes `git push origin main` löst automatisches Deployment aus.

---

## 7. Phase 6 – Erstes PWA-Projekt starten

> **Hinweis:** Hast du den Projektordner bereits mit `git init` angelegt (z.B. aus Phase 5), überspringe den `# ODER`-Block in Schritt 6.1 und navigiere einfach in deinen vorhandenen Ordner.

### Schritt 6.1 – In den Projektordner navigieren und Vorlagen kopieren

```powershell
# In den bereits vorhandenen Projektordner navigieren:
Set-Location "C:\Users\DEIN-NAME\PFAD-ZU\DEIN-PROJEKT"

# ODER: Neuen Projektordner erstellen (nur wenn noch nicht vorhanden):
# Set-Location "$env:USERPROFILE\projekte"
# New-Item -ItemType Directory -Name "meine-app"
# Set-Location "meine-app"
# git init

# .claude Ordner anlegen
New-Item -ItemType Directory -Force -Path ".claude\commands"
New-Item -ItemType Directory -Force -Path ".claude\references\stitch-imports"

# Vorlagen kopieren
Copy-Item "$env:USERPROFILE\projekte\_vorlagen\commands\*" -Destination ".claude\commands\"
Copy-Item "$env:USERPROFILE\projekte\_vorlagen\project-settings.json" -Destination ".claude\settings.json"
Copy-Item "$env:USERPROFILE\projekte\_vorlagen\CLAUDE-projekt.md" -Destination "CLAUDE.md"
```

### Schritt 6.2 – CLAUDE.md für das Projekt anpassen

```powershell
notepad CLAUDE.md
```

Trage ein: Projektname, geplante Features, Farben, Navigation-Tabs.

### Schritt 6.3 – Claude starten und Projekt aufsetzen lassen

```powershell
claude
```

Erster Prompt in Claude Code:

```
Set up a complete Next.js 15 PWA project with:
1. Next.js 15 with App Router and TypeScript strict mode
2. Tailwind CSS 4 and shadcn/ui (initialize with default settings)
3. Supabase client library (@supabase/ssr and @supabase/supabase-js)
4. Zustand for state management
5. React Hook Form + Zod for forms
6. Framer Motion for animations
7. Lucide React for icons
8. Sonner for toast notifications
9. Vitest for testing
10. ESLint + Prettier configuration
11. Folder structure as defined in CLAUDE.md
12. .env.local file (with placeholders) and .env.example
13. .gitignore (including .env.local and .claude/settings.json)
14. PWA manifest.ts with placeholders
15. Root layout.tsx with PWA meta tags (viewport-fit=cover, theme-color, apple-touch-icon)
16. BottomNav component placeholder in src/components/layout/
```

### Schritt 6.4 – Supabase-Keys eintragen

In `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...dein-anon-key...
```

In `.claude/settings.json` die Platzhalter durch echte Keys ersetzen.

### Schritt 6.5 – Entwicklungsserver starten

```powershell
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

---

## 8. Phase 7 – Stitch-Designs integrieren

### Workflow: Stitch → Claude Code → PWA

```
1. Stitch: Design auf stitch.withgoogle.com generieren
2. Stitch-Code kopieren -> in .claude/references/stitch-imports/dateiname.html speichern
3. In Claude Code: /project:convert-stitch dateiname.html
4. Claude konvertiert zu React + Tailwind + shadcn/ui
5. Mit Follow-up-Prompts verfeinern
```

### Stitch-Output speichern

```powershell
notepad ".claude\references\stitch-imports\login-screen.html"
```

Den kompletten Stitch-Code hineinkopieren und speichern.

### In Claude Code konvertieren

```
/project:convert-stitch login-screen.html
```

---

## 9. Der vollständige Entwicklungs-Workflow

### Für jede neue Session

```powershell
cd $env:USERPROFILE\projekte\meine-app
claude
```

### Täglich verwendete Commands

| Was du tippst | Was passiert |
|---|---|
| `/project:new-feature Benutzer-Profil-Seite` | Claude plant + implementiert |
| `/project:new-page Einstellungen` | Claude erstellt die Route |
| `/project:new-component AvatarCard` | Claude erstellt die Komponente |
| `/project:new-api Update Profil` | Claude erstellt die API-Route |
| `/project:debug Login funktioniert nicht` | Claude analysiert und fixt |
| `/project:review` | Claude prüft alles, fixt nichts |
| `/project:test Auth-Logik` | Claude schreibt Vitest-Tests |
| `/project:convert-stitch dashboard.html` | Claude konvertiert das Design |
| `/project:optimize` | Claude analysiert Performance |
| `/project:deploy` | Claude prüft alles vor dem Push |
| `/explain React Server Components` | Claude erklärt auf Deutsch |
| `/quick-fix TypeError in UserProfile.tsx` | Claude fixt minimal |
| `/plan Dark Mode hinzufügen` | Claude plant ohne Code |

### Der Phasen-Workflow für ein komplettes Feature

```
1. /plan [Feature]           -> Plan erstellen, du bestätigst
2. convert-stitch            -> Design importieren (falls vorhanden)
3. /new-feature [Feature]    -> Implementieren (max 5 Dateien pro Batch)
4. Im Browser auf Smartphone testen
5. /review                   -> Code Review
6. /project:test [Feature]   -> Tests schreiben
7. /compact                  -> Tokens sparen (alle ~15 Nachrichten)
8. git commit                -> Commit erstellen
9. /deploy                   -> Vor dem Push zu main
```

---

## 10. Token-Optimierung im Alltag

| Strategie | Befehl | Ersparnis |
|---|---|---|
| Commands statt Wiederholungen | `/project:new-component ...` statt alles ausschreiben | ~80% |
| Kontext zusammenfassen | `/compact` alle ~15 Nachrichten | ~50-70% |
| Kontext leeren bei Themenwechsel | `/clear` | 100% des alten Kontexts |
| Verbrauch prüfen | `/cost` | – |

**Wann /clear vs /compact:**

| Situation | Befehl |
|---|---|
| Langer Chat, gleiches Thema | `/compact` |
| Wechsel zu einem anderen Feature | `/clear` |
| Bug behoben, nächstes Feature | `/clear` |
| Mitten in einer Implementierung | nichts tun |

**Präzise Prompts sparen Tokens:**

```
SCHLECHT: "Mach das Login besser"

GUT: "In src/components/features/LoginForm.tsx, fuege unter dem
     Passwort-Feld einen 'Passwort vergessen' Link hinzu,
     der zu /forgot-password navigiert"
```

---

## 11. Schnellreferenz

### Einmalige Setup-Checkliste

```
[ ] Node.js 18+ installieren
[ ] Git installieren und konfigurieren
[ ] Claude Code installieren (irm https://claude.ai/install.ps1 | iex)
[ ] PowerShell neu starten, claude --version testen
[ ] Claude authentifizieren (claude in einem Testordner starten)
[ ] ~/.claude/CLAUDE.md erstellen (globale Regeln)
[ ] ~/.claude/settings.json erstellen (Berechtigungen)
[ ] ~/.claude/commands/ befullen (explain.md, quick-fix.md, plan.md)
[ ] ~/projekte/_vorlagen/ erstellen (CLAUDE-projekt.md + 10 commands)
[ ] GitHub Account erstellen (github.com)
[ ] Supabase Account erstellen (supabase.com, Login mit GitHub)
[ ] Vercel Account erstellen (vercel.com, Login mit GitHub)
```

### Checkliste fuer jedes neue Projekt

```
[ ] Projektordner erstellen
[ ] git init
[ ] Vorlagen kopieren (commands/, settings.json, CLAUDE.md)
[ ] CLAUDE.md anpassen (Projektname, Features, Farben)
[ ] claude starten und Setup-Prompt ausfuehren
[ ] Supabase-Projekt anlegen und API-Keys notieren
[ ] .env.local mit Supabase-Keys befullen
[ ] .claude/settings.json mit echten Keys befullen
[ ] GitHub-Repository erstellen und pushen
[ ] Vercel mit GitHub verbinden
[ ] Environment Variables in Vercel eintragen
```

### Dateistruktur in Kuerze

```
~/.claude/
|-- CLAUDE.md               Globale Regeln (Deutsch, TypeScript, PWA, etc.)
|-- settings.json           Berechtigungen (allow/deny fuer Bash-Befehle)
+-- commands/
    |-- explain.md          /explain [Begriff]
    |-- quick-fix.md        /quick-fix [Problem]
    +-- plan.md             /plan [Feature]

~/projekte/_vorlagen/
|-- CLAUDE-projekt.md       Vorlage fuer neue Projekte
+-- commands/
    |-- new-feature.md      /project:new-feature [Name]
    |-- new-page.md         /project:new-page [Name]
    |-- new-component.md    /project:new-component [Name]
    |-- new-api.md          /project:new-api [Name]
    |-- debug.md            /project:debug [Problem]
    |-- review.md           /project:review
    |-- test.md             /project:test [Ziel]
    |-- convert-stitch.md   /project:convert-stitch [Datei]
    |-- optimize.md         /project:optimize
    +-- deploy.md           /project:deploy
```

---

> **Tipp zum Einstieg:** Fuehre zuerst Phase 1 und 2 durch. Sobald `claude --version` funktioniert und die globale CLAUDE.md existiert, kannst du mit Phase 6 ein erstes Projekt starten. Supabase (Phase 4) und Vercel (Phase 5) richtest du parallel dazu ein, wenn du die Keys benotigst.
