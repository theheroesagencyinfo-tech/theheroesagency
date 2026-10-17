import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Enter a valid email address" })
    .max(255, { message: "Email is too long" })
    .toLowerCase(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
