import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const CENTER: [number, number] = [34.14, -118.3936];

const pinIcon = L.divIcon({
  className: "",
  html: `<div class="px-3 py-1.5 rounded-full bg-foreground-950 text-background-50 text-xs font-semibold shadow-lg border-2 border-background-50 whitespace-nowrap">Stefanie Pollack</div>`,
  iconSize: undefined,
  iconAnchor: [55, 14],
});

export default function OfficeMap() {
  return (
    <section className="w-full bg-background-50 py-20 md:py-28 lg:py-36" id="office-map">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary-600 mb-4">
              Find Us
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground-950 mb-6">
              Visit the <span className="italic font-normal">Office</span>
            </h2>
            <p className="text-sm md:text-base text-foreground-600 max-w-2xl mx-auto">
              Studio City, CA 91604
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-xl overflow-hidden border border-background-200 h-[360px] md:h-[440px]"
          >
            <MapContainer center={CENTER} zoom={13} scrollWheelZoom={false} className="w-full h-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={CENTER} icon={pinIcon} />
            </MapContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
