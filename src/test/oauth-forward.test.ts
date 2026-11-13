import { describe, expect, it, vi } from "vitest";
vi.mock("@tanstack/react-start/server-entry", () => ({ default: { fetch: vi.fn(async () => new Response("app", { status: 404 })) } }));
import server from "@/server";

describe("Google sign-in start on the custom domain", () => {
  it("forwards /~oauth/initiate to the sign-in broker instead of the 404 page", async () => {
    const res = await server.fetch(new Request("https://www.theheroesagency.org/~oauth/initiate?provider=google&state=abc&redirect_uri=https%3A%2F%2Fwww.theheroesagency.org%2Fauth"), {}, {});
    expect(res.status).toBe(302);
    const loc = new URL(res.headers.get("location")!);
    expect(loc.origin + loc.pathname).toBe("https://oauth.lovable.app/initiate");
    expect(loc.searchParams.get("provider")).toBe("google");
    expect(loc.searchParams.get("redirect_uri")).toBe("https://www.theheroesagency.org/auth");
    expect(loc.searchParams.get("project_id")).toBe("lovp_3py0r2nv2k88ft4qdte4bvspfn");
  });
});
