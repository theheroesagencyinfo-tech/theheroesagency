type GeolocatedRequest = Request & { cf?: { country?: unknown } };

// Only hosting-supplied metadata is trusted. Visitor-supplied headers are not,
// except Vercel's own geo header, which Vercel's edge overwrites when deployed there.
function countryOf(request: Request): string | null {
  const cf = (request as GeolocatedRequest).cf?.country;
  if (typeof cf === "string") return cf.toUpperCase();
  if (typeof process !== "undefined" && process.env?.VERCEL) {
    const v = request.headers.get("x-vercel-ip-country");
    if (v) return v.toUpperCase();
  }
  return null;
}

export function countryAccessResponse(request: Request): Response | null {
  if (countryOf(request) !== "NG") return null;

  return new Response(request.method === "HEAD" ? null : `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Error</title>
  </head>
  <body><main><h1>Error</h1><p>This page could not be loaded.</p></main></body>
</html>`, {
    status: 404,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
