import type { ReactNode } from "react";

export type Article = {
  path: "/author-website-design-nonfiction-authors" | "/email-marketing-for-authors";
  title: string;
  description: string;
  category: string;
  intro: string;
  datePublished: string;
  dateModified: string;
  readingTime: string;
  keywords: string[];
  sections: { id: string; title: string; content: ReactNode }[];
  cta: string;
};

// Static editorial data is safe to share between route heads and the reading layout.
export const articleSummaries = [
  {
    path: "/author-website-design-nonfiction-authors",
    title: "Author website design for nonfiction authors: how to make your next step clear",
    description: "Learn what a nonfiction author website needs to connect your book with coaching, consulting, or speaking enquiries. Includes a simple website checklist.",
    category: "Author websites",
    datePublished: "2026-10-28",
    dateModified: "2026-11-04",
    readingTime: "6 min read",
    keywords: ["author website design", "nonfiction author website", "author website for coaches", "author website for consultants"],
    intro: "Author website design gives your book a home and your readers a clear next step. A book can introduce your ideas, but an author website helps readers understand what to do next. If you also coach, consult, or speak, your website should make your services, audience, and enquiry process clear.",
  },
  {
    path: "/email-marketing-for-authors",
    title: "Email marketing for authors: how to turn readers into enquiries",
    description: "A simple guide to email marketing for authors. Learn how to grow an email list, choose a lead magnet, and turn readers into future clients.",
    category: "Email marketing",
    datePublished: "2026-10-28",
    dateModified: "2026-11-04",
    readingTime: "7 min read",
    keywords: ["email marketing for authors", "author email list", "lead magnet for authors", "author newsletter ideas"],
    intro: "Email marketing for authors gives readers a way to stay connected after they finish your book. For nonfiction authors who offer coaching, consulting, or speaking, it also creates a natural path from reader to enquiry. Start with a useful resource, clear expectations, and emails that help before they ask.",
  },
] as const;

export function articleHead(article: Pick<Article, "path" | "title" | "description" | "datePublished" | "dateModified" | "keywords">) {
  const url = `https://theheroesagency.lovable.app${article.path}`;
  return {
    meta: [
      { title: `${article.title} · TheHeroes Agency` },
      { name: "description", content: article.description },
      { name: "keywords", content: article.keywords.join(", ") },
      { property: "og:title", content: article.title },
      { property: "og:description", content: article.description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
      { property: "article:published_time", content: article.datePublished },
      { property: "article:modified_time", content: article.dateModified },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({
      "@context": "https://schema.org", "@type": "BlogPosting", headline: article.title,
      description: article.description, url, mainEntityOfPage: url,
      datePublished: article.datePublished, dateModified: article.dateModified,
      keywords: article.keywords.join(", "),
      author: { "@type": "Person", name: "Mou Barrac" },
      publisher: { "@type": "Organization", name: "TheHeroes Agency" },
    }) }],
  };
}
