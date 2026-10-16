import { describe, it, expect } from "vitest";
import { timelineAnswer, packages } from "@/lib/packages";

describe("delivery timeline", () => {
  it("states weeks, never a 2 to 5 day promise", () => {
    expect(timelineAnswer).toContain("2 to 4 weeks");
    expect(timelineAnswer).not.toMatch(/\bdays\b/);
  });
  it("names every package with the time shown on its card", () => {
    expect(packages).toHaveLength(3);
    for (const p of packages) expect(timelineAnswer).toContain(`${p.name} takes about ${p.time}`);
  });
});
