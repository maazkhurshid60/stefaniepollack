/** Client-side IDX Broker API layer.
 *
 * Talks only to same-origin `/api/idx/...` (see api/idx/[...path].ts and the
 * matching vite dev middleware in vite.config.ts) — the IDX Broker access key
 * never reaches the browser.
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
  sqFt: string;
  price: number;
  listingPrice: string;
  soldPrice?: number | string;
  soldDate?: string;
  latitude: string | number;
  longitude: string | number;
  image?: Record<string, IdxImage>;
  remarksConcat?: string;
  yearBuilt?: number;
  detailsUrlSlug: string;
  idxStatus?: string;
  propStatus?: string;
};

type RawIdxListResponse = { total: number; data: Record<string, RawIdxListing> };

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

function baseFields(listing: RawIdxListing): BaseProperty {
  const photos = gallery(listing);
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
  };
}

function mapAvailable(listing: RawIdxListing): AvailableProperty {
  return { ...baseFields(listing), price: listing.listingPrice, status: "available" };
}

function mapSold(listing: RawIdxListing): SoldProperty {
  // soldPrice comes back as a raw number (unlike listingPrice, which the API
  // already formats as a string) — format it the same way.
  const soldPrice =
    typeof listing.soldPrice === "number"
      ? money(listing.soldPrice)
      : listing.soldPrice || listing.listingPrice;
  return {
    ...baseFields(listing),
    soldPrice,
    dateSold: monthYear(listing.soldDate),
  };
}

type FetchInit = { method?: string; headers?: Record<string, string>; body?: string };

async function idxFetch<T>(path: string, init?: FetchInit): Promise<T> {
  const res = await fetch(`/api/idx/${path}`, init);
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
  const res = await fetch(`/api/idx/leads/search/${leadId}`, {
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
  const res = await fetch(`/api/idx/leads/search/${leadId}/${searchId}`, { method: "DELETE" });
  return res.ok;
}
