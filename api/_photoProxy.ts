// Photo proxy logic for local dev only — imported by the Vite dev-server
// middleware in vite.config.ts. The deployed Vercel function (api/photo.ts)
// keeps its own inlined copy instead — see api/_idxProxy.ts for why.
//
// Proxies MLS listing photos server-side instead of letting the browser
// hotlink api.cotality.com directly. That CDN sits behind Incapsula and
// appears to reject requests unless they carry a referrer IDX Broker's own
// hosted pages would send — this fetches with that referrer spoofed
// server-side (browsers can't set an arbitrary Referer themselves) and
// streams the bytes back from our own origin.

// Different listings on this account route through different Cotality/
// CoreLogic domains (Cotality is CoreLogic's rebrand — some photos still
// resolve through the legacy hostname), confirmed live against real data.
const ALLOWED_HOSTS = ["api.cotality.com", "api-trestle.corelogic.com"];
// The one referrer we've confirmed IDX Broker's own working listing pages
// send to this CDN.
const IDX_REFERRER = "https://stefaniepollack.idxbroker.com/";

export type PhotoResult =
  | { ok: true; status: number; contentType: string; body: ArrayBuffer }
  | { ok: false; status: number };

export function isAllowedPhotoUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    return u.protocol === "https:" && ALLOWED_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}

export async function fetchPhoto(url: string): Promise<PhotoResult> {
  if (!isAllowedPhotoUrl(url)) return { ok: false, status: 400 };

  const upstream = await fetch(url, {
    headers: {
      Referer: IDX_REFERRER,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    },
  });
  if (!upstream.ok) return { ok: false, status: upstream.status };

  return {
    ok: true,
    status: 200,
    contentType: upstream.headers.get("content-type") || "image/jpeg",
    body: await upstream.arrayBuffer(),
  };
}
