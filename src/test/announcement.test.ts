import { describe, expect, it } from "vitest";
import { ANNOUNCEMENT_ITEMS, BOOKING_URL } from "@/components/site";

describe("Announcement bar", () => {
  it("links the first message to the booking call", () => {
    expect(ANNOUNCEMENT_ITEMS[0].href).toBe(BOOKING_URL);
  });
  it("links the second message to the packages page", () => {
    expect(ANNOUNCEMENT_ITEMS[1].href).toBe("/pricing");
  });
});
