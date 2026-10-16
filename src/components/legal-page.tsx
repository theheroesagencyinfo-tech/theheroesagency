import { Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/page";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/components/site";
import { legalPolicy, policyFooterNote, type LegalDocument } from "@/lib/legal-policy";

const policyLinks = [
  { to: "/terms", label: "Terms of service" },
  { to: "/privacy", label: "Privacy policy" },
  { to: "/refund-policy", label: "Refund policy" },
] as const;

export function legalHead(document: LegalDocument) {
  const title = `${document.title} · TheHeroes Agency`;
  return { meta: [
    { title },
    { name: "description", content: document.description },
    { property: "og:title", content: title },
    { property: "og:description", content: document.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] };
}

export function LegalPage({ document }: { document: LegalDocument }) {
  return <>
    <PageIntro label="Our policies" title={document.title}>{document.description}</PageIntro>
    <div className="mx-auto max-w-6xl px-5 pb-10">
      <p className="text-sm text-muted-foreground">Last updated: <time dateTime={legalPolicy.updatedAt}>16 October 2026</time></p>
      <nav aria-label="Legal policies" className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
        {policyLinks.map(link => <Link key={link.to} to={link.to} className="underline underline-offset-4" activeProps={{ className: "font-semibold text-primary" }}>{link.label}</Link>)}
      </nav>
    </div>
    <div className="border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
        <aside>
          <nav aria-label="On this page" className="lg:sticky lg:top-28">
            <h2 className="font-sans text-sm font-semibold">On this page</h2>
            <ol className="mt-4 grid gap-2 border-l pl-4 text-sm text-muted-foreground">
              {document.sections.map(section => <li key={section.id}><a className="inline-block py-1 hover:text-primary focus-visible:outline-ring" href={`#${section.id}`}>{section.title}</a></li>)}
              <li><a className="inline-block py-1 hover:text-primary" href="#policy-contact">Contact</a></li>
            </ol>
          </nav>
        </aside>
        <article className="min-w-0 max-w-[72ch]">
          {document.sections.map((section, index) => <section key={section.id} id={section.id} className="scroll-mt-28 border-b pb-9 [&+section]:pt-9">
            <h2 className="text-2xl sm:text-3xl"><span className="mr-3 font-sans text-sm text-primary">{String(index + 1).padStart(2, "0")}</span>{section.title}</h2>
            <div className="mt-5 space-y-4 leading-7 text-muted-foreground">
              {section.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && <ul className="list-disc space-y-2 pl-5 marker:text-primary">{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
              {section.closing && <p>{section.closing}</p>}
            </div>
          </section>)}
          <section id="policy-contact" className="scroll-mt-28 pt-9">
            <h2 className="text-2xl sm:text-3xl">Contact</h2>
            <p className="mt-5 text-muted-foreground">For questions about this policy, contact TheHeroes Agency.</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-3 block break-words text-primary underline underline-offset-4">{CONTACT_EMAIL}</a>
            <Button asChild variant="studioOutline" size="studio" className="mt-6"><Link to="/contact">Contact TheHeroes Agency</Link></Button>
            <p className="mt-8 text-sm"><Link to="/" className="text-muted-foreground underline underline-offset-4">TheHeroes Agency website</Link></p>
          </section>
        </article>
      </div>
    </div>
    <section className="border-t bg-secondary"><div className="mx-auto max-w-6xl px-5 py-10"><p className="max-w-[70ch] text-muted-foreground leading-7">{policyFooterNote}</p></div></section>
  </>;
}