// Shared IDX Broker proxy logic — used by both the Vercel serverless function
// (api/idx/[...path].ts) and the Vite dev-server middleware (vite.config.ts),
// so local `npm run dev` and the deployed site behave identically.
//
// Keeps IDX_BROKER_ACCESS_KEY server-side only: the browser never sees it,
// it only ever talks to same-origin /api/idx/* routes.

const IDX_BASE = "https://api.idxbroker.com";

/** IDX Broker expects application/x-www-form-urlencoded bodies with PHP-style
 *  bracket notation for nested fields (e.g. `search[idxID]=e025`). Our own
 *  client sends plain JSON — this flattens it into that form. */
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

export type ProxyResult = { status: number; body: string; contentType: string };

export async function proxyIdxRequest(params: {
  method: string;
  path: string; // e.g. "clients/featured" or "leads/lead/123" — no leading slash
  query: URLSearchParams;
  jsonBody?: Record<string, unknown>;
}): Promise<ProxyResult> {
  const accessKey = process.env.IDX_BROKER_ACCESS_KEY;
  if (!accessKey) {
    return {
      status: 500,
      body: JSON.stringify({ error: "IDX_BROKER_ACCESS_KEY is not configured on the server" }),
      contentType: "application/json",
    };
  }
  if (!params.path) {
    return { status: 400, body: JSON.stringify({ error: "Missing IDX path" }), contentType: "application/json" };
  }

  const qs = params.query.toString();
  const url = `${IDX_BASE}/${params.path}${qs ? `?${qs}` : ""}`;

  const headers: Record<string, string> = {
    accesskey: accessKey,
    outputtype: "json",
  };

  let body: string | undefined;
  if (params.jsonBody && Object.keys(params.jsonBody).length > 0) {
    body = toFormUrlEncoded(params.jsonBody).join("&");
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  }

  const upstream = await fetch(url, { method: params.method, headers, body });
  const text = await upstream.text();
  return {
    status: upstream.status,
    body: text,
    contentType: upstream.headers.get("content-type") || "application/json",
  };
}
