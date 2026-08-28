import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, BedDouble, Bath, Ruler, ArrowRight } from "lucide-react";
import { useIdxListings } from "@/hooks/useIdxListings";
import type { AvailableProperty, SoldProperty } from "@/lib/idx";
import { PHOTO_FALLBACK } from "@/lib/media";

function PropertyCard({ property, type }: { property: AvailableProperty | SoldProperty; type: "available" | "sold" }) {
  const isSold = type === "sold";
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-5">
        <img
          src={property.image}
          alt={property.address}
          referrerPolicy="no-referrer"
          onError={(e) => (e.currentTarget.src = PHOTO_FALLBACK)}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        {isSold && (
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-foreground-950/90 text-background-50 text-[10px] font-semibold tracking-[0.2em] uppercase rounded-full">
            Sold
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        {/* Location row */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-500">
            {property.city}
          </p>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background-100 transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <MoreHorizontal className="w-4 h-4 text-foreground-400" strokeWidth={1.5} />
          </button>
        </div>

        {/* Price */}
        <p className="text-2xl md:text-3xl font-heading text-primary-700 mb-1">
          {isSold ? (property as SoldProperty).soldPrice : (property as AvailableProperty).price}
        </p>

        {/* Address */}
        <p className="text-base font-medium text-foreground-950 mb-3">
          {property.address}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-3 text-xs text-foreground-500 mb-5">
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

        {/* View Details */}
        <a
          href={`/listings/${property.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-800 hover:text-primary-700 transition-colors whitespace-nowrap"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        </a>
      </div>
    </motion.div>
  );
}

export default function FeaturedProperties() {
  const [activeTab, setActiveTab] = useState<"available" | "sold">("available");
  const { data, loading } = useIdxListings();

  const properties = activeTab === "available" ? data?.available ?? [] : data?.sold ?? [];

  return (
    <section className="w-full bg-background-50 py-20 md:py-28 lg:py-36">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary-600 mb-4">
              Portfolio
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground-950 mb-6">
              {activeTab === "available" ? "Available" : "Sold"}{" "}
              <span className="italic font-normal">Properties</span>
            </h2>
            <p className="text-sm md:text-base text-foreground-600 max-w-2xl mx-auto">
              {activeTab === "available"
                ? "Discover exceptional homes and investment opportunities in Los Angeles' most sought-after neighborhoods."
                : "A look at deals successfully navigated with strategy, discipline, and strong outcomes."}
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 bg-background-200 rounded-full">
              <button
                onClick={() => setActiveTab("available")}
                className={`px-6 py-2.5 text-sm font-medium tracking-wide rounded-full transition-all duration-300 whitespace-nowrap ${
                  activeTab === "available"
                    ? "bg-foreground-950 text-background-50"
                    : "text-foreground-600 hover:text-foreground-950"
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setActiveTab("sold")}
                className={`px-6 py-2.5 text-sm font-medium tracking-wide rounded-full transition-all duration-300 whitespace-nowrap ${
                  activeTab === "sold"
                    ? "bg-foreground-950 text-background-50"
                    : "text-foreground-600 hover:text-foreground-950"
                }`}
              >
                Sold
              </button>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <p className="text-center text-sm text-foreground-500 py-12">Loading listings…</p>
          ) : properties.length === 0 ? (
            <p className="text-center text-sm text-foreground-500 py-12">
              {activeTab === "available" ? "No active listings right now — check back soon." : "No sold listings to show yet."}
            </p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {(activeTab === "sold" ? properties : properties.slice(0, 6)).map((property) => (
                  <PropertyCard key={property.id} property={property} type={activeTab} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* View All CTA */}
          <div className="text-center mt-14">
            <a
              href="/listings"
              className="inline-flex items-center gap-2 px-6 py-3 border border-foreground-300 text-foreground-800 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-foreground-950 hover:text-background-50 hover:border-foreground-950 transition-all duration-300 whitespace-nowrap"
            >
              View All Listings
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}