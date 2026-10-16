import { describe, it, expect } from "vitest";
import { invoiceLines, progressOf } from "@/lib/packages";

describe("invoice", () => {
  it("splits reader-to-client 40/30/30", () => {
    const inv = invoiceLines("reader-to-client", [], false);
    expect(inv.oneOff).toBe(3000);
    expect(inv.schedule.map(s => s.amount)).toEqual([1200, 900, 900]);
  });
  it("adds add-ons and rush to the one-off total, monthly separately", () => {
    const inv = invoiceLines("book-presence", ["speaker-page", "maintenance"], true);
    expect(inv.oneOff).toBe(1500 + 400 + 150);
    expect(inv.monthly).toBe(150);
  });
  it("splits book launch 50/50", () => {
    expect(invoiceLines("book-launch", [], false).schedule.map(s => s.amount)).toEqual([2750, 2750]);
  });
});
describe("progress", () => {
  it("is the share of tasks marked done", () => {
    expect(progressOf([{ done: true }, { done: false }, { done: true }, { done: false }])).toBe(50);
    expect(progressOf([])).toBe(0);
  });
});
