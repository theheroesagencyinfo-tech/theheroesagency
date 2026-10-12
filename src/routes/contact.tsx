import { createFileRoute } from "@tanstack/react-router";
import { ComingNext } from "@/components/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TheHeroes Author Studio" },
      { name: "description", content: "Contact at TheHeroes Author Studio, websites and launch funnels for nonfiction authors." },
      { property: "og:title", content: "Contact — TheHeroes Author Studio" },
      { property: "og:description", content: "Websites and launch funnels for nonfiction authors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: () => <ComingNext title="Contact" />,
});
