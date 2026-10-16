import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, legalHead } from "@/components/legal-page";
import { privacyDocument } from "@/lib/legal-policy";

export const Route = createFileRoute("/privacy")({
  head: () => legalHead(privacyDocument),
  component: () => <LegalPage document={privacyDocument} />,
});