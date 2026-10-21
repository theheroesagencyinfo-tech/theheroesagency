import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, legalHead } from "@/components/legal-page";
import { refundDocument } from "@/lib/legal-policy";

export const Route = createFileRoute("/refund-policy")({
  staticData: { sitemap: true },
  head: () => legalHead(refundDocument),
  component: () => <LegalPage document={refundDocument} />,
});