import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BedDouble, Bath } from "lucide-react";
import type { AvailableProperty, SoldProperty } from "@/lib/idx";
import { PHOTO_FALLBACK } from "@/lib/media";
import { approximateLatLng } from "@/mocks/neighborhoodCoords";

type Property = AvailableProperty | SoldProperty;

function priceLabel(property: Property, isSold: boolean) {
  const raw = isSold ? (property as SoldProperty).soldPrice : (property as AvailableProperty).price;
  const n = Number(raw.replace(/[^0-9]/g, ""));
  if (!n) return raw;
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M` : `$${Math.round(n / 1000)}K`;
}

/** Real lat/lng from IDX when valid; falls back to a neighborhood-centroid
 *  approximation only if a listing is ever missing coordinates. */
function markerPosition(property: Property): [number, number] {
  if (Number.isFinite(property.lat) && Number.isFinite(property.lng) && (property.lat !== 0 || property.lng !== 0)) {
    return [property.lat, property.lng];
  }
  return approximateLatLng(property.city, Number(property.listingID) || 0);
}

function pinIcon(label: string, isSold: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="px-3 py-1.5 rounded-full ${
      isSold ? "bg-foreground-600" : "bg-foreground-950"
    } text-background-50 text-xs font-semibold shadow-lg border-2 border-background-50 whitespace-nowrap">${label}</div>`,
    iconSize: undefined,
    iconAnchor: [28, 14],
  });
}

const TILE_SOURCES = {
  map: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
};

export default function PropertyMap({
  tab,
  properties,
}: {
  tab: "available" | "sold";
  properties: Property[];
}) {
  const isSold = tab === "sold";
  const [mapType, setMapType] = useState<"map" | "satellite">("map");

  const center = useMemo<[number, number]>(() => [34.128, -118.375], []);

  return (
    <div className="w-full">
      <div className="relative rounded-xl overflow-hidden border border-background-200 h-[420px] lg:h-[760px]">
        <MapContainer center={center} zoom={11} scrollWheelZoom className="w-full h-full">
          <TileLayer key={mapType} attribution={TILE_SOURCES[mapType].attribution} url={TILE_SOURCES[mapType].url} />
          {properties.map((property) => {
            const price = priceLabel(property, isSold);
            const [lat, lng] = markerPosition(property);
            return (
              <Marker key={property.id} position={[lat, lng]} icon={pinIcon(price, isSold)}>
                <Popup>
                  <a href={`/listings/${property.slug}`} className="block w-56 no-underline">
                    <div className="aspect-[4/3] overflow-hidden rounded-md mb-2">
                      <img
                        src={property.image}
                        alt={property.address}
                        referrerPolicy="no-referrer"
                        onError={(e) => (e.currentTarget.src = PHOTO_FALLBACK)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-foreground-500 mb-1">
                      {property.city}
                    </p>
                    <p className="text-base font-heading text-primary-700 mb-0.5">{price}</p>
                    <p className="text-sm font-medium text-foreground-950 mb-1.5">{property.address}</p>
                    <div className="flex items-center gap-2.5 text-[11px] text-foreground-500">
                      <span className="flex items-center gap-1">
                        <BedDouble className="w-3 h-3" strokeWidth={1.5} />
                        {property.beds} Beds
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3 h-3" strokeWidth={1.5} />
                        {property.baths} Baths
                      </span>
                    </div>
                  </a>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Map / Satellite toggle */}
        <div className="absolute top-3 right-3 z-[1000] inline-flex p-1 bg-background-50/95 backdrop-blur-sm rounded-full shadow-md border border-background-200">
          <button
            onClick={() => setMapType("map")}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
              mapType === "map" ? "bg-foreground-950 text-background-50" : "text-foreground-600 hover:text-foreground-950"
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setMapType("satellite")}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
              mapType === "satellite" ? "bg-foreground-950 text-background-50" : "text-foreground-600 hover:text-foreground-950"
            }`}
          >
            Satellite
          </button>
        </div>
      </div>
      <p className="mt-3 text-xs text-foreground-500 text-center">
        Pin locations are provided by the MLS and may be approximate.
      </p>
    </div>
  );
}
