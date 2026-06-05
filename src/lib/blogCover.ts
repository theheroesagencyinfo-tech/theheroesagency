// Pure decision helpers for blog cover generation.
// Kept framework-free so they can be unit-tested without React/Supabase.

export interface BlogPostLike {
  title: string;
  excerpt?: string | null;
  cover_image_url?: string | null;
}

export interface CoverDecisionInput {
  /** The form values being saved. */
  form: { title: string; excerpt?: string; cover_image_url?: string };
  /** The existing post when editing, or null when creating a new post. */
  editing: BlogPostLike | null;
}

/**
 * Returns true when the save flow should call the AI image generator and
 * (re)place the cover image.
 *
 * Rules — enforced by tests:
 *   1. Creating a post with no cover → generate.
 *   2. Editing a post that has no cover → generate (backfill).
 *   3. Editing a post whose title OR excerpt changed → regenerate
 *      (so the visual stays in sync with the new content).
 *   4. Editing a post with no content changes → keep the existing cover.
 */
export function shouldRegenerateCover(input: CoverDecisionInput): boolean {
  const currentCover = input.form.cover_image_url?.trim();
  if (!currentCover) return true;

  if (!input.editing) return false; // creating a new post and a cover URL was pasted manually

  const titleChanged = input.editing.title !== input.form.title;
  const excerptChanged = (input.editing.excerpt ?? "") !== (input.form.excerpt ?? "");
  return titleChanged || excerptChanged;
}

/**
 * Shape of the row a scheduled (weekly) job inserts into `blog_posts`.
 * Used by tests to guarantee every scheduled insert carries a cover field.
 */
export interface ScheduledPostInsert {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  author_name: string;
  status: "published";
  published_at: string;
}

export function buildScheduledPostInsert(args: {
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  coverUrl: string | null;
  publishedAt: string;
}): ScheduledPostInsert {
  return {
    title: args.title.slice(0, 120),
    slug: args.slug,
    excerpt: args.excerpt.slice(0, 200),
    content: args.content,
    // Always carry the field (null is fine) so the DB column is always set
    // explicitly by the scheduler — never left undefined by accident.
    cover_image_url: args.coverUrl,
    author_name: "The Heroes Agency",
    status: "published",
    published_at: args.publishedAt,
  };
}
