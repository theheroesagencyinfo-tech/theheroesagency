import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, ReviewCta } from "@/components/page";
import { Button } from "@/components/ui/button";
import { assetSrc } from "@/components/site";
import { articleSummaries } from "@/lib/articles";

export const Route = createFileRoute("/blog")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Author website and email marketing guides · TheHeroes Agency" },
      { name: "description", content: "Practical guides for nonfiction authors on website design, reader resources, email lists, and connecting your book to coaching, consulting, or speaking." },
      { property: "og:title", content: "Author website and email marketing guides · TheHeroes Agency" },
      { property: "og:description", content: "Clear, practical guidance for building your nonfiction author platform." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://theheroesagency.lovable.app/blog" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://theheroesagency.lovable.app/blog" }],
  }),
  component: Blog,
});

function Blog() {
  return <>
    <PageIntro label="Journal" title="Ideas for your author platform.">Practical notes on connecting your book, your website, and your wider work.</PageIntro>
    <section className="border-t"><div className="mx-auto grid max-w-[1500px] gap-14 px-5 py-16 md:grid-cols-2">
      {articleSummaries.map(article => <article key={article.path} className="min-w-0">
        <Link to={article.path} aria-label={`Read ${article.title}`}><div className="aspect-[16/10] overflow-hidden border bg-secondary"><img src={assetSrc(article.image)} alt={article.imageAlt} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" /></div></Link>
        <p className="mt-5 text-sm text-muted-foreground">{article.category}</p>
        <h2 className="mt-3 text-3xl"><Link to={article.path}>{article.title}</Link></h2>
        <p className="mt-4 max-w-[60ch] text-muted-foreground">{article.description}</p>
        <Button asChild variant="studioOutline" size="studio" className="mt-6"><Link to={article.path}>Read article <span aria-hidden>↗</span></Link></Button>
      </article>)}
    </div></section>
    <ReviewCta />
  </>;
}