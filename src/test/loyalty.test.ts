import { describe, it, expect } from "vitest";
import { LEVELS, levelFor, nextLevel, isReferralCode } from "@/lib/loyalty";

describe("loyalty levels", () => {
  it("has seven levels", () => expect(LEVELS).toHaveLength(7));
  it("starts at level 1 with no referrals", () => expect(levelFor(0).level).toBe(1));
  it("reaches level 2 at 1 referral", () => expect(levelFor(1).level).toBe(2));
  it("stays level 4 at 4 referrals", () => expect(levelFor(4).level).toBe(4));
  it("reaches level 5 at 5 referrals", () => expect(levelFor(5).level).toBe(5));
  it("reaches level 7 at 12 referrals", () => expect(levelFor(12).level).toBe(7));
  it("has no next level after 7", () => expect(nextLevel(20)).toBeNull());
  it("next level after 3 needs 5", () => expect(nextLevel(3)?.min).toBe(5));
  it("validates codes", () => { expect(isReferralCode("HERO-AB12CD")).toBe(true); expect(isReferralCode("x")).toBe(false); });
});
