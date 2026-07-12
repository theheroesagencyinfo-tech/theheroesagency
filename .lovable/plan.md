
# Why no clients yet — and how we fix it

You said *"some traffic, no inquiries"* and *"nothing yet — just launched, no promotion"*. Those two facts, together, are the real diagnosis. It isn't the site — it's that **almost nobody who needs a Shopify partner has ever seen it**, and the tiny trickle that lands doesn't yet have a strong enough reason to book on the first visit.

New Shopify agency sites typically need **3–6 months of consistent SEO + outbound + proof-building** before inbound calls become predictable. Right now you're on day zero of that curve. Here's the plan to compress it.

---

## Part 1 — Reality check (what the data says)

Before touching anything, I'll pull:

- **Semrush** — current rankings, backlinks, and Authority Score for `theheroesagency.org` (we already know it's 1 keyword at position 75 — brand new).
- **Google Search Console** — impressions, clicks, and which queries Google *is* showing you for.
- **Your own analytics table** (`page_events` / `page_views`) — where the "some traffic" is landing, bounce behavior, and whether anyone reaches `#contact`.

Deliverable: a short written diagnosis so we stop guessing.

---

## Part 2 — Conversion audit (the site itself)

Even at low traffic, the site has to convert the few visitors it gets. I'll review the live site end-to-end against how agency buyers actually decide, and fix:

1. **Hero clarity (5-second test)** — does a Shopify brand founder instantly know *who you help, what you do, and the outcome*? Current hero says *"I build high-converting Shopify stores"* — good, but missing **who it's for** and **proof**. Rewrite for specificity (e.g. *"For Shopify brands doing $50K–$1M/mo who want a store that actually converts"*).
2. **Proof density above the fold** — logos, star rating, "$X revenue driven", or one killer testimonial visible before scroll. Currently the trust signals live too far down.
3. **One primary CTA, everywhere** — the site has "Book a Strategy Call", "View My Work", "Get a Free Audit", and a contact form. Pick one hero action; make everything else secondary.
4. **Portfolio → results, not screenshots** — every project card must lead with a *number* (conversion lift, revenue, LTV). Buyers scan for numbers, not visuals.
5. **Risk removal near the CTA** — "Free audit, 30-min call, no pitch, no obligation." Reduces the mental cost of booking.
6. **Fix any mobile friction** — form length, tap targets, sticky CTA on scroll for mobile.
7. **Response promise** — "Reply within 12 hours" is good; surface it *next to* the form, not just after submit.

Deliverable: a specific edits list against `HeroSection`, `PortfolioSection`, `TestimonialsSection`, `ContactSection`, and `Footer`.

---

## Part 3 — Traffic growth roadmap (next 90 days)

You can't out-SEO the fact that the site is 3 weeks old. So we run **three channels in parallel**, each doing what it's good at.

### Channel A — SEO (compounds, slow start)
- Publish **2 posts/week** on the low-KDI Shopify long-tails we already identified (CRO, speed, checkout, apps, fees). This is already partially automated via `generate-weekly-blog-posts` — I'll tune the topic queue.
- Add **3 city/service landing pages** (e.g. *Shopify developer New York*, *Shopify Plus agency London*) — low competition, high intent.
- Build **10 foundational backlinks**: Clutch, DesignRush, Shopify Experts directory, agency roundups, GMB, LinkedIn company page, personal author bio on 2–3 guest posts.

Realistic timeline: first organic inquiries in **month 2–3**.

### Channel B — Outbound (starts working this week)
This is where your first client almost certainly comes from. I'll build inside the app:
- A **lead-list workflow** in `/admin`: paste a list of Shopify stores → the app scores them (traffic tier, tech stack red flags, missing CRO basics) → generates a personalized audit snippet you can DM/email.
- A **free Shopify audit landing page** (`/free-audit`) — the ask in your cold outreach. Higher opt-in than "book a call".
- Suggested cadence: **20 personalized outreaches/day**, 5 days/week. Expect first reply in week 1, first call in week 2.

### Channel C — Organic social proof (compounds fastest)
- Post **3×/week on LinkedIn + X**: teardowns of real Shopify stores (screenshot → 3 issues → fix). Each post ends with "I do this for a living — free audit link in bio."
- Repurpose each teardown into a blog post (kills two birds).
- This is what actually turns "some traffic" into *the right* traffic.

---

## Part 4 — Measurement

Add a small **acquisition dashboard** in `/admin` so we can see what's working instead of guessing:
- Weekly: visits by source, form submissions, calls booked, revenue closed
- Per-post: impressions, clicks, position (pulled from Search Console API — already connected)
- Outbound: sends → replies → calls → closes

If a channel doesn't produce a call in 30 days, we kill it and reallocate.

---

## What I'd do in this build session

If you approve, in the next turn I'll ship the **highest-leverage subset** so you can start today:

1. Rewrite hero + add proof-above-fold on the homepage.
2. Fix the CTA hierarchy sitewide (one primary action).
3. Rework portfolio cards to lead with numbers.
4. Build the `/free-audit` landing page (the outbound ask).
5. Add a simple acquisition dashboard tab in `/admin`.

The SEO content queue and outbound lead-list tool are follow-up sessions — they're bigger and deserve their own scope.

---

### Technical notes (for reference)

- **Files touched in step 1–3**: `src/components/sections/HeroSection.tsx`, `PortfolioSection.tsx`, `TestimonialsSection.tsx`, `CTASection.tsx`, `ContactSection.tsx`, `Footer.tsx`.
- **New route for step 4**: `src/pages/FreeAudit.tsx` + entry in `src/App.tsx` + sitemap entry in `scripts/generate-sitemap.ts` + SEO meta via `SEO.tsx`.
- **Dashboard step 5**: new tab in `src/pages/Admin.tsx` reading from existing `page_events`, `page_views`, `contact_submissions`, `reviews` tables — no schema changes needed.
- No new dependencies. No backend migrations for this session.

---

Approve this plan and I'll ship steps 1–5 in the next turn. Say *"do the whole roadmap"* if you also want the SEO queue tuning and outbound tool built now (bigger session).
