import { describe, expect, it } from "vitest";
import { reviewSchema } from "@/lib/review-schema";

const valid = { name: "Test author", email: "author@example.com", book: "My nonfiction book" };
describe("Author request rules", () => {
  it("requires a name", () => { expect(reviewSchema.safeParse({ ...valid, name: "" }).success).toBe(false); });
  it("requires a valid email", () => { expect(reviewSchema.safeParse({ ...valid, email: "invalid" }).success).toBe(false); });
  it("requires a book title or topic", () => { expect(reviewSchema.safeParse({ ...valid, book: "" }).success).toBe(false); });
  it("allows no author website", () => { expect(reviewSchema.parse(valid).website).toBe(""); });
  it.each(["author website", "email funnel", "launch kit", "not sure yet"])("accepts the requested service %s", service => {
    expect(reviewSchema.parse({ ...valid, service }).service).toBe(service);
  });
  it("rejects an unsupported service", () => { expect(reviewSchema.safeParse({ ...valid, service: "other" }).success).toBe(false); });
  it("requires a message for quote requests", () => { expect(reviewSchema.safeParse({ ...valid, request_type: "quote", message: "" }).success).toBe(false); });
  it("preserves quote details", () => { expect(reviewSchema.parse({ ...valid, request_type: "quote", service: "launch kit", message: "Book launch" })).toMatchObject({ request_type: "quote", service: "launch kit", message: "Book launch" }); });
});