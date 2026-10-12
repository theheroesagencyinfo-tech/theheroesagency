import { createFileRoute } from "@tanstack/react-router";
import { CONTACT_EMAIL } from "@/components/site";
import { ReviewForm } from "@/components/ReviewForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TheHeroes Author Studio" },
      { name: "description", content: "Request a free author site review or email Hero at TheHeroes Author Studio." },
      { property: "og:title", content: "Contact — TheHeroes Author Studio" },
      { property: "og:description", content: "Request a free author site review." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Contact</p>
        <h1 className="mt-6 max-w-[16ch] text-5xl leading-[1.05]">Request your free author site review.</h1>
        <p className="mt-6 max-w-[55ch] text-lg text-muted-foreground">
          Tell me about your book. I'll review your site and email you practical notes, or answer whatever you'd like to ask.
        </p>
        <div className="mt-10 border-t pt-6">
          <p className="text-sm text-muted-foreground">Prefer email?</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 inline-block font-serif text-2xl underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
      <ReviewForm />
    </section>
  );
}
