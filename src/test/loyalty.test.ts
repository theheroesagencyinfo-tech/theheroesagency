import { describe, it, expect } from "vitest";
import { LEVELS, levelFor, nextLevel, isReferralCode, tierFrom } from "@/lib/loyalty";

describe("loyalty levels", () => {
  it("has seven levels", () => expect(LEVELS).toHaveLength(7));
  it("starts at level 1 with no referrals", () => expect(levelFor(0).level).toBe(1));
  it("reaches level 2 at 1 converted referral", () => expect(levelFor(1).level).toBe(2));
  it("reaches level 4 at 3", () => expect(levelFor(3).level).toBe(4));
  it("reaches level 6 at 7", () => expect(levelFor(7).level).toBe(6));
  it("reaches level 7 at 10", () => expect(levelFor(10).level).toBe(7));
  it("discounts match the ladder", () => expect(LEVELS.map(l => l.discount)).toEqual([0, 100, 200, 300, 400, 500, 750]));
  it("teasers start at level 4", () => expect(LEVELS.filter(l => l.teaser).map(l => l.level)).toEqual([4, 5, 6, 7]));
  it("strategy session only at level 7", () => expect(LEVELS.filter(l => l.strategy).map(l => l.level)).toEqual([7]));
  it("has no next level after 7", () => expect(nextLevel(20)).toBeNull());
  it("validates codes", () => { expect(isReferralCode("HERO-AB12CD")).toBe(true); expect(isReferralCode("x")).toBe(false); });
});

describe("tier expiry", () => {
  const now = new Date("2026-10-31");
  it("keeps a tier within 12 months of earning it", () => expect(tierFrom(["2026-01-10"], now).level.level).toBe(2));
  it("drops a tier after 12 months with no recent referrals", () => expect(tierFrom(["2025-01-10"], now).level.level).toBe(1));
  it("retains a lapsed tier with enough recent referrals", () =>
    expect(tierFrom(["2024-01-01", "2026-03-01", "2026-04-01"], now).level.level).toBe(3));
  it("applies an admin override", () => expect(tierFrom([], now, 5).level.level).toBe(5));
});
