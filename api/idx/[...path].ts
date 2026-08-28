import type { VercelRequest, VercelResponse } from "@vercel/node";
import { proxyIdxRequest } from "../_idxProxy";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pathParam = req.query.path;
  const path = Array.isArray(pathParam) ? pathParam.join("/") : pathParam || "";

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key === "path") continue;
    if (Array.isArray(value)) value.forEach((v) => query.append(key, v));
    else if (value != null) query.append(key, value);
  }

  const jsonBody =
    req.body && typeof req.body === "object" ? (req.body as Record<string, unknown>) : undefined;

  const result = await proxyIdxRequest({
    method: req.method || "GET",
    path,
    query,
    jsonBody,
  });

  res.status(result.status);
  res.setHeader("Content-Type", result.contentType);
  res.send(result.body);
}
