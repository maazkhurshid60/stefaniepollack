import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BedDouble, Bath, Ruler } from "lucide-react";
import { featuredProperties, soldListings } from "@/mocks/home";

function PropertyCard({
  property,
  isSold,
}: {
  property: (typeof featuredProperties)[0] | (typeof soldListings)[0];
  isSold: boolean;
}) {
  const price = isSold ? (property as (typeof soldListings)[0]).soldPrice : (property as (typeof featuredProperties)[0]).price;
  return (
    <motion.a
      href={`/listings/${property.slug}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="group block"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-5">
        <img
          src={property.image}
          alt={property.address}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        {isSold && (
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-foreground-950/90 text-background-50 text-[10px] font-semibold tracking-[0.2em] uppercase rounded-full">
            Sold
          </div>
        )}
      </div>
      <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-500 mb-2">
        {property.city}
      </p>
      <p className="text-2xl md:text-3xl font-heading text-primary-700 mb-1">{price}</p>
      <p className="text-base font-medium text-foreground-950 mb-3 group-hover:text-primary-700 transition-colors">
        {property.address}
      </p>
      <div className="flex items-center gap-3 text-xs text-foreground-500">
        <span className="flex items-center gap-1">
          <BedDouble className="w-3 h-3" strokeWidth={1.5} />
          {property.beds} Beds
        </span>
        <span className="flex items-center gap-1">
          <Bath className="w-3 h-3" strokeWidth={1.5} />
          {property.baths} Baths
        </span>
        <span className="flex items-center gap-1">
          <Ruler className="w-3 h-3" strokeWidth={1.5} />
          {property.sqft} SqFt
        </span>
      </div>
    </motion.a>
  );
}

export default function PropertyGrid() {
  const [activeTab, setActiveTab] = useState<"available" | "sold">("available");
  const properties = activeTab === "available" ? featuredProperties : soldListings;

  return (
    <section className="w-full bg-background-50 py-20 md:py-28 lg:py-36">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-14">
            <div className="inline-flex p-1 bg-background-200 rounded-full">
              <button
                onClick={() => setActiveTab("available")}
                className={`px-6 py-2.5 text-sm font-medium tracking-wide rounded-full transition-all duration-300 whitespace-nowrap ${
                  activeTab === "available" ? "bg-foreground-950 text-background-50" : "text-foreground-600 hover:text-foreground-950"
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setActiveTab("sold")}
                className={`px-6 py-2.5 text-sm font-medium tracking-wide rounded-full transition-all duration-300 whitespace-nowrap ${
                  activeTab === "sold" ? "bg-foreground-950 text-background-50" : "text-foreground-600 hover:text-foreground-950"
                }`}
              >
                Sold
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} isSold={activeTab === "sold"} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
