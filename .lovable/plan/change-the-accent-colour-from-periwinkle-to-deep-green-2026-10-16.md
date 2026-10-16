# Change the accent colour from periwinkle to deep green

## Why

The current palette (navy #151832, periwinkle #B9C3FF, off-white #F3F4FB) is clean but the periwinkle reads cool and tech-leaning. For a studio designing nonfiction author websites, a deep green keeps the same calm and trust while feeling more literary and book-world. Green stays understated against the serif type and generous whitespace.

## What changes

Only the design tokens in `src/styles.css` change — every component already uses semantic tokens (`text-ring`, `bg-accent`, `bg-ring`, focus outlines), so no component edits are needed.

Light mode:
- `--ring` (accent used for the em highlight, serif numerals, em-dashes, focus outline): `oklch(0.55 0.12 278)` → `oklch(0.45 0.09 155)` — a deep forest green, still readable as text on the paper background.
- `--accent` (hover tint): `oklch(0.83 0.08 278)` → `oklch(0.90 0.035 155)` — a light sage tint.
- Neutral surfaces (background, card, secondary, muted, border, input) shift their hue from 278 to 155 with low chroma so the paper carries a faint green undertone instead of a blue one.

Dark mode (prefers-color-scheme):
- `--ring` and `--accent`: `oklch(0.83 0.08 278)` → `oklch(0.80 0.09 155)` — sage green readable on the navy background.
- Dark surface tokens shift hue to 155 the same way.
- Navy `--primary`/`--foreground` stay unchanged.

Update the palette comment at the top of the token block.

## Also

- Update `mem://studio-rules` so the accent is recorded as deep green and periwinkle is not reintroduced later.
- No copy, layout, or metadata changes.

## Verification

- Build OK in the observability log.
- Playwright at 1280 and 393 widths: Home, Services, About, Contact, and one project page render with the green accent on the em highlight, numerals, journey dots, focus rings, and button hover shadow; dark mode shows the sage accent on navy; no console errors, no sideways overflow.
