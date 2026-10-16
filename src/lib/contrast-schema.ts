import { z } from "zod";

export const contrastIssueSchema = z.object({
  text: z.string(),
  location: z.string(),
  foreground: z.string(),
  background: z.string(),
  ratio: z.number(),
  required: z.number(),
  severity: z.enum(["fail", "borderline"]),
  suggestedForeground: z.string(),
  suggestedBackground: z.string().nullable(),
  newRatio: z.number(),
  note: z.string(),
});

export const contrastReportSchema = z.object({
  summary: z.string(),
  issues: z.array(contrastIssueSchema),
});

export type ContrastReport = z.infer<typeof contrastReportSchema>;
export type ContrastResult = { ok: true; report: ContrastReport } | { ok: false; message: string };

// ~6 MB of base64 — the client downsizes images well below this.
export const MAX_IMAGE_CHARS = 6_000_000;

export const contrastInputSchema = z.object({
  image: z
    .string()
    .max(MAX_IMAGE_CHARS, "That image is too large.")
    .regex(/^data:image\/(png|jpeg|webp);base64,/, "Upload a PNG, JPG or WebP image."),
});
