import { describe, it, expect } from "vitest";
import {
  deriveFocusKeyword,
  buildMetaTitle,
  buildMetaDescription,
  deriveKeywords,
  SEO_LIMITS,
} from "./seoMeta";

describe("seoMeta", () => {
  it("derives a focus keyword from a title, skipping stopwords", () => {
    expect(deriveFocusKeyword("How to hire a Shopify marketing agency in 2026"))
      .toBe("hire shopify marketing");
  });

  it("builds a meta title with brand when within 60 chars", () => {
    const t = buildMetaTitle({ title: "Shopify CRO Checklist" });
    expect(t).toContain("The Heroes Agency");
    expect(t.length).toBeLessThanOrEqual(SEO_LIMITS.MAX_TITLE);
  });

  it("truncates long titles instead of appending brand", () => {
    const long = "A very long title that exceeds the sixty character limit for sure";
    const t = buildMetaTitle({ title: long });
    expect(t.length).toBeLessThanOrEqual(SEO_LIMITS.MAX_TITLE);
    expect(t).not.toContain("|");
  });

  it("builds a meta description within 155 chars and prepends keyword when missing", () => {
    const d = buildMetaDescription({
      excerpt: "Tested fixes that lift conversion across product and checkout pages.",
      focusKeyword: "Shopify CRO",
    });
    expect(d.startsWith("Shopify CRO:")).toBe(true);
    expect(d.length).toBeLessThanOrEqual(SEO_LIMITS.MAX_DESC);
  });

  it("does not duplicate the keyword if already present", () => {
    const d = buildMetaDescription({
      excerpt: "Shopify CRO playbook for DTC brands.",
      focusKeyword: "Shopify CRO",
    });
    expect(d.startsWith("Shopify CRO:")).toBe(false);
  });

  it("derives keyword list including focus keyword", () => {
    const k = deriveKeywords({
      title: "Klaviyo Email Automation for DTC Brands",
      focusKeyword: "klaviyo email automation",
    });
    expect(k[0]).toBe("klaviyo email automation");
    expect(k).toContain("klaviyo");
  });
});
