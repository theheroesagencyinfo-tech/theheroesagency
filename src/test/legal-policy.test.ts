import { describe, expect, it } from "vitest";
import { legalPolicy } from "@/lib/legal-policy";

describe("owner-confirmed legal policy rules", () => {
  it("allows 60 days of client-caused delay before project closure", () => {
    expect(legalPolicy.clientPauseClosureDays).toBe(60);
  });
  it("reviews eligible refund requests within five business days", () => {
    expect(legalPolicy.refundReviewBusinessDays).toBe(5);
  });
  it("includes unlimited revisions within the agreed scope", () => {
    expect(legalPolicy.unlimitedRevisionsWithinScope).toBe(true);
  });
});