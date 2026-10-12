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
- Pre-optimize React and shared UI dependencies together in Vite so live previews do not mix dependency generations during incremental optimization.
