import { z } from "zod";

export const reviewSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  company: z
    .string()
    .trim()
    .max(100, { message: "Company name must be less than 100 characters" })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  star_rating: z
    .number()
    .min(1, { message: "Please select a rating" })
    .max(5, { message: "Rating must be between 1 and 5" }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Review must be at least 10 characters" })
    .max(1000, { message: "Review must be less than 1000 characters" }),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
