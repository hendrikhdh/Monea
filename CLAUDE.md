@AGENTS.md

# Project: Monea

## Overview
- **Description**: A mobile-first finance planner and budget tracker app with transaction management, category organization, and dashboard analytics.
- **Target audience**: Young ambitious women with a high aesthetic standard and a preference for a luxurious, clean, and elegant app experience.
- **Design reference**: Stitch AI export in `.claude/references/stitch-imports/` (to be added)
- **Status**: MVP Complete

## Core Features (MVP)
1. [x] Authentication – Email/Password, Google OAuth, Magic Link, Apple (placeholder)
2. [x] Transactions – Add, view, edit, delete income/expense entries
3. [x] Categories – Add, edit, delete custom categories (with icon and color)
4. [x] Dashboard/Home – Total balance overview and monthly balance summary

## Feature Backlog (Post-MVP)
- [ ] Budget planning per category per month
- [ ] Analytics and charts (spending trends, category breakdowns)
- [ ] Recurring transactions
- [ ] CSV/PDF export
- [ ] Desktop-optimized layout
- [ ] Multi-currency support

## Design
- **Source**: Stitch AI export in `.claude/references/stitch-imports/` (not yet available)
- **Vibe**: Luxury, minimal, editorial – think clean whitespace, refined typography, premium feel
- **Color palette**: TBD via Stitch export – expected soft neutrals (cream, off-white) with a muted accent (dusty rose, sage, or champagne gold)
- **Style**: Clean and minimal, no clutter, every element intentional
- **Key screens**: Login, Dashboard/Home, Transaction List, Add Transaction, Settings

## App Navigation

```text
Bottom Navigation (mobile):
├── Tab 1: Home / Dashboard   (icon: Home)
├── Tab 2: Transactions       (icon: ArrowUpDown)
└── Tab 3: Settings           (icon: Settings)
```

## Database Schema

### Table: users (auto-created by Supabase Auth)
| Column     | Type      | Notes             |
|------------|-----------|-------------------|
| id         | uuid (PK) | auto-generated    |
| email      | text      | unique, from auth |
| name       | text      |                   |
| avatar_url | text      | nullable          |
| created_at | timestamp | auto-generated    |

### Table: categories
| Column     | Type      | Notes                                      |
|------------|-----------|--------------------------------------------|
| id         | uuid (PK) | auto-generated                             |
| user_id    | uuid (FK) | references users.id                        |
| name       | text      | e.g. "Groceries", "Salary"                 |
| icon       | text      | Lucide icon name, e.g. "ShoppingCart"      |
| color      | text      | Hex value, e.g. "#a0bb3c"                  |
| type       | text      | "income" \| "expense" \| "both"            |
| created_at | timestamp | auto-generated                             |

### Table: transactions
| Column      | Type      | Notes                                    |
|-------------|-----------|------------------------------------------|
| id          | uuid (PK) | auto-generated                           |
| user_id     | uuid (FK) | references users.id                      |
| category_id | uuid (FK) | references categories.id, nullable       |
| amount      | numeric   | always positive – type determines sign   |
| type        | text      | "income" \| "expense"                    |
| date        | date      | transaction date (not created_at)        |
| note        | text      | optional description                     |
| created_at  | timestamp | auto-generated                           |

### Row Level Security (RLS)
- users: Users can only read/update their own row
- categories: Users can only CRUD their own rows (WHERE user_id = auth.uid())
- transactions: Users can only CRUD their own rows (WHERE user_id = auth.uid())

## Supabase Configuration
- **Project URL**: Set in .env.local as NEXT_PUBLIC_SUPABASE_URL
- **Anon Key**: Set in .env.local as NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Auth providers**: Email/Password, Google, Apple

## Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Available Commands
```powershell
npm run dev       # Start dev server (Turbopack) – NOT for iPhone testing!
npm run build     # Production build
npm run start     # Production server – USE THIS for iPhone testing
npm run test      # Run tests
npm run lint      # Lint check
```

## Current Sprint / Focus
**Currently working on**: UI polish, iPhone optimization
**Blocked by**: Nothing
**Next up**: Default categories on signup, Goals feature (DB + CRUD)

## Known Issues
- Turbopack dev mode (`npm run dev`) does not hydrate on iPhone — buttons visible but not clickable. Use `npm run build && npm run start` for mobile testing.
- Apple Sign-In is a placeholder (not yet configured)

## iOS Safari Pitfalls
- NEVER use inline `opacity: 0` with CSS `animation-fill-mode: forwards` — breaks touch events on iOS. Use `fill-mode: both` instead.
- NEVER use `autoFocus` on inputs inside Bottom Sheets — iOS keyboard pushes content offscreen.
- Always add `will-change: transform` on animated overlay containers for 120Hz ProMotion.
- Bottom Sheet content must fit in ~750px (iPhone 13+ viewport) without scrolling.

## Notes
- Design is implemented from Stitch AI export — warm luxury palette with extended tokens
- The app should feel premium and native – smooth animations, no browser-like UI
- Luxury feel is a core requirement, not an afterthought
- Fonts: Plus Jakarta Sans (heading), Be Vietnam Pro (body), Fraunces (display serif)
- Organic shapes system: 10 blob border-radius shapes, stable per category ID hash
