import { createFileRoute } from "@tanstack/react-router";
import { ComingNext } from "@/components/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — TheHeroes Author Studio" },
      { name: "description", content: "About at TheHeroes Author Studio, websites and launch funnels for nonfiction authors." },
      { property: "og:title", content: "About — TheHeroes Author Studio" },
      { property: "og:description", content: "Websites and launch funnels for nonfiction authors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: () => <ComingNext title="About" />,
});
