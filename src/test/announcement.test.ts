import { describe, expect, it } from "vitest";
import { ANNOUNCEMENT_ITEMS } from "@/components/site";

const text = ANNOUNCEMENT_ITEMS.join(" ");

describe("Announcement bar offer", () => {
  it("states the discount", () => {
    expect(text).toContain("30% off");
  });
  it("states the closing date", () => {
    expect(text).toContain("12 December");
  });
  it("names the work the discount applies to", () => {
    expect(text).toContain("author website project");
  });
});
