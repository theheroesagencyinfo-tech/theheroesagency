import { describe, expect, it, vi } from "vitest";
import { countryAccessResponse } from "@/lib/country-access";

const { nextFetch } = vi.hoisted(() => ({
  nextFetch: vi.fn(async () => new Response("Allowed", { status: 200 })),
}));
vi.mock("@tanstack/react-start/server-entry", () => ({ default: { fetch: nextFetch } }));
import server from "@/server";

function requestFrom(country?: string, path = "/", method = "GET") {
  const request = new Request(`https://example.test${path}`, { method });
  if (country !== undefined) Object.defineProperty(request, "cf", { value: { country } });
  return request;
}

describe("country access", () => {
  it.each(["/", "/contact", "/admin", "/_server/order"])("returns 404 for Nigeria on %s before running the app", async (path) => {
    nextFetch.mockClear();
    const response = await server.fetch(requestFrom("NG", path), {}, {});
    expect(response.status).toBe(404);
    expect(nextFetch).not.toHaveBeenCalled();
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it.each(["US", "GB", "GH", "ZA", "CA"])("allows %s to reach the app", async (country) => {
    nextFetch.mockClear();
    const response = await server.fetch(requestFrom(country), {}, {});
    expect(response.status).toBe(200);
    expect(nextFetch).toHaveBeenCalledOnce();
  });

  it("keeps access open when hosting has no country metadata", () => {
    expect(countryAccessResponse(requestFrom())).toBeNull();
  });

  it("ignores spoofed country headers and cannot bypass a Nigerian IP", () => {
    const allowed = requestFrom("GB");
    allowed.headers.set("cf-ipcountry", "NG");
    expect(countryAccessResponse(allowed)).toBeNull();
    const blocked = requestFrom("NG");
    blocked.headers.set("cf-ipcountry", "US");
    expect(countryAccessResponse(blocked)?.status).toBe(404);
  });

  it("returns an empty 404 body for Nigerian HEAD requests", async () => {
    const response = countryAccessResponse(requestFrom("NG", "/", "HEAD"));
    expect(response?.status).toBe(404);
    expect(await response?.text()).toBe("");
  });
});