import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/article-page";
import { emailArticle } from "@/lib/article-content";
import { articleHead } from "@/lib/articles";

export const Route = createFileRoute("/email-marketing-for-authors")({
  staticData: { sitemap: true },
  head: () => articleHead(emailArticle),
  component: EmailMarketingArticle,
});

function EmailMarketingArticle() {
  return <ArticlePage article={emailArticle} />;
}