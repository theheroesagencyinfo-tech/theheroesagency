# Why your site isn't on search engines yet

Three things are working against you right now:

1. **Verification + sitemap submission haven't been completed in Google Search Console** for either domain, so Google isn't actively crawling.
2. **Canonical URLs point to `theheroesagency.lovable.app`** everywhere (SEO.tsx, sitemap.xml, JSON-LD), but your real brand domain is `theheroesagency.org`. Google treats them as duplicates and your brand domain loses ranking authority.
3. **The site is brand new** — even with everything perfect, expect 1–4 weeks before pages appear in results, longer to rank.

## Plan

### 1. Pick the canonical domain
Recommended: **`https://www.theheroesagency.org`** as the primary (it's your brand), and let the lovable.app URL redirect or be treated as secondary.

### 2. Update all canonical references to .org
- `src/components/SEO.tsx` — defaults and per-page canonical/og:url
- `src/pages/Index.tsx` — JSON-LD `url` and `sameAs`
- All service/blog page SEO props (`ShopifyExpert.tsx`, `ShopifyStoreDesign.tsx`, etc.)
- `public/sitemap.xml` — change every `<loc>` from lovable.app to www.theheroesagency.org
- `scripts/generate-sitemap.ts` — update `BASE_URL`
- `public/robots.txt` — keep only the .org sitemap directive
- `index.html` — sitewide og:url, canonical

### 3. Verify ownership in Search Console
Use the Site Verification API to:
- Get a META verification token for `https://www.theheroesagency.org/`
- Inject the `<meta name="google-site-verification" ...>` into `index.html`
- Call the verify endpoint
- Add the verified property to Search Console
- Submit `https://www.theheroesagency.org/sitemap.xml`

(Optionally repeat for the lovable.app domain as a secondary property.)

### 4. Confirm fast indexing signals
- Check that the homepage returns the right title/description in the initial HTML (it does — `index.html` has them).
- Confirm `robots.txt` allows all and points at the .org sitemap.
- Make sure `noindex` isn't accidentally set.

### 5. Tell you what to expect
- 3–14 days: Google starts indexing once verified + sitemap submitted.
- 2–8 weeks: pages start appearing for brand searches ("The Heroes Agency").
- 3–6 months: competitive keywords ("Shopify expert", etc.) need backlinks + content depth to rank.

## Technical notes
- Search Console API access is already configured (`GOOGLE_SEARCH_CONSOLE_API_KEY` available).
- Canonical change is a find-and-replace across ~8 files; low risk.
- The lovable.app sitemap entry in robots.txt can stay as a secondary or be removed — your call.

## Questions before I build
- Confirm `https://www.theheroesagency.org` as the primary canonical domain (vs. keeping lovable.app primary)?
- Do you want me to verify both domains, or just the .org?
