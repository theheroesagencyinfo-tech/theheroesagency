import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/page";
import { ReviewForm } from "@/components/ReviewForm";

export const Route = createFileRoute("/custom-package")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Custom package · TheHeroes Agency · Author Studio" },
    { name: "description", content: "Tell me exactly what you need for your nonfiction book and get a custom price before anything is built." },
    { property: "og:title", content: "Request a custom package · TheHeroes Agency" },
    { property: "og:description", content: "Describe the website, emails or launch support you need and receive a custom quote." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: CustomPackage,
});

function CustomPackage() {
  return <>
    <PageIntro label="Custom package" title="Tell me what you need. I'll price it for you.">
      Not every book fits a set package. Describe the pages, emails, launch support or anything else you have in mind, and I'll reply with a written scope and price. Nothing is charged until you approve it.
    </PageIntro>
    <section className="border-t bg-secondary"><div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-16 md:grid-cols-[1fr_1.4fr]">
      <div>
        <h2 className="text-4xl">What to include.</h2>
        <ul className="mt-6 space-y-3 text-muted-foreground">
          <li>What you want built or done</li><li>Your launch date or deadline</li><li>Any budget range you have in mind</li><li>Links to sites you like</li>
        </ul>
        <p className="mt-8 text-sm">Prefer a set package? <Link to="/pricing" hash="packages" className="underline underline-offset-4">See packages</Link></p>
      </div>
      <ReviewForm mode="quote" selectedService="custom package" />
    </div></section>
  </>;
}
