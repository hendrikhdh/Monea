@AGENTS.md

# Project: Monea

## Overview
- **Description**: A mobile-first finance planner and budget tracker app with transaction management, category organization, and dashboard analytics.
- **Target audience**: Young ambitious women with a high aesthetic standard and a preference for a luxurious, clean, and elegant app experience.
- **Design reference**: Stitch AI export in `.claude/references/stitch-imports/` (to be added)
- **Status**: MVP Complete

## Core Features (MVP+)
1. [x] Authentication – Email/Password, Google OAuth, Magic Link, Apple (placeholder)
2. [x] Transactions – Income, Expense and **Savings Deposits** (3rd type, linked to a Goal, balance-neutral)
3. [x] Categories – Add, edit, delete custom categories (with icon and color)
4. [x] Dashboard/Home – Total balance overview and monthly balance summary
5. [x] Goals – CRUD, image upload + cropper, progress auto-computed from savings_deposit transactions via DB trigger
6. [x] Budgets – per-category general budgets with spent indicator
7. [x] Analytics – Recharts, period chips, category filters (excludes savings_deposit)
8. [x] Recurring Transactions – auto-processed daily, supports all three types
9. [x] Portfolio – manual accounts + frozen monthly snapshots
10. [x] CSV Export – Excel-DE compatible

## Feature Backlog (Post-MVP)
- [ ] Savings analytics (deposits over time per goal, forecast)
- [ ] PDF export
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
├── Tab 1: Dashboard      (icon: LayoutDashboard)
├── Tab 2: Transactions   (icon: Receipt)
├── Tab 3: Analytics      (icon: BarChart3)
└── Tab 4: Goals          (icon: Trophy)

Settings via avatar/menu, not in BottomNav.
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
| Column      | Type      | Notes                                                     |
|-------------|-----------|-----------------------------------------------------------|
| id          | uuid (PK) | auto-generated                                            |
| user_id     | uuid (FK) | references users.id                                       |
| category_id | uuid (FK) | references categories.id, nullable                        |
| goal_id     | uuid (FK) | references goals.id, ON DELETE CASCADE, nullable          |
| amount      | numeric   | always positive – type determines sign                    |
| type        | text      | "income" \| "expense" \| "savings_deposit"                |
| date        | date      | transaction date (not created_at)                         |
| note        | text      | optional description                                      |
| created_at  | timestamp | auto-generated                                            |

CHECK constraint: type='savings_deposit' ⇔ goal_id NOT NULL AND category_id NULL. Otherwise goal_id IS NULL.

### Table: goals
| Column         | Type      | Notes                                              |
|----------------|-----------|----------------------------------------------------|
| id             | uuid (PK) | auto-generated                                     |
| user_id        | uuid (FK) | references users.id                                |
| name           | text      |                                                    |
| target_amount  | numeric   |                                                    |
| current_amount | numeric   | **Auto-maintained** by trigger from savings_deposit transactions — DO NOT update manually |
| image_path     | text      | nullable                                           |
| image_aspect   | text      | '21:9' \| '16:9' \| '4:3' \| '1:1'                 |
| created_at     | timestamp | auto-generated                                     |

DB trigger `transactions_sync_goal_amount` keeps `goals.current_amount = SUM(savings_deposit.amount WHERE goal_id = …)`. See migration `supabase/migrations/20260514_savings_deposits.sql`.

### Row Level Security (RLS)
All user-owned tables (categories, transactions, goals, budgets, portfolio_accounts, monthly_balance_snapshots, recurring_transactions, user_meta): CRUD restricted via `WHERE user_id = auth.uid()`.

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
**Currently working on**: Production-readiness
**Blocked by**: Nothing
**Next up**: User decides — multi-user RLS test, or Post-MVP features (savings analytics, PDF export, desktop layout)

## Known Issues
- Turbopack dev mode (`npm run dev`) does not hydrate on iPhone — buttons visible but not clickable. Use `npm run build && npm run start` for mobile testing.
- Apple Sign-In is a placeholder (not yet configured)

## iOS Safari Pitfalls
- NEVER use inline `opacity: 0` with CSS `animation-fill-mode: forwards` — breaks touch events on iOS. Use `fill-mode: both` instead.
- NEVER use `autoFocus` on inputs inside Bottom Sheets — iOS keyboard pushes content offscreen.
- Always add `will-change: transform` on animated overlay containers for 120Hz ProMotion.
- Bottom Sheet content must fit in ~750px (iPhone 13+ viewport) without scrolling.
- **No-Zoom-Setup is globally enforced** (viewport `maximumScale: 1, userScalable: false` + `touch-action: pan-x pan-y` on html + `font-size: 16px !important` on input/textarea/select in globals.css). Don't override these — Tailwind `text-xs`/`text-sm` on inputs would otherwise trigger iOS auto-zoom.
- New aggregation queries over `transactions` MUST filter `.in('type', ['income','expense'])` — savings_deposit transactions are balance-neutral and contaminate sums otherwise.

## Notes
- Design is implemented from Stitch AI export — warm luxury palette with extended tokens
- The app should feel premium and native – smooth animations, no browser-like UI
- Luxury feel is a core requirement, not an afterthought
- Fonts: Plus Jakarta Sans (heading), Be Vietnam Pro (body), Fraunces (display serif)
- Organic shapes system: 10 blob border-radius shapes, stable per category ID hash
