import type { VercelRequest, VercelResponse } from "@vercel/node";

// Deliberately self-contained — no import from a sibling _idxProxy.ts file.
// Vercel's function bundler for non-Next.js projects has repeatedly failed
// to reliably include cross-file imports of underscore-prefixed "shared"
// files in this project's deployed functions (confirmed live: consistent
// FUNCTION_INVOCATION_FAILED even with a top-level try/catch, which can
// only mean the crash happened at module-load time, before the handler body
// ever ran — a known class of Vercel issue for this exact pattern). The
// logic below is intentionally duplicated from api/_idxProxy.ts (which the
// Vite dev-server middleware in vite.config.ts still imports fine, since
// Vite's own bundler doesn't have this problem) rather than shared, to keep
// the actual deployed function immune to it.

const IDX_BASE = "https://api.idxbroker.com";

function toFormUrlEncoded(obj: Record<string, unknown>, prefix = ""): string[] {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value == null) continue;
    const paramKey = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value)) {
      for (const v of value) parts.push(`${encodeURIComponent(paramKey)}[]=${encodeURIComponent(String(v))}`);
    } else if (typeof value === "object") {
      parts.push(...toFormUrlEncoded(value as Record<string, unknown>, paramKey));
    } else {
      parts.push(`${encodeURIComponent(paramKey)}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const pathParam = typeof req.query.path === "string" ? req.query.path : "";
    const [apiPath, embeddedQuery] = pathParam.split("?");

    const query = new URLSearchParams(embeddedQuery || "");
    for (const [key, value] of Object.entries(req.query)) {
      if (key === "path") continue;
      if (Array.isArray(value)) value.forEach((v) => query.append(key, v));
      else if (value != null) query.append(key, value);
    }

    const accessKey = process.env.IDX_BROKER_ACCESS_KEY;
    if (!accessKey) {
      res.status(500).json({ error: "IDX_BROKER_ACCESS_KEY is not configured on the server" });
      return;
    }
    if (!apiPath) {
      res.status(400).json({ error: "Missing IDX path" });
      return;
    }

    const jsonBody =
      req.body && typeof req.body === "object" ? (req.body as Record<string, unknown>) : undefined;

    const headers: Record<string, string> = { accesskey: accessKey, outputtype: "json" };
    let body: string | undefined;
    if (jsonBody && Object.keys(jsonBody).length > 0) {
      body = toFormUrlEncoded(jsonBody).join("&");
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    const qs = query.toString();
    const url = `${IDX_BASE}/${apiPath}${qs ? `?${qs}` : ""}`;
    const upstream = await fetch(url, { method: req.method || "GET", headers, body });
    const text = await upstream.text();

    res.status(upstream.status);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    res.send(text);
  } catch (err) {
    console.error("[api/idx]", err);
    res.status(502).json({ error: "IDX upstream request failed", detail: err instanceof Error ? err.message : String(err) });
  }
}
