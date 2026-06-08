// SEO meta templates for blog posts. Centralized so admin form,
// scheduled generator, and BlogPost renderer all stay aligned.

const STOPWORDS = new Set([
  "the","and","for","with","from","that","this","your","you","are","but","not",
  "have","has","will","can","into","over","under","about","what","when","why",
  "how","who","whom","which","while","they","them","their","there","here","been",
  "more","most","than","then","also","just","like","such","onto","upon","using",
  "use","get","got","new","top","best","make","made","one","two","three",
]);

const BRAND = "The Heroes Agency";
const MAX_TITLE = 60;
const MAX_DESC = 155;

const stripHtml = (s: string) =>
  (s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const truncate = (s: string, max: number) => {
  const t = s.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const i = cut.lastIndexOf(" ");
  return `${(i > max * 0.6 ? cut.slice(0, i) : cut).replace(/[.,;:!?-]+$/, "")}…`;
};

/** Derive a 1-3 word focus keyword from a title. */
export function deriveFocusKeyword(title: string): string {
  const words = (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  if (words.length === 0) return "";
  const first = words.slice(0, 3).join(" ");
  return first;
}

/** Build the <title> tag content. Includes the brand when there's room. */
export function buildMetaTitle(opts: { title: string; focusKeyword?: string }): string {
  const base = (opts.title || "").trim();
  if (!base) return BRAND;
  const withBrand = `${base} | ${BRAND}`;
  if (withBrand.length <= MAX_TITLE) return withBrand;
  return truncate(base, MAX_TITLE);
}

/** Build the meta description from excerpt or content body. */
export function buildMetaDescription(opts: {
  excerpt?: string | null;
  content?: string | null;
  focusKeyword?: string;
}): string {
  const source = (opts.excerpt || stripHtml(opts.content || "")).trim();
  if (!source) return "Strategy, CRO, and growth playbooks for Shopify brands from The Heroes Agency.";
  const fk = (opts.focusKeyword || "").toLowerCase();
  const hasKeyword = fk && source.toLowerCase().includes(fk);
  const prefix = hasKeyword || !fk ? "" : `${opts.focusKeyword}: `;
  return truncate(`${prefix}${source}`, MAX_DESC);
}

/** Derive an array of secondary keywords from title + focus keyword. */
export function deriveKeywords(opts: { title: string; focusKeyword?: string }): string[] {
  const fromTitle = (opts.title || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));
  const set = new Set<string>();
  if (opts.focusKeyword) set.add(opts.focusKeyword.toLowerCase());
  for (const w of fromTitle) set.add(w);
  return Array.from(set).slice(0, 10);
}

export const SEO_LIMITS = { MAX_TITLE, MAX_DESC, BRAND };
