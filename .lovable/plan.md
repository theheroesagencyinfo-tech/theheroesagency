# Plan: Bold Animation & Interactivity Upgrade

Goal: Take the site from "subtle premium" to **intensity 5 — bold & flashy**, with a showpiece Hero and a consistent motion language across every section. All changes respect your sky-blue/glassmorphism brand tokens.

## Tooling I'll set up

1. **MagicUI** (manual install — copies components into `src/components/magicui/`, no extra package).
2. **Framer Motion** (already installed — used for scroll/reveal/hover everywhere).
3. **Intersection Observer hook** (already in `useScrollAnimation` — reuse).

No GSAP, no new heavy deps. MagicUI + Framer Motion covers everything at this intensity.

## Hero section (showpiece)

Stacked layered effects, all tuned to sky-blue tokens:

- **Background:** `Meteors` + `Particles` (sparse, sky-glow color) over the existing dark gradient.
- **Headline:** `AuroraText` on the key phrase ("Shopify Conversion Expert" / brand line) + `TextAnimate` word-by-word reveal on entry.
- **Subheadline:** `BlurFade` staggered reveal.
- **Primary CTA:** `ShimmerButton` with sky-blue shimmer.
- **Secondary CTA:** keep current glass button, add `BorderBeam` on hover.
- **Trust strip / metrics below fold:** `NumberTicker` count-up on scroll-in.

## Whole-site pass

Applied consistently so it feels like one designed system, not random effects:

- **Section entry:** every major section fades+slides in on scroll (Framer Motion `whileInView`, 0.6s, staggered children).
- **Service cards (`ServicesSection`):** `MagicCard` spotlight follow-cursor + `BorderBeam` on hover.
- **Portfolio cards (`PortfolioSection`):** existing TiltCard kept; add `BorderBeam` on hover and image scale-on-hover.
- **Testimonials marquee:** smooth infinite scroll (already there) + fade-edge masks tightened.
- **Metrics (`TestimonialsMetrics`, `TrustMetrics`):** `NumberTicker` on counters.
- **Process section:** `AnimatedBeam` connecting the steps (visualizes flow).
- **FAQ:** smoother accordion easing + chevron rotation.
- **Why-Me / Perfect-For:** staggered `BlurFade` per bullet.
- **Footer:** subtle `DotPattern` background.
- **Page transitions:** wrap routes in `AnimatePresence` with fade+slide.
- **Nav:** active link underline animation (`story-link`), shrink-on-scroll.
- **Cursor-aware glow:** keep existing `useMouseGlow` but enable on hero + cards.

## Performance guardrails

- All MagicUI canvas effects (`Meteors`, `Particles`) limited to hero only.
- `prefers-reduced-motion` respected — animations collapse to instant for users who opt out.
- Lazy-mount heavy effects with Intersection Observer so off-screen sections don't animate.
- Mobile: reduce particle/meteor counts ~50%, drop AnimatedBeam to static SVG.

## Technical details

**New files**
- `src/components/magicui/meteors.tsx`
- `src/components/magicui/particles.tsx`
- `src/components/magicui/aurora-text.tsx`
- `src/components/magicui/text-animate.tsx`
- `src/components/magicui/blur-fade.tsx`
- `src/components/magicui/shimmer-button.tsx`
- `src/components/magicui/border-beam.tsx`
- `src/components/magicui/magic-card.tsx`
- `src/components/magicui/number-ticker.tsx`
- `src/components/magicui/animated-beam.tsx`
- `src/components/magicui/dot-pattern.tsx`

**Edited files**
- `src/components/sections/HeroSection.tsx` — meteors/particles/aurora/shimmer
- `src/components/sections/ServicesSection.tsx` — MagicCard + BorderBeam
- `src/components/sections/PortfolioSection.tsx` — BorderBeam on hover
- `src/components/sections/ProcessSection.tsx` — AnimatedBeam
- `src/components/sections/TestimonialsMetrics.tsx`, `TrustMetrics.tsx` — NumberTicker
- `src/components/sections/FAQSection.tsx`, `WhyMeSection.tsx`, `PerfectForSection.tsx` — BlurFade
- `src/components/sections/Footer.tsx` — DotPattern
- `src/components/Navigation.tsx` — shrink on scroll, animated underline
- `src/App.tsx` — `AnimatePresence` route wrapper
- `tailwind.config.ts` — add `shimmer`, `aurora`, `beam`, `meteor` keyframes
- `src/index.css` — `@media (prefers-reduced-motion: reduce)` global override

## Out of scope (separate asks)
- Figma Desktop MCP setup (you can install Lovable Desktop yourself; I gave the steps above).
- 21st.dev / Google Stitch imports — paste any specific component you want and I'll wire it in after this pass.
- New copy/imagery — purely motion + interactivity.

Ready to switch to build mode and ship this when you approve.
