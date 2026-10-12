import { z } from "zod";

export const serviceOptions = ["author website", "email funnel", "launch kit", "not sure yet"] as const;

export const reviewSchema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  book: z.string().trim().min(1, "Tell me your book title or topic").max(200),
  website: z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === "" || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v), "That doesn't look like a web address")
    .optional()
    .default(""),
  service: z.enum(serviceOptions).default("not sure yet"),
  message: z.string().trim().max(3000).default(""),
  request_type: z.enum(["review", "quote"]).default("review"),
}).superRefine((data, ctx) => {
  if (data.request_type === "quote" && !data.message) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["message"], message: "Tell me a little about your project" });
  }
});

export type ReviewInput = z.infer<typeof reviewSchema>;
