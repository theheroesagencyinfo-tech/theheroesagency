import { describe, it, expect } from "vitest";
import { invoiceLines, progressOf } from "@/lib/packages";
import { packages, packageAmounts, addons, addonAmounts, RUSH_AMOUNT } from "@/lib/packages";
import { threePaymentAmounts } from "@/lib/pricing-values";

describe("invoice", () => {
  it("uses the confirmed starting prices for packages and invoices", () => {
    expect(packageAmounts).toEqual({ "book-presence": 1500, "reader-to-client": 3000, "book-launch": 5500 });
    for (const pkg of packages) {
      expect(Number(pkg.price.replace(/[$,]/g, ""))).toBe(packageAmounts[pkg.slug]);
      expect(invoiceLines(pkg.slug, [], false).oneOff).toBe(packageAmounts[pkg.slug]);
    }
  });
  it("splits the $5,500 launch price into three cent-exact payments", () => {
    const amounts = threePaymentAmounts(5500);
    expect(amounts).toEqual([1833.33, 1833.33, 1833.34]);
    expect(amounts.reduce((sum, amount) => sum + Math.round(amount * 100), 0)).toBe(550000);
  });
  it("includes launch one-off extras in installments but excludes monthly services", () => {
    const inv = invoiceLines("book-launch", ["speaker-page", "maintenance"], true);
    expect(inv.oneOff).toBe(6050);
    expect(inv.monthly).toBe(150);
    expect(threePaymentAmounts(inv.oneOff)).toEqual([2016.66, 2016.66, 2016.68]);
  });
  it("keeps every displayed add-on price aligned with invoice amounts", () => {
    expect(RUSH_AMOUNT).toBe(150);
    expect(Object.values(addonAmounts).map(a => a.amount)).toEqual([350, 500, 250, 400, 400, 500, 150, 750]);
    for (const addon of addons) {
      expect(Number(addon.price.replace(/[^0-9.]/g, ""))).toBe(addonAmounts[addon.id]?.amount);
    }
  });
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
