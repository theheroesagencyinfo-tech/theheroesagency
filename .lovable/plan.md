## Add Refund Policy page

Create a new `/refund` route mirroring the existing `Terms.tsx` structure (Navigation + SEO + prose article + Footer), populated with the provided refund policy copy.

### Files to create
- `src/pages/Refund.tsx` — new page component. Same layout, styling, and prose classes as `Terms.tsx`. SEO title "Refund Policy — TheHeroes Agency", canonical `https://www.theheroesagency.org/refund`, effective date "July 22, 2026" (static, not `new Date()`), with all 9 sections rendered as `<h2>` + `<p>`/`<ul>` blocks. Email link points to `theheroesagency.info@gmail.com`.

### Files to edit
- `src/App.tsx` — lazy-import `Refund` and add `<Route path="/refund" element={<Refund />} />` above the catch-all.
- `src/components/sections/Footer.tsx` — add `{ label: "Refund Policy", href: "/refund", type: "route" }` to `resourceLinks` (after "Terms of Service").
- `scripts/generate-sitemap.ts` — add `/refund` to the static route list so it's indexable.

No backend, schema, or business-logic changes. Pure presentation/content addition.
