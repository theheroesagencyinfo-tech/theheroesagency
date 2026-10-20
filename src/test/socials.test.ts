import { describe, expect, it } from "vitest";
import { SOCIALS } from "@/components/site";

const hrefFor = (label: string) => SOCIALS.find((s) => s.label === label)?.href;

describe("Social links", () => {
  it("links TikTok to @moubarrac", () => {
    expect(hrefFor("TikTok")).toBe("https://www.tiktok.com/@moubarrac");
  });
  it("links X to @moubarrac", () => {
    expect(hrefFor("X")).toBe("https://x.com/moubarrac");
  });
  it("links Instagram and Threads to @theheroes_authorstudio", () => {
    expect(hrefFor("Instagram")).toBe("https://www.instagram.com/theheroes_authorstudio");
    expect(hrefFor("Threads")).toBe("https://www.threads.com/@theheroes_authorstudio");
  });
  it("lists one entry per profile, each with a renderable icon and handle", () => {
    expect(SOCIALS).toHaveLength(6);
    for (const s of SOCIALS) {
      expect(s.handle).toBeTruthy();
      // lucide icons are forwardRef objects; the inline ones are plain functions
      const renderable =
        typeof s.icon === "function" || (typeof s.icon === "object" && "$$typeof" in s.icon);
      expect(renderable).toBe(true);
    }
  });
});
