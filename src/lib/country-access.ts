type GeolocatedRequest = Request & { cf?: { country?: unknown } };

// Only hosting-supplied metadata is trusted. Visitor-supplied headers are not.
export function countryAccessResponse(request: Request): Response | null {
  const country = (request as GeolocatedRequest).cf?.country;
  if (typeof country !== "string" || country.toUpperCase() !== "NG") return null;

  return new Response(request.method === "HEAD" ? null : `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Page not found</title>
  </head>
  <body><main><h1>Page not found</h1><p>The page you're looking for doesn't exist or has been moved.</p></main></body>
</html>`, {
    status: 404,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}