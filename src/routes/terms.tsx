import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, legalHead } from "@/components/legal-page";
import { termsDocument } from "@/lib/legal-policy";

export const Route = createFileRoute("/terms")({
  staticData: { sitemap: true },
  head: () => legalHead(termsDocument),
  component: () => <LegalPage document={termsDocument} />,
});