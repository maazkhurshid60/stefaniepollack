import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchPhoto } from "./_photoProxy";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = typeof req.query.url === "string" ? req.query.url : "";
  const result = await fetchPhoto(url);

  if (!result.ok) {
    res.status(result.status).end();
    return;
  }

  res.setHeader("Content-Type", result.contentType);
  // Immutable — these are stable listing-photo URLs (verified against
  // re-fetches from the API), safe to cache aggressively at the edge.
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800, immutable");
  res.status(200).send(Buffer.from(result.body));
}
