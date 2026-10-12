import { createFileRoute } from "@tanstack/react-router";
import { ComingNext } from "@/components/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — TheHeroes Author Studio" },
      { name: "description", content: "Services at TheHeroes Author Studio, websites and launch funnels for nonfiction authors." },
      { property: "og:title", content: "Services — TheHeroes Author Studio" },
      { property: "og:description", content: "Websites and launch funnels for nonfiction authors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: () => <ComingNext title="Services" />,
});
