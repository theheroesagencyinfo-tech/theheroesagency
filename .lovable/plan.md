# Premium account and admin transformation

## Goal
Elevate the existing client portal and admin area into an editorial author-studio experience. Preserve working accounts, client information, project controls, referral rules, prices, and private uploads. Keep public website pages unchanged.

## Client experience
- **Account:** full-name identity, first-name welcome, avatar and membership medal; elegant Projects, Refer & rewards, and Settings navigation. Retain admin-only access and sign-out.
- **Projects:** feature the newest active project, keep every other project accessible, and give book titles, actual task progress, next task, and dates a clear hierarchy. Connect the existing four-stage roadmap with a thin line. Do not invent covers when artwork is unavailable.
- **Concierge:** Mou’s existing portrait, studio identity, support email, and the existing 15-minute booking link; beside projects on desktop and beneath them on mobile.
- **Project workspace:** refined task list, current milestone, existing preview links, private design gallery, and chronological studio updates. Clients remain read-only; the administrator controls progress.
- **Invoice:** premium branded layout with current invoice number, client details, package, add-ons, calculated installments, and clean print/PDF output. Preserve non-new-order availability and cent-exact calculations. Do not imply payment has been received without authoritative payment data.
- **Rewards:** membership overview, converted/pending referral summaries, expiration information, searchable tracker with deposit status, all existing sharing actions, seven-tier ladder, and teaser desk. Keep every existing teaser field and eligibility rule.
- **Settings:** editorial profile/photo and security sections with current validation, confirmation feedback, read-only email, and direct support contact.

## Admin experience
- **Shell:** compact midnight sidebar, refined active navigation and counts, account/sign-out actions, and spacious main content. Accessible mobile drawer.
- **Overview:** four existing metrics plus five latest orders and messages, with book/package/date/status and message previews.
- **Orders:** searchable, sortable, status-filtered presentation with all existing notes, add-ons, rush and call preferences, project access, status controls and deletion confirmation.
- **Reviews:** clear reviewer/project/rating/date/approval presentation; preserve approve, hide, and delete.
- **Messages:** searchable, filterable inbox with distinct quote/free-review requests, expanded message details, email replies, and deletion.
- **Project management:** cohesive task, design-file, page-link and studio-update sections. Retain existing creation, completion, upload, and removal actions; add task/link editing using existing fields where supported.
- **Referrals:** refined pipeline, client directory, tier overrides and teaser queue; retain all existing conversion and deposit requirements.

## Visual standards
Use Newsreader/Figtree, deep ink, ivory, forest green, midnight pitch and soft stone. Introduce sparse brass only for membership details. Apply portal-scoped tokens so public pages do not change. Keep contrast safe in system dark mode, borders thin, radii controlled, and sections mostly unframed. Use existing button components and Lucide controls. No stock or generated imagery, gradients, or scroll-driven motion.

## Technical boundaries
- Reuse existing TanStack routes, browser data access, role verification, storage signing and shared pricing/loyalty modules.
- No database migrations, new authentication system, changed permissions, or replacement pricing/referral logic.
- Roadmap stages remain inferred from task progress; do not represent them as independently recorded milestones.
- Do not promise automatic live synchronization or fabricate last-updated timestamps. Refresh through existing reads after edits.
- Maintain private-page indexing protections and existing route metadata.

## Delivery and verification
1. Portal styling and shared primitives.
2. Complete client account, workspace, invoice, rewards and settings transformation.
3. Complete admin shell and every operational section.
4. Run existing pricing, invoice and loyalty tests; exercise authenticated navigation and representative non-destructive actions against real records.
5. Inspect desktop, tablet, phone and the current narrow preview width for overflow, text clipping, dark-mode contrast and console errors. Verify private design links and print presentation where real records exist. State any checks blocked by unavailable accounts or assets.

Preserve data during verification: do not delete real orders/messages, change passwords, or convert real referrals merely to test the redesign.