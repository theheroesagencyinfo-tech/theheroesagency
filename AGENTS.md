<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use shared PageIntro, ReviewCta, and studio Button variants for content pages to keep heading scale, spacing, and controls consistent.
- Select the shared header/footer logo with a picture source using prefers-color-scheme, matching the site's system-driven color tokens without requiring a dark class.
- Use the existing validated request server function for review and quote forms, storing service, message, and request_type separately so requests retain their intent.
- Keep sample project details on their own content route; omit results until verified data exists.
- Uploaded author website showcases use dedicated project routes and asset-pointer imports, keeping screenshot navigation local to each showcase so existing projects remain independent.
- Pre-optimize React and shared UI dependencies together in Vite so live previews do not mix dependency generations during incremental optimization.
- Use the shared ImagePlaceholder where a visual belongs so pages keep their structure until real assets arrive; never ship generated or stock imagery as a stand-in.
- Keep the "What I build" list a plain static list with no scroll-driven animation or sticky reveal; the user asked for that motion removed.
- Keep legal documents in a shared browser-safe policy module and render dedicated policy routes with LegalPage; reuse its revision wording in package and service copy to prevent contradictory promises.
- Share numeric package prices and cent-exact installment calculations in a browser-safe pricing module so package pages, legal terms, and invoices agree without circular imports.
- Enforce country access in the server entry before dispatch using trusted request.cf country metadata, never caller headers; disable page prerendering and keep blocked responses uncached so delivery cannot bypass the gate or leak restrictions to other visitors.

- Derive sitemap URLs from explicit staticData.sitemap decisions on every route; exclude the authenticated subtree and transaction pages, and omit lastmod without page-specific change timestamps so the sitemap stays accurate.
- Keep editorial guides in a browser-safe article module and render each from its own static leaf route through a shared article layout so metadata, links, and content remain aligned.
- Compute referral tiers in the browser-safe loyalty module from converted referral dates plus optional admin override, while database triggers enforce conversion, self-referral and teaser eligibility rules so UI and data cannot disagree.
- Scope authenticated editorial styling under `.portal` and retain existing data access and calculation modules, so dashboard refinements do not restyle public pages or change business rules.

- Client project pages share `src/components/project-workspace.tsx` (cover, notes, messages with attachments under `<order_id>/messages/`) with the admin order page and the account Messages tab; sender role is stamped by a database trigger, never trusted from the client.
- Referral share links use the brand domain constant in loyalty.ts and the short /r/<code> route, never the hosting origin.
- Portal routes (/account, /admin, /my-projects) hide the public header, announcement bar and footer in __root.
