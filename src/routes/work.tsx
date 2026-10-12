import { createFileRoute } from "@tanstack/react-router";
import { ComingNext } from "@/components/site";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — TheHeroes Author Studio" },
      { name: "description", content: "Work at TheHeroes Author Studio, websites and launch funnels for nonfiction authors." },
      { property: "og:title", content: "Work — TheHeroes Author Studio" },
      { property: "og:description", content: "Websites and launch funnels for nonfiction authors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/work" }],
  }),
  component: () => <ComingNext title="Work" />,
});
