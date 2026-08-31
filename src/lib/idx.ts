/** Client-side IDX Broker API layer.
 *
 * Talks only to same-origin `/api/idx` (see api/idx.ts and the matching vite
 * dev middleware in vite.config.ts) — the IDX Broker access key never
 * reaches the browser. The actual IDX API path is passed as a `?path=`
 * query param rather than a URL path segment — Vercel's routing manifest
 * for non-Next.js projects doesn't reliably detect nested dynamic catch-all
 * functions (confirmed live: api/idx/[...path].ts 404'd in production even
 * though it deployed correctly), so this sticks to one flat function file,
 * the pattern already proven to work (api/photo.ts).
 *
 * `AvailableProperty` / `SoldProperty` deliberately mirror the field names
 * used by the old src/mocks/home.ts shapes (address, city, price/soldPrice,
 * beds, baths, sqft, image, gallery, slug) so the existing UI components only
 * need their data *source* swapped, not their JSX. Real-only fields (lat/lng,
 * remarks, yearBuilt, mlsNumber, idxID/listingID) are additive.
 */

const STATE_ABBR: Record<string, string> = {
  California: "CA",
  Nevada: "NV",
  Arizona: "AZ",
  Oregon: "OR",
};

type IdxImage = { url: string; caption?: string };
type RawIdxListing = {
  idxID: string;
  listingID: string;
  address: string;
  cityName: string;
  state: string;
  zipcode: string;
  bedrooms: number;
  totalBaths: number;
  fullBaths?: number;
  halfBaths?: number;
  sqFt: string;
  acres?: string;
  price: number;
  listingPrice: string;
  soldPrice?: number | string;
  soldDate?: string;
  dateAdded?: string;
  latitude: string | number;
  longitude: string | number;
  image?: Record<string, IdxImage>;
  remarksConcat?: string;
  yearBuilt?: number;
  detailsUrlSlug: string;
  idxStatus?: string;
  propStatus?: string;
  propType?: string;
  propSubType?: string;
  countyName?: string;
  advanced?: Record<string, unknown>;
};

type RawIdxListResponse = { total: number; data: Record<string, RawIdxListing> };

export type Feature = { label: string; value: string };
export type HistoryItem = { event: string; sub: string; price?: string };

type BaseProperty = {
  id: string;
  idxID: string;
  listingID: string;
  mlsNumber: string;
  slug: string;
  address: string;
  city: string;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
  gallery: string[];
  lat: number;
  lng: number;
  remarks: string;
  yearBuilt: number | null;
  propType: string;
  perSqft: string;
  features: { interior: Feature[]; exterior: Feature[]; details: Feature[] };
  history: HistoryItem[];
};

export type AvailableProperty = BaseProperty & { price: string; status: "available" };
export type SoldProperty = BaseProperty & { soldPrice: string; dateSold: string };

function cityState(listing: RawIdxListing): string {
  const abbr = STATE_ABBR[listing.state] || listing.state;
  return `${listing.cityName}, ${abbr}`;
}

/** Routes through our own /api/photo instead of hotlinking the MLS CDN
 *  directly — see api/_photoProxy.ts. */
function proxiedPhotoUrl(url: string): string {
  return `/api/photo?url=${encodeURIComponent(url)}`;
}

function gallery(listing: RawIdxListing): string[] {
  const images = listing.image ? Object.values(listing.image) : [];
  return images
    .map((img) => img.url)
    .filter(Boolean)
    .map(proxiedPhotoUrl);
}

function money(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

function monthYear(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function monthDayYear(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function yn(v: unknown): string {
  return v === "yes" || v === "y" ? "Yes" : v === "no" || v === "n" ? "No" : "—";
}
function joinArr(v: unknown): string {
  return Array.isArray(v) && v.length ? v.filter((x) => x && x !== "None").join(", ") : "—";
}

/** Simplifies IDX's propType/propSubType into coarse categories. */
function simpleType(listing: RawIdxListing): string {
  const sub = (listing.propSubType || "").toLowerCase();
  if (sub.includes("land") || sub.includes("lot")) return "Land";
  if (sub.includes("condo")) return "Condo";
  if (sub.includes("townhouse") || sub.includes("town house")) return "Townhouse";
  if (sub.includes("multi") || sub.includes("duplex") || sub.includes("triplex")) return "Multi-Family";
  return "House";
}

/** Interior/Exterior/Details feature rows from IDX's `advanced` field bag,
 *  plus a short history synthesized from dateAdded/soldDate/yearBuilt (IDX
 *  has no dedicated price-history endpoint). */
function buildFeaturesHistory(
  listing: RawIdxListing,
  sold: boolean,
  price: number,
  sqftNum: number
): { features: BaseProperty["features"]; history: HistoryItem[]; perSqft: string } {
  const adv = listing.advanced || {};
  const perSqft = sqftNum ? `${money(Math.round(price / sqftNum))} / sqft` : "";

  const interior: Feature[] = [
    { label: "Total Stories", value: String(adv.storiesTotal ?? "—") },
    { label: "Bedrooms", value: String(listing.bedrooms ?? "—") },
    { label: "Total Bathrooms", value: String(listing.totalBaths ?? "—") },
    { label: "Full Bathrooms", value: String(listing.fullBaths ?? "—") },
    { label: "Half Bathrooms", value: String(listing.halfBaths ?? "—") },
    { label: "Appliances", value: joinArr(adv.appliances) },
    { label: "Laundry Description", value: joinArr(adv.laundryFeatures) },
    { label: "Floor Description", value: joinArr(adv.flooring) },
    { label: "Fireplace", value: yn(adv.fireplaceYN) },
    { label: "Cooling", value: yn(adv.coolingYN) },
    { label: "Heating", value: yn(adv.heatingYN) },
  ];

  const exterior: Feature[] = [
    { label: "Lot Size", value: typeof adv.lotSizeSquareFeet === "number" ? `${adv.lotSizeSquareFeet.toLocaleString()} sqft` : listing.acres ? `${listing.acres} Acres` : "—" },
    { label: "Pool", value: yn(adv.poolPrivateYN) },
    { label: "Spa", value: yn(adv.spaYN) },
    { label: "Parking Spaces", value: String(adv.parkingTotal ?? "—") },
    { label: "Parking Description", value: joinArr(adv.parkingFeatures) },
    { label: "Architecture", value: joinArr(adv.architecturalStyle) },
    { label: "View", value: yn(adv.viewYN) === "Yes" ? joinArr(adv.view) : "No" },
  ];

  const details: Feature[] = [
    { label: "Property Type", value: `${listing.propType || "Residential"}${listing.propSubType ? ` — ${listing.propSubType}` : ""}` },
    { label: "Year Built", value: String(listing.yearBuilt ?? "—") },
    { label: "MLS #", value: listing.listingID },
    { label: "County", value: listing.countyName || "—" },
    { label: "Price / SqFt", value: perSqft || "—" },
  ];

  const history: HistoryItem[] = [];
  if (sold && listing.soldDate) {
    history.push({
      event: "Sold",
      sub: `${monthDayYear(listing.soldDate)} · Pollack & Associates`,
      price: listing.soldPrice != null ? money(Number(listing.soldPrice)) : undefined,
    });
  }
  if (listing.dateAdded) {
    history.push({ event: "Listed for sale", sub: `${monthDayYear(listing.dateAdded)} · MLS ${listing.idxID}`, price: listing.listingPrice });
  }
  if (listing.yearBuilt) {
    history.push({ event: "Built", sub: `${listing.yearBuilt}` });
  }

  return { features: { interior, exterior, details }, history, perSqft };
}

function baseFields(listing: RawIdxListing, sold: boolean, price: number): BaseProperty {
  const photos = gallery(listing);
  const sqftNum = listing.sqFt ? Number(listing.sqFt.replace(/[^0-9.]/g, "")) : 0;
  const { features, history, perSqft } = buildFeaturesHistory(listing, sold, price, sqftNum);
  return {
    id: `${listing.idxID}!${listing.listingID}`,
    idxID: listing.idxID,
    listingID: listing.listingID,
    mlsNumber: listing.listingID,
    slug: listing.detailsUrlSlug.toLowerCase(),
    address: listing.address,
    city: cityState(listing),
    beds: listing.bedrooms,
    baths: listing.totalBaths,
    sqft: listing.sqFt,
    image: photos[0] || "",
    gallery: photos,
    lat: Number(listing.latitude),
    lng: Number(listing.longitude),
    remarks: listing.remarksConcat || "",
    yearBuilt: listing.yearBuilt ?? null,
    propType: simpleType(listing),
    perSqft,
    features,
    history,
  };
}

function mapAvailable(listing: RawIdxListing): AvailableProperty {
  return { ...baseFields(listing, false, listing.price), price: listing.listingPrice, status: "available" };
}

function mapSold(listing: RawIdxListing): SoldProperty {
  // soldPrice comes back as a raw number (unlike listingPrice, which the API
  // already formats as a string) — format it the same way.
  const soldPriceNum = typeof listing.soldPrice === "number" ? listing.soldPrice : listing.price;
  const soldPrice =
    typeof listing.soldPrice === "number"
      ? money(listing.soldPrice)
      : listing.soldPrice || listing.listingPrice;
  return {
    ...baseFields(listing, true, soldPriceNum),
    soldPrice,
    dateSold: monthYear(listing.soldDate),
  };
}

type FetchInit = { method?: string; headers?: Record<string, string>; body?: string };

/** `path` may itself carry a query string (e.g. "leads/lead?email=x") — that's
 *  fine, it travels intact as part of the single `path` param's value and
 *  api/idx.ts splits it back apart server-side. */
function idxUrl(path: string): string {
  return `/api/idx?path=${encodeURIComponent(path)}`;
}

async function idxFetch<T>(path: string, init?: FetchInit): Promise<T> {
  const res = await fetch(idxUrl(path), init);
  if (!res.ok) throw new Error(`IDX request failed: ${path} (${res.status})`);
  return res.json() as Promise<T>;
}

export async function fetchFeatured(): Promise<AvailableProperty[]> {
  const res = await idxFetch<RawIdxListResponse>("clients/featured");
  return Object.values(res.data || {}).map(mapAvailable);
}

export async function fetchSoldPending(): Promise<SoldProperty[]> {
  const res = await idxFetch<RawIdxListResponse>("clients/soldpending");
  return Object.values(res.data || {}).map(mapSold);
}

export type SystemLink = { name: string; url: string; category: string };

let systemLinksCache: Promise<SystemLink[]> | null = null;

/** Hosted IDX search pages (Basic/Advanced/Map/AI Smart Search), plus their
 *  hosted login/account/signup pages — the only way to offer full MLS
 *  search or a real visitor login, since the API itself can't return
 *  general MLS query results and has no visitor-auth endpoints of its own.
 *  Cached module-wide since multiple components (Header, PropertyGrid) ask
 *  for this on the same page load. */
export async function fetchSystemLinks(): Promise<SystemLink[]> {
  if (!systemLinksCache) {
    systemLinksCache = idxFetch<SystemLink[]>("clients/systemlinks").catch((err: unknown) => {
      systemLinksCache = null;
      throw err;
    });
  }
  return systemLinksCache;
}

export async function createLead(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  comments?: string;
}): Promise<string | null> {
  // The create response key is `newID` (verified against the live API —
  // not `leadID`, despite what IDX's own docs examples imply elsewhere).
  const res = await idxFetch<{ newID?: number | string }>("leads/lead", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.newID != null ? String(res.newID) : null;
}

type RawLead = { id: string; email: string };

/** Looks up an existing lead by email via the API's own filtering (verified
 *  live: `data` comes back empty for a non-matching email) — no separate
 *  database needed to power "log in with just your email." */
export async function findLeadByEmail(email: string): Promise<string | null> {
  const res = await idxFetch<{ data?: RawLead[] }>(`leads/lead?email=${encodeURIComponent(email)}`);
  const match = (res.data || []).find((l) => l.email.toLowerCase() === email.toLowerCase());
  return match ? match.id : null;
}

export async function saveLeadSearch(
  leadId: string,
  input: { searchName: string; search: Record<string, string> }
): Promise<boolean> {
  const res = await fetch(idxUrl(`leads/search/${leadId}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.ok;
}

export type SavedSearch = {
  id: string;
  searchName: string;
  criteria: Record<string, unknown>;
  created: string;
  resultsUrl: string;
};

export async function getLeadSearches(leadId: string): Promise<SavedSearch[]> {
  type RawSearch = {
    id: string;
    searchName: string;
    search: Record<string, unknown>;
    created: string;
    resultsURL: string;
  };
  const res = await idxFetch<{ searchInformation?: RawSearch[] }>(`leads/search/${leadId}`);
  return (res.searchInformation || []).map((s) => ({
    id: s.id,
    searchName: s.searchName,
    criteria: s.search,
    created: s.created,
    resultsUrl: s.resultsURL,
  }));
}

export async function deleteLeadSearch(leadId: string, searchId: string): Promise<boolean> {
  const res = await fetch(idxUrl(`leads/search/${leadId}/${searchId}`), { method: "DELETE" });
  return res.ok;
}
