# SEO Plan: Rank for Shopify Expert Keywords

**Goal:** rank for `shopify expert`, `shopify website`, `shopify store design`, `shopify fix`, `shopify optimization`, and your overall category.

**Honest expectation:** "Shopify" alone is owned by Shopify.com — no one outranks them. For the rest (shopify expert, store design, fix, optimization), page-1 rankings take 3–6 months of consistent content + backlinks. This plan builds the on-site foundation; backlinks (Shopify Partners directory, Clutch, guest posts) are the off-site half you'll need to drive yourself.

## 1. Keyword validation (Semrush)
Run `keyword_research` + `keyword_compare` on the target list to confirm real volume/difficulty and pull long-tail variants. Output a one-keyword-per-page map (avoids cannibalization).

## 2. Dedicated service landing pages
Today everything lives on `/`. Google can only rank one page per query — you need a focused page per keyword:
- `/shopify-expert`
- `/shopify-store-design`
- `/shopify-optimization` (speed + CRO)
- `/shopify-website-fix` (audits, bug fixes, theme repair)
- `/shopify-marketing-agency`

Each page: keyword in H1, 800–1200 words original copy, FAQ block, mini case study, internal links, unique SEO title/description/canonical, `Service` + `FAQPage` JSON-LD.

## 3. Homepage upgrade
- H1 + intro tuned to include "Shopify Expert" naturally
- New Services grid linking to the 5 pages above
- `ProfessionalService` JSON-LD (helps category ranking)
- Tightened SEO title leading with the strongest keyword

## 4. Existing pages tune-up
- About: Shopify credentials language + `Person` JSON-LD
- Portfolio: project blurbs mention "Shopify store design / optimization / fix"
- Blog posts: each internal-links to the matching service page
- `BreadcrumbList` JSON-LD across inner pages

## 5. Sitemap + robots
- Add the 5 new routes to `public/sitemap.xml`
- robots.txt already allows all — no change

## 6. Weekly blog engine alignment
Your Thursday auto-generator already runs. Update its topic pool to rotate through these target keywords so every post reinforces one and links to its service page.

## 7. Google Search Console
Verify the domain via the connector, submit the sitemap, monitor impressions/rankings per keyword.

## Technical details
- New routes in `src/App.tsx`; new files in `src/pages/`
- Reuse existing `<SEO>` component
- Edit `public/sitemap.xml` directly (current mechanism is static)
- Update `supabase/functions/generate-weekly-blog-posts` topic list
- Copy will be human-quality, not stuffed

## Out of scope (you must drive)
- **Backlinks** — biggest ranking factor. List on Shopify Partners, Clutch, G2; do guest posts; get client testimonials with links.
- **Google Business Profile** — if you serve a region.

---

Want me to do **all of the above**, or start with the **5 service pages + homepage upgrade** (fastest impact) and layer the rest after?
