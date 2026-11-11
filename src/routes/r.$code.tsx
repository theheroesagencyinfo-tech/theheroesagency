import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

// Short referral links: the root ReferralCapture stores the code from this path, then we go home.
export const Route = createFileRoute("/r/$code")({
  staticData: { sitemap: false },
  head: () => ({ meta: [
    { title: "You've been invited · TheHeroes Agency" },
    { name: "description", content: "An author invited you to TheHeroes Agency, the studio for nonfiction author websites." },
    { property: "og:title", content: "You've been invited to TheHeroes Agency" },
    { property: "og:description", content: "Author websites and launch systems for nonfiction authors." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: ShortRef,
});

function ShortRef() {
  const navigate = useNavigate();
  useEffect(() => { const t = setTimeout(() => navigate({ to: "/", replace: true }), 50); return () => clearTimeout(t); }, [navigate]);
  return <p className="mx-auto max-w-[1500px] px-5 py-20 text-muted-foreground">Taking you to TheHeroes Agency…</p>;
}
