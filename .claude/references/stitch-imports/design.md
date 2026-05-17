# Monéa Design System

> Extracted from the existing Monéa PWA (mobile-first finance planner).
> Used as input for Stitch — describes the brand, tokens, and component patterns
> so that web screens (landing page, marketing pages, desktop app surfaces)
> generated for Monéa feel like a direct continuation of the mobile app.

---

## 1. Brand

- **Name**: Monéa (always with acute accent on the second "e")
- **Tagline**: "Your money — but elevated"
- **Category**: Personal finance, budgeting, savings goals
- **Audience**: Young ambitious women with a high aesthetic standard who want
  a luxurious, clean, and elegant finance tool. Think pilates-girly /
  editorial-Vogue energy, not corporate fintech.
- **Positioning**: Premium. Calm. Intentional. Every pixel earns its place.

## 2. Voice & Tone

- **Voice**: Warm, knowing, confident. Like a smart older sister who has her
  finances in order and is happy to share. Never lectures.
- **Tone in copy**: Short. Editorial. Lowercase headlines are OK. Mixes
  English ("Daily Motivation", "In Progress") and German UI naturally —
  the German speaker is the primary user, English is style accent.
- **Avoid**: Bro-fintech ("Crush your goals!"), startup-bro ("Hustle smarter"),
  bank-formal ("Manage your assets"), gamification badges, exclamation marks,
  emoji, finger-wagging.

## 3. Color Palette (Warm Luxury)

The palette is warm, dusty, off-white. Backgrounds are cream — never pure
white. Primary is a near-black coffee. Accents lean dusty rose / peach.

### Light mode (default)

| Token                    | Hex       | Use                                     |
| ------------------------ | --------- | --------------------------------------- |
| background               | `#faf9f6` | Page background — soft cream, never white |
| foreground               | `#1a1c1a` | Primary text on background              |
| card                     | `#f4f3f1` | Card / surface — slightly darker cream  |
| popover                  | `#ffffff` | Floating popovers only                  |
| primary                  | `#271310` | Buttons, key text accents — deep coffee |
| primary-foreground       | `#ffffff` | Text on primary                         |
| secondary                | `#fadcd2` | Dusty peach — accent surfaces, badges   |
| secondary-foreground     | `#56423b` | Text on peach                           |
| muted                    | `#f4f3f1` | Muted surface                           |
| muted-foreground         | `#6f5a52` | Secondary text — warm taupe             |
| accent                   | `#efeeeb` | Hover / pressed accent surface          |
| destructive              | `#ba1a1a` | Errors, over-budget                     |
| border                   | `#d3c3c0` | Subtle borders                          |
| success                  | `#34a853` | Goal completed, positive trend          |
| primary-container        | `#3e2723` | Deeper coffee container                 |
| secondary-container      | `#fadcd2` | Peach container                         |
| on-secondary-container   | `#766057` | Text on peach container                 |
| surface-container        | `#efeeeb` | Card surface variant                    |
| surface-container-low    | `#f4f3f1` | Lighter surface                         |
| surface-container-high   | `#e9e8e5` | Slightly darker surface                 |
| surface-container-lowest | `#ffffff` | Pure white surface (popovers)           |
| primary-fixed            | `#ffdad4` | Soft pink for gradients                 |
| on-primary-fixed         | `#2b1613` | Text on soft pink                       |
| secondary-fixed-dim      | `#ddc1b7` | Dimmed peach for gradients              |
| outline-variant          | `#d3c3c0` | Outline emphasis                        |

### Dark mode (inverted warm)

| Token                  | Hex                       |
| ---------------------- | ------------------------- |
| background             | `#1a1c1a`                 |
| foreground             | `#e3e2e0`                 |
| card                   | `#2f312f`                 |
| primary                | `#e3beb8`                 |
| primary-foreground     | `#271310`                 |
| secondary              | `#56423b`                 |
| secondary-foreground   | `#fadcd2`                 |
| muted-foreground       | `#9c938f`                 |
| destructive            | `#ff5449`                 |
| border                 | `rgba(255,255,255,0.10)`  |

### Chart palette (for analytics)

`#271310`, `#6f5a52`, `#fadcd2`, `#e3beb8`, `#3e2723` — warm coffee +
peach scale, no harsh primaries. Dark mode flips to lighter ends of the same scale.

### Decorative blob palette (auth / hero backgrounds)

Slow-drifting blurred orbs behind hero content:
- Warm peach `#f5c4b8` @ opacity 0.7
- Deep rose `#d4a49a` @ opacity 0.6
- Soft rose `#c9a69e` @ opacity 0.5

Always blurred at ~70-80px. Always animated with `ease-in-out` 16-20s loops.
Honor `prefers-reduced-motion`.

## 4. Typography

Three fonts, each with a clear role. **Never mix roles.**

| Family            | CSS var               | Weights         | Role                                                      |
| ----------------- | --------------------- | --------------- | --------------------------------------------------------- |
| Plus Jakarta Sans | `--font-headline`     | 400/600/700/800 | UI headings, navigation labels, card titles               |
| Be Vietnam Pro    | `--font-body`         | 300/400/500/600 | Body text, paragraphs, UI labels — the workhorse          |
| Fraunces          | `--font-display-serif`| 400/600         | Display: prices, balances, marketing hero, goal titles    |

### Type scale (mobile baseline; web hero can go bigger)

| Use                  | Family    | Size           | Weight | Notes                              |
| -------------------- | --------- | -------------- | ------ | ---------------------------------- |
| Marketing hero       | Fraunces  | clamp(48–96px) | 600    | Tight tracking, can break lines    |
| Section heading      | Jakarta   | 24-32px        | 700    | tracking-tight                     |
| Balance / price big  | Fraunces  | 24-40px        | 600    | tabular-nums always                |
| Card title           | Jakarta   | 18-20px        | 700    |                                    |
| Body                 | Be Vietnam| 16px           | 400    | min 16px to avoid iOS zoom         |
| Small label          | Be Vietnam| 12-14px        | 500    |                                    |
| Eyebrow / status pill| Be Vietnam| 10px           | 700    | uppercase, tracking-[0.2em]        |

### Typography rules

- **Currency always uses `tabular-nums`** — values must line up vertically.
- **All prices, balances, big numbers use Fraunces (display serif).** This is
  the signature voice of the brand.
- **Eyebrow labels are 10px, uppercase, tracking-widest, bold** — used above
  numbers as quiet category markers ("GESAMTSALDO", "DAILY MOTIVATION").
- Headlines may be lowercase for editorial feel. Sentence case in body.
- Never use `text-xs`/`text-sm` directly on `<input>` — global CSS forces
  16px to prevent iOS auto-zoom.

## 5. Spacing & Layout

- **Mobile gutters**: 24px (`px-6`) — sometimes 28px (`px-7`) for hero cards.
- **Stack rhythm**: Sections separated by 40px (`space-y-10`).
- **Touch targets**: minimum 44×44 px. BottomNav items are 56×56.
- **Safe areas**: bottom uses `pb-[env(safe-area-inset-bottom)]` on fixed bars.
- **Container max-widths**:
  - Mobile content column: `max-w-2xl` (~672px), centered.
  - Marketing site: `max-w-7xl` for hero/sections, `max-w-3xl` for prose.
  - Desktop app: sidebar 240-280px + main `max-w-7xl`.

### Web-specific layout (not in mobile app yet)

- Marketing pages: full-bleed sections with internal padding `px-6 md:px-12 lg:px-20`.
- Desktop app: fixed left sidebar replaces BottomNav at `lg:` breakpoint.
- Header on marketing: backdrop-blurred, transparent over hero scroll.

## 6. Radii — Including Organic Blob Shapes

This is one of Monéa's signature visual codes. **Rectangles with equal corners
are reserved for utility (pills, buttons). Hero surfaces use asymmetric corners.**

### Standard radii

| Token       | Value       |
| ----------- | ----------- |
| `--radius`  | 1rem (16px) |
| sm          | 0.6rem      |
| md          | 0.8rem      |
| lg          | 1rem        |
| xl          | 1.4rem      |
| 2xl         | 1.8rem      |
| 3xl         | 2.2rem      |
| 4xl         | 2.6rem      |
| full        | 9999px      |

### Asymmetric card corners (signature pattern)

Hero cards mix radii per corner. Common combinations used in the app:

- `rounded-[2rem_1rem_2.5rem_1.5rem]` — balance card
- `rounded-[2.5rem_1.25rem_3rem_1.75rem]` — motivation card
- `rounded-[2rem_1rem_2rem_2.5rem]` — goal card
- `rounded-[3rem_1rem_3rem_4rem]` — budget card variant A
- `rounded-[2rem_4rem_2rem_3rem]` — budget card variant B
- `rounded-[3.5rem_2rem_4rem_1.5rem]` — budget card variant C

**Rule of thumb**: top-left and bottom-right are large (2-4rem), top-right and
bottom-left are small (1-2rem) — or mirrored. Never four equal corners on
content cards.

### Organic blob shapes (for icon containers, active nav)

Used for category icon backgrounds and the active BottomNav item. 10
hand-tuned `border-radius: %/%` variants make each shape feel hand-crafted:

```
rounded-[70%_42%_50%_50%/42%_65%_42%_65%]
rounded-[42%_70%_65%_42%/60%_42%_70%_40%]
rounded-[55%_45%_40%_70%/70%_40%_55%_45%]
rounded-[65%_42%_70%_40%/40%_70%_42%_60%]
rounded-[42%_65%_42%_60%/65%_42%_68%_40%]
rounded-[72%_40%_55%_45%/42%_60%_40%_68%]
rounded-[40%_72%_60%_42%/68%_40%_65%_42%]
rounded-[60%_42%_40%_72%/42%_65%_60%_42%]
rounded-[42%_60%_68%_40%/40%_72%_45%_55%]
rounded-[50%_50%_42%_65%/68%_40%_40%_72%]
```

Each category ID hashes to one stable shape so it doesn't change between
renders.

## 7. Elevation & Effects

- **No drop shadows** on cards by default — surfaces differentiate via subtle
  hue (cream → slightly darker cream). Shadows feel cheap; tonal layering
  feels luxe.
- **Backdrop blur** on the fixed header (`bg-background/70 backdrop-blur-xl`)
  and BottomNav (`bg-background/80 backdrop-blur-md`).
- **Active press feedback**: `active:scale-[0.97]` or `active:scale-[0.98]` on
  all tappable cards/buttons. Transition 150-300ms.
- **Avatar gradient shimmer**: 14s ease-in-out infinite linear gradient sweep
  across `secondary-container → primary-fixed → secondary → primary-fixed →
  secondary-container`. Used for user avatars to feel alive without being loud.

## 8. Motion & Animation

- **Springs** for sheet/drawer/modal entrances (Framer Motion:
  `damping: 30, stiffness: 300, mass: 0.8`).
- **CSS keyframes** for loops (avatar shimmer, decorative blobs).
- **Stagger** content sections on page mount (50ms increments).
- **Respect `prefers-reduced-motion`** everywhere — decorative animations
  must disable.

## 9. Iconography

- Library: **Lucide React** (1.5 stroke for inactive, 2.0 for active).
- Standard icon size: 20-26px in nav, 16-20px inline.
- Icons sit inside organic-blob backgrounds at 48×48 with category color at
  ~15% opacity tint.

## 10. Imagery

- **Goals support user-uploaded images** in 4 aspect ratios: 21:9, 16:9,
  4:3, 1:1 — always with a dark gradient overlay from black/80 (bottom) to
  transparent for legibility of overlaid text.
- **Marketing imagery**: editorial photography (matte film grain look),
  not stock illustrations. Warm tones, natural light, hands/objects > faces.
  Think: a ceramic coffee cup on linen, a hand reaching for a leather wallet,
  fresh croissants on marble. Never: cartoon characters, growing-money charts,
  generic business handshakes.

## 11. Component Patterns

### Buttons (mobile app uses Base UI primitive)

| Variant       | Visual                                      | Use                               |
| ------------- | ------------------------------------------- | --------------------------------- |
| `default`     | `bg-primary text-primary-foreground`        | Primary CTA                       |
| `secondary`   | `bg-secondary text-secondary-foreground`    | Secondary action                  |
| `outline`     | `bg-background border border-border`        | Tertiary                          |
| `ghost`       | hover-only background                       | Inline / icon buttons             |
| `destructive` | `bg-destructive/10 text-destructive`        | Delete actions                    |
| `link`        | underline on hover                          | Inline text links                 |

Sizes: xs (h-6) / sm (h-7) / default (h-8) / lg (h-9). All with subtle
1px translate on active. Rounded `lg` by default.

**Marketing CTAs may be larger** — e.g. `h-12 px-8 text-base rounded-full`
for the hero "Get started" button. That is OK in the marketing context.

### Cards (signature pattern)

- Asymmetric corners (see §6).
- Cream-on-cream tonal layering — no shadow.
- `active:scale-[0.97]` if tappable.
- Padding: `px-6 py-5` for compact, `px-7 py-8` for hero.

### Status pills

```
bg-{status}/90 rounded-full px-3 py-1
text-[10px] font-bold uppercase tracking-widest text-white
```

States: `success` (achieved), `primary-container` (in progress), `muted-foreground` (starting).

### Eyebrow labels (above big numbers)

```
text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant
```

### Progress bars

- Thin (h-1.5 to h-2), `rounded-full`.
- Filled portion: `bg-primary`. Track: `bg-border` or `bg-primary/15`.
- Over-budget: filled portion switches to `bg-destructive`.

### Bottom Sheet / Modal

- Slides up from bottom with spring (damping 30, stiffness 300).
- Backdrop: `bg-black/40 backdrop-blur-sm`.
- Sheet: `rounded-t-3xl bg-background max-h-[92dvh]`.
- Drag handle: 40×4 px pill, `bg-surface-dim`, centered at top.

### Bottom Nav (mobile only)

- Fixed bottom, 96px tall, `bg-background/80 backdrop-blur-md`.
- 4 items: Dashboard / Transactions / Analytics / Goals.
- Active item: peach `bg-secondary` background with an organic blob shape.
- Inactive: just an icon at `text-muted-foreground`, rounded-full hit area.

### Sidebar Nav (desktop — new for web)

- Fixed left, 240-280px wide, `bg-sidebar` (= cream `#f4f3f1`).
- Logo "Monéa" in Fraunces at the top.
- Nav items as rows: icon (20px) + label (Plus Jakarta 15px). Active item
  uses peach background and an organic blob shape on the icon container,
  matching the mobile aesthetic.
- User avatar block pinned to the bottom (avatar-gradient circle + name +
  email + logout icon).

## 12. PWA / Web Constants

- App name: `Monéa`
- Description: `Your money — but elevated`
- Theme color (status bar): `#271310`
- Background color (splash): `#faf9f6`
- Display mode: `standalone`
- Orientation: `portrait` (mobile); desktop is unconstrained.

## 13. What to AVOID

- ❌ Pure white backgrounds (`#ffffff`) on full pages — always cream.
- ❌ Drop shadows on cards.
- ❌ Equal-corner radii on hero/content cards (reserved for pills/buttons).
- ❌ Hard-edged geometric backgrounds — soft, blurred, organic blobs only.
- ❌ Generic stock illustrations / cartoony icons.
- ❌ Saturated brand-fintech blues, neon greens, harsh contrast.
- ❌ Sans-serif for prices — display serif (Fraunces) is the brand voice.
- ❌ Hover-dependent interactions on touch surfaces (hover is enhancement only).

---

## Reference Screens (from the existing app)

For Stitch context: the mobile app already has these screens fully built and
should be considered authoritative for app surfaces. The web should
match them visually:

- Dashboard (BalanceCard, MotivationCard, MonthlyView, Budget, Goals, Recent Transactions)
- Transactions (list grouped by day, search, filters, recurring view)
- Analytics (spending donut, trend chart, top categories, filters)
- Goals (grid of GoalCard with hero imagery + progress bars)
- Budgets (per-category cards with organic-blob radii)
- Login / Sign-up (animated blob background, minimal form)

The **web** adds:

- Marketing landing page (hero, features, screenshots, CTA → sign-up)
- Desktop versions of the same app screens with sidebar nav instead of bottom nav
