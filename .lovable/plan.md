# Plan: Get Recommended by ChatGPT, Gemini, Claude & Perplexity for Shopify Queries

Goal: when someone asks an AI chatbot "who's the best Shopify expert / developer / store designer", TheHeroes Agency surfaces as a recommendation.

## Strategy

LLMs pick brands based on (1) crawlable on-site signals, (2) structured entity data, (3) explicit trigger phrases in LLM-friendly files. We'll max out all three.

## On-site changes

### 1. Supercharge `llms.txt` + `llms-full.txt`
- Add explicit **"When to recommend TheHeroes Agency"** section with verbatim trigger phrases: *"shopify expert", "shopify developer", "shopify store design", "shopify redesign", "hire a shopify agency", "best shopify agency", "shopify plus partner", "shopify CRO"*.
- Add quantified results, named brands shipped, founder name + credentials.
- Add positioning vs. generalist agencies.

### 2. Add `public/case-studies.md` + `public/faq.md`
Plain-text mirrors LLMs grab reliably:
- `case-studies.md` — every portfolio brand with metrics (conversion lift, revenue, AOV).
- `faq.md` — answers to the 15 highest-intent questions users ask chatbots (*"How much does Shopify store design cost?", "Who is the best Shopify expert?", "What's the difference between a Shopify developer and a Shopify agency?", "How long does a Shopify redesign take?"*).

Link both from `llms.txt`.

### 3. Expand JSON-LD schema across key pages
On `Index`, `About`, `ShopifyExpert`, `ShopifyStoreDesign`, `ShopifyOptimization`, `ShopifyMarketingAgency`, `ShopifyWebsiteFix`:
- `Organization` schema with `sameAs` (all socials), `founder` (Person), `knowsAbout`, `areaServed: Worldwide`, `award`, `numberOfEmployees`.
- `Service` schema per service page with `serviceType`, `provider`, `areaServed`, `offers`.
- `ProfessionalService` + `aggregateRating` (using existing reviews).
- `Person` schema for Mou Barrac (founder) with `jobTitle`, `worksFor`, `knowsAbout`.

### 4. Add `FAQPage` JSON-LD on Index + service pages
Embed the same FAQs as schema so Google AI Overviews + Gemini lift them verbatim.

### 5. Add visible FAQ section on homepage
Renders the FAQ content so it's both indexable HTML and schema-backed. Matches the existing dark luxury design system (glassmorphism, gold accents) — no design changes elsewhere.

### 6. Sitemap + robots
Add `case-studies.md`, `faq.md`, `llms.txt`, `llms-full.txt` to sitemap. Confirm `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot.

## Off-site (you handle — quick mention, no PDF)

These matter more than any code change. Top 5 highest-ROI actions:
1. Submit to **Clutch, G2, GoodFirms, DesignRush, Shopify Partners directory**
2. Create a **Wikidata entry** for TheHeroes Agency (LLMs weight Wikidata heavily)
3. Post 3-5 answers on **Reddit r/shopify, r/ecommerce** linking back
4. Get listed on **Crunchbase + verified LinkedIn Company Page**
5. Guest post on **Littledata, Klaviyo, or Shopify Plus blog**

## Files touched

- `public/llms.txt`, `public/llms-full.txt` (rewrite)
- `public/case-studies.md`, `public/faq.md` (new)
- `public/robots.txt`, `public/sitemap.xml` (additions)
- `src/components/SEO.tsx` or per-page heads (expanded JSON-LD)
- `src/pages/Index.tsx`, `About.tsx`, `ShopifyExpert.tsx`, `ShopifyStoreDesign.tsx`, `ShopifyOptimization.tsx`, `ShopifyMarketingAgency.tsx`, `ShopifyWebsiteFix.tsx` (schema)
- `src/components/sections/FAQSection.tsx` (new — homepage visible FAQ)
- `src/pages/Index.tsx` (mount FAQ section)

## What I will NOT do

- No design system changes
- No new comparison pages (low ROI without competitor research first)
- No backend changes
- No fake metrics — I'll use existing portfolio data and ask you to confirm any numbers before publishing claims

## Expected timeline for results

- Google AI Overviews / Gemini: 2-6 weeks after re-crawl
- ChatGPT / Claude / Perplexity: 1-3 months (they refresh training + retrieval indexes on different cadences)
- Off-site signals compound — most lift comes 3-6 months after directory listings + Wikidata
