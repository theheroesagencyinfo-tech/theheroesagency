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
- Use the existing validated request server function for review and quote forms, storing service, message, and request_type separately so requests retain their intent.
- Keep sample project details on their own content route; omit results until verified data exists.
- Uploaded author website showcases use dedicated project routes and asset-pointer imports, keeping screenshot navigation local to each showcase so existing projects remain independent.
- Pre-optimize React and shared UI dependencies together in Vite so live previews do not mix dependency generations during incremental optimization.
- Use the shared ImagePlaceholder where a visual belongs so pages keep their structure until real assets arrive; never ship generated or stock imagery as a stand-in.
- Keep the "What I build" list a plain static list with no scroll-driven animation or sticky reveal; the user asked for that motion removed.
- Keep legal documents in a shared browser-safe policy module and render dedicated policy routes with LegalPage; reuse its revision wording in package and service copy to prevent contradictory promises.
- Enforce country access in the server entry before dispatch using trusted request.cf country metadata, never caller headers; keep blocked responses uncached so restrictions cannot leak to other visitors.
