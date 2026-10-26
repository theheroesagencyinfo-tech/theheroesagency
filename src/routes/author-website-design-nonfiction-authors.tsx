import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/article-page";
import { websiteArticle } from "@/lib/article-content";
import { articleHead } from "@/lib/articles";

export const Route = createFileRoute("/author-website-design-nonfiction-authors")({
  staticData: { sitemap: true },
  head: () => articleHead(websiteArticle),
  component: AuthorWebsiteArticle,
});

function AuthorWebsiteArticle() {
  return <ArticlePage article={websiteArticle} />;
}