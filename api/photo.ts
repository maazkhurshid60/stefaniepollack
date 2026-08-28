import type { VercelRequest, VercelResponse } from "@vercel/node";

// Deliberately self-contained — see api/idx.ts for why this doesn't import
// from the shared api/_photoProxy.ts file (that one's still used by the
// Vite dev-server middleware, which doesn't have this problem).

const ALLOWED_HOSTS = ["api.cotality.com", "api-trestle.corelogic.com"];
const IDX_REFERRER = "https://stefaniepollack.idxbroker.com/";

function isAllowedPhotoUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    return u.protocol === "https:" && ALLOWED_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = typeof req.query.url === "string" ? req.query.url : "";
    if (!isAllowedPhotoUrl(url)) {
      res.status(400).end();
      return;
    }

    const upstream = await fetch(url, {
      headers: {
        Referer: IDX_REFERRER,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
    });
    if (!upstream.ok) {
      res.status(upstream.status).end();
      return;
    }

    const body = await upstream.arrayBuffer();
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "image/jpeg");
    // Immutable — these are stable listing-photo URLs (verified against
    // re-fetches from the API), safe to cache aggressively at the edge.
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800, immutable");
    res.status(200).send(Buffer.from(body));
  } catch (err) {
    console.error("[api/photo]", err);
    res.status(502).end();
  }
}
