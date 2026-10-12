import { z } from "zod";

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
});

export type ReviewInput = z.infer<typeof reviewSchema>;
