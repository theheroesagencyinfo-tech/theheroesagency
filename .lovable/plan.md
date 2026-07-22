
# Portfolio Redesign — Magazine, Image-Led, Trust-First

Goal: make the Portfolio feel like a premium agency case-study book — minimal, editorial, catchy — while keeping the current sky-blue system. Uses existing screenshots (no new imagery). Applies to both the homepage `PortfolioSection` and the full `/portfolio` page.

## Design tokens (scoped, no global palette change)

- Palette: current Ocean Deep / sky-blue tokens stay. No color migration.
- Typography (scoped to portfolio surfaces only, not global):
  - Headings & project titles: **Instrument Serif** (italic-friendly, editorial).
  - Eyebrows, meta, body, buttons: **Work Sans**.
  - Load both via `<link>` in `index.html` and register two Tailwind font families: `font-serif-display` (Instrument Serif) and `font-sans-ui` (Work Sans). Apply only inside portfolio components so the rest of the site is untouched.
- Rhythm: bigger vertical spacing, thin 1px hairlines (`border-border/40`), muted numeric labels, generous whitespace.

## Homepage `PortfolioSection` — magazine layout

Structure (replaces the current 3-col grid of 6):

```text
┌──────────────────────────────────────────────┐
│  Eyebrow: SELECTED WORK — 001 / 007          │
│  Serif H2:  Stores built to convert,          │
│             not just look good.               │
│  Sub (Work Sans, muted, 1 line)               │
└──────────────────────────────────────────────┘

┌──────── FEATURED CASE (large) ───────────────┐
│ [ Big image — 16:10, top-crop ]              │
│                                              │
│ Eyebrow  ·  Category                         │
│ Serif H3 — Brand name                        │
│ 2-line description                           │
│ ── metric row: 3 numeric cells ──            │
│ [View live store ↗]   [Read the story →]     │
└──────────────────────────────────────────────┘

┌───── 2×2 secondary grid (smaller cards) ─────┐
│  card   │   card                              │
│  card   │   card                              │
└──────────────────────────────────────────────┘

              [ See all 19 projects → ]
```

Card treatment:
- Remove the round "gradient-gold" results pill. Replace with a bottom hairline row: `Category · Metric`.
- Hover: image scales 1.03, a thin sky underline sweeps under the serif title, external-link glyph fades in top-right. No blur/filter transitions.
- Numbers get their own emphasis: metric font in Work Sans tabular-nums, larger weight, uppercase micro-label under it (e.g. `70K+` / `Orders shipped`).

## `/portfolio` page — full magazine spread

Order:
1. **Editorial hero** — serif H1 across two lines, small paragraph, one primary CTA. No large image; whitespace does the work.
2. **Signal strip** — 4 numeric cells on a hairline row: `19 stores · 250K+ orders · $40M+ revenue · 4.9★ rating` (numbers pulled from existing data; copy is directional, adjust to real values you have). Purely typographic, no icons.
3. **Featured case (large)** — first project full-bleed with metric row + description + CTA.
4. **Zigzag block (3 projects)** — alternating image/text rows, image ~55% width desktop, text ~45%. Category eyebrow → serif title → short paragraph → 2 metrics → live link.
5. **Grid (remaining projects)** — 3-column card grid, minimalist cards (image, hairline, category · metric, title). Reuses redesigned card.
6. **Marketing case studies** (existing section on `/portfolio`) — restyled headers to serif, cards keep current imagery, tightened spacing.
7. **CTA band** — serif "Ready to be the next case study?" with a single primary CTA to `/free-audit`.

## Image usage (existing assets only)

- Homepage featured card: `takeletloose` (already first in list).
- Homepage 2×2 grid: next 4 projects in current order.
- `/portfolio` featured: same top project; zigzag uses next 3; grid uses the rest.
- All images already exist as `webp` (and `?responsive` on the page). No new generation.
- Keep `LazyImage` / `ResponsiveImage` and `ImagePreload` behavior intact for LCP.

## Copy tightening

- Eyebrows uppercased, tracked (`tracking-[0.18em]`), 11–12px.
- Descriptions trimmed to one sentence, max ~110 chars.
- Replace vague labels like "Adventure Lifestyle Brand" with a metric-first label when a number exists (e.g. use `70K+ orders shipped` as the primary metric and demote the category to eyebrow).
- Section subtitle rewritten to a single confident sentence, no AI-ish filler.

## Files to edit / create

- `src/components/sections/PortfolioSection.tsx` — replace grid with featured + 2×2, new card component.
- `src/pages/Portfolio.tsx` — restructure hero, add signal strip, featured, zigzag block; keep marketing case studies section but restyle headers.
- `src/components/portfolio/FeaturedCase.tsx` *(new)* — large editorial card.
- `src/components/portfolio/ProjectCard.tsx` *(new)* — minimalist card, replaces inline `ProjectCard` in section.
- `src/components/portfolio/ZigzagRow.tsx` *(new)* — alternating image/text row.
- `src/components/portfolio/MetricCell.tsx` *(new)* — number + micro-label primitive.
- `index.html` — add Instrument Serif + Work Sans `<link>` tags.
- `tailwind.config.ts` — register `serif-display` and `sans-ui` font families.

## Out of scope

- No changes to global colors, other pages, or business logic.
- No new imagery generated; only existing `src/assets/portfolio/*` assets used.
- No changes to routes, SEO metadata, or sitemap.

## Verification

- Typecheck.
- Manual check on `/` (portfolio section) and `/portfolio` at desktop (1280) and mobile (390) via Playwright screenshots to confirm layout, spacing, and no overflow.
