import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function pinIcon(label: string) {
  return L.divIcon({
    className: "",
    html: `<div class="px-3 py-1.5 rounded-full bg-foreground-950 text-background-50 text-xs font-semibold shadow-lg border-2 border-background-50 whitespace-nowrap">${label}</div>`,
    iconSize: undefined,
    iconAnchor: [50, 14],
  });
}

export default function PropertyLocationMap({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) return null;
  return (
    <div className="w-full h-[340px] md:h-[420px] rounded-xl overflow-hidden border border-background-200">
      <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={pinIcon(label)} />
      </MapContainer>
    </div>
  );
}
