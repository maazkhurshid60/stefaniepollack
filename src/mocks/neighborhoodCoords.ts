/**
 * Neighborhood-center coordinates, not geocoded street addresses.
 *
 * The listings in `home.ts` are placeholder/demo content (stock photos, no
 * client-confirmed address) — see project notes. Pinning them at an exact
 * geocoded address would visually assert a specific real property exists at
 * that spot. Instead each listing's marker sits near its neighborhood's
 * center, nudged by a small deterministic offset so multiple listings in the
 * same area don't stack into a single pin.
 */
export const NEIGHBORHOOD_CENTERS: Record<string, [number, number]> = {
  "Studio City, CA": [34.142, -118.3999],
  "Beverly Hills, CA": [34.0736, -118.4004],
  "Los Feliz, CA": [34.1073, -118.2884],
  "Hollywood Hills, CA": [34.1184, -118.3399],
};

const FALLBACK_CENTER: [number, number] = [34.142, -118.3999]; // Studio City

/** Small deterministic ring offset so listings sharing a neighborhood spread
 *  out instead of overlapping — same `id` always lands in the same spot. */
export function approximateLatLng(city: string, id: number): [number, number] {
  const [lat, lng] = NEIGHBORHOOD_CENTERS[city] ?? FALLBACK_CENTER;
  const angle = (id * 137.5 * Math.PI) / 180; // golden-angle spiral, avoids grid-like rows
  const radius = 0.006 + (id % 3) * 0.003;
  return [lat + Math.sin(angle) * radius, lng + Math.cos(angle) * radius];
}
