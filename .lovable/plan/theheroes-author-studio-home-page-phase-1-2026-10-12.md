# TheHeroes Author Studio — Home page (phase 1)

Build the Home page first, exactly per the brief. Other pages (Services, Work, About, Contact) come after you approve Home.

## Look and feel
- Editorial, book-like: Newsreader serif headlines, Figtree body, left-aligned, generous whitespace, text lines under 70 characters.
- Palette: ink navy #151832, periwinkle #B9C3FF (only accent), off-white #F3F4FB. Light mode = off-white page with navy text; dark mode = navy page with off-white text. Follows the visitor's system setting, with a small toggle in the header.
- Motion only on the hero entrance (gentle fade/rise) and button hovers. No stock photos, logos, or testimonials.

## Home page sections
1. Sticky header: "TheHeroes Author Studio" wordmark, links (Services, Work, About, Contact), persistent "Free review" button that jumps to the form.
2. Hero: headline, subline, buttons "Get my free author site review" and "See my work".
3. What I build: table-of-contents style with dotted leaders — Author website (credibility), Email funnel (leads), Launch kit (momentum), one line each.
4. Why authors need this: 3 short points on the book as the start of a funnel.
5. Selected work: card for the sample author site with "View sample site", plus a clearly marked "Your book could be here" slot.
6. How it works: 3 numbered steps.
7. Free author site review form: name, email, book title or topic, website (optional), button "Send my request", inline validation and a success message.
8. Footer with nav and email.

Nav links to the other pages will point to simple "coming next" pages so nothing is broken until they're built.

## Form submissions
Requests are saved in Lovable Cloud (a "review requests" list you can open in Cloud → Database). Email alerts to you can be added later once a domain is verified.

## Things I'll fill in for now
- Sample site link and contact email are placeholders until you send the real ones.

## Technical details
- TanStack routes: index, services, work, about, contact; per-route head() meta.
- Design tokens in src/styles.css (oklch), fonts via link in __root.
- Enable Lovable Cloud; table `review_requests` with RLS (no public read); server function with zod validation inserts rows.
