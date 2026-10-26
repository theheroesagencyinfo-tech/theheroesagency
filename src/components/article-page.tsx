import { Link } from "@tanstack/react-router";
import { PageIntro, ReviewCta } from "@/components/page";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { Button } from "@/components/ui/button";
import { assetSrc } from "@/components/site";
import type { Article } from "@/lib/articles";

export function ArticlePage({ article }: { article: Article }) {
  return <>
    <article>
      <PageIntro label={article.category} title={article.title}>{article.intro}</PageIntro>
      <div className="mx-auto max-w-[1500px] px-5 pb-16">
        <div className="grid items-start gap-12 lg:grid-cols-[240px_minmax(0,1fr)]">
          <nav aria-label="Article contents" className="border-t pt-5">
            <Link to="/blog" className="text-sm underline underline-offset-4">← All articles</Link>
            <p className="mt-8 text-sm font-semibold">In this article</p>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">{article.sections.map(section => <li key={section.id}><a href={`#${section.id}`} className="underline-offset-4 hover:underline">{section.title}</a></li>)}</ol>
          </nav>
          <div className="min-w-0 max-w-[80ch]">
            <figure>
              <div className="aspect-[16/10] overflow-hidden border bg-secondary"><img src={assetSrc(article.image)} alt={article.imageAlt} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" /></div>
              <figcaption className="mt-3 text-sm text-muted-foreground">{article.imageCaption}</figcaption>
            </figure>
            {article.sections.map(section => <section key={section.id} id={section.id} className="scroll-mt-36 mt-12 border-t pt-8">
              <h2 className="text-3xl sm:text-4xl">{section.title}</h2>
              <div className="mt-5 space-y-5 text-lg leading-relaxed text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:space-y-3 [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:space-y-3 [&_ul]:pl-6 [&_strong]:font-semibold [&_strong]:text-foreground">{section.content}</div>
            </section>)}
            <div className="mt-12 border-t pt-8">
              <p className="text-lg text-muted-foreground">{article.cta}</p>
              <Button asChild variant="studio" size="studio" className="mt-5"><Link to="/contact">Discuss my setup</Link></Button>
            </div>
          </div>
        </div>
      </div>
    </article>
    <section className="border-t bg-secondary"><div className="mx-auto max-w-[1500px] px-5 py-12"><NewsletterSignup /></div></section>
    <ReviewCta />
  </>;
}