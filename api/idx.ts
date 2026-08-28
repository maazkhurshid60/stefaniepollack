import type { VercelRequest, VercelResponse } from "@vercel/node";
import { proxyIdxRequest } from "./_idxProxy";

// A flat file (no dynamic route segments) on purpose — Vercel's routing
// manifest for non-Next.js projects failed to detect the previous nested
// catch-all (api/idx/[...path].ts) in production, even though it deployed
// correctly (confirmed live: it 404'd exactly like a nonexistent path,
// while this project's other flat function, api/photo.ts, was reliably
// found). The actual IDX API path travels as a `?path=` query value instead
// of a URL path segment, so there's nothing dynamic left for Vercel to fail
// to detect.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pathParam = typeof req.query.path === "string" ? req.query.path : "";
  const [apiPath, embeddedQuery] = pathParam.split("?");

  const query = new URLSearchParams(embeddedQuery || "");
  for (const [key, value] of Object.entries(req.query)) {
    if (key === "path") continue;
    if (Array.isArray(value)) value.forEach((v) => query.append(key, v));
    else if (value != null) query.append(key, value);
  }

  const jsonBody =
    req.body && typeof req.body === "object" ? (req.body as Record<string, unknown>) : undefined;

  const result = await proxyIdxRequest({
    method: req.method || "GET",
    path: apiPath,
    query,
    jsonBody,
  });

  res.status(result.status);
  res.setHeader("Content-Type", result.contentType);
  res.send(result.body);
}
