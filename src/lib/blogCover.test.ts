import { describe, it, expect } from "vitest";
import { shouldRegenerateCover, buildScheduledPostInsert } from "./blogCover";

describe("shouldRegenerateCover — admin create / publish / edit flows", () => {
  it("creates: regenerates when no cover URL is set", () => {
    expect(
      shouldRegenerateCover({
        form: { title: "How to scale Shopify", excerpt: "x", cover_image_url: "" },
        editing: null,
      }),
    ).toBe(true);
  });

  it("creates: keeps a manually pasted cover URL", () => {
    expect(
      shouldRegenerateCover({
        form: {
          title: "How to scale Shopify",
          excerpt: "x",
          cover_image_url: "https://example.com/cover.png",
        },
        editing: null,
      }),
    ).toBe(false);
  });

  it("edits: backfills when the existing post has no cover", () => {
    expect(
      shouldRegenerateCover({
        form: { title: "Same title", excerpt: "same", cover_image_url: "" },
        editing: { title: "Same title", excerpt: "same", cover_image_url: null },
      }),
    ).toBe(true);
  });

  it("edits: regenerates when the title changes", () => {
    expect(
      shouldRegenerateCover({
        form: { title: "New sharper title", excerpt: "x", cover_image_url: "https://cdn/old.png" },
        editing: { title: "Old title", excerpt: "x", cover_image_url: "https://cdn/old.png" },
      }),
    ).toBe(true);
  });

  it("edits: regenerates when the excerpt changes", () => {
    expect(
      shouldRegenerateCover({
        form: { title: "Same", excerpt: "rewritten excerpt", cover_image_url: "https://cdn/old.png" },
        editing: { title: "Same", excerpt: "old excerpt", cover_image_url: "https://cdn/old.png" },
      }),
    ).toBe(true);
  });

  it("edits: leaves the cover alone when neither title nor excerpt changed", () => {
    expect(
      shouldRegenerateCover({
        form: { title: "Same", excerpt: "same", cover_image_url: "https://cdn/old.png" },
        editing: { title: "Same", excerpt: "same", cover_image_url: "https://cdn/old.png" },
      }),
    ).toBe(false);
  });

  it("edits: treats null and empty-string excerpt as equivalent (no regen)", () => {
    expect(
      shouldRegenerateCover({
        form: { title: "Same", excerpt: "", cover_image_url: "https://cdn/old.png" },
        editing: { title: "Same", excerpt: null, cover_image_url: "https://cdn/old.png" },
      }),
    ).toBe(false);
  });
});

describe("buildScheduledPostInsert — weekly scheduled job", () => {
  const base = {
    title: "Weekly post",
    excerpt: "Weekly excerpt",
    content: "<p>body</p>",
    slug: "weekly-post-2026-01-01-abcd",
    publishedAt: "2026-01-01T00:00:00.000Z",
  };

  it("always includes the cover_image_url field, even when null", () => {
    const row = buildScheduledPostInsert({ ...base, coverUrl: null });
    expect(row).toHaveProperty("cover_image_url");
    expect(row.cover_image_url).toBeNull();
  });

  it("propagates the generated cover URL onto the insert payload", () => {
    const url = "https://signed.example/blog-covers/weekly-post.png";
    const row = buildScheduledPostInsert({ ...base, coverUrl: url });
    expect(row.cover_image_url).toBe(url);
  });

  it("publishes the scheduled post with the supplied timestamp", () => {
    const row = buildScheduledPostInsert({ ...base, coverUrl: null });
    expect(row.status).toBe("published");
    expect(row.published_at).toBe(base.publishedAt);
  });
});
