import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BedDouble, Bath, Ruler, Search, LayoutGrid, Map as MapIcon, ChevronDown } from "lucide-react";
import { useIdxListings } from "@/hooks/useIdxListings";
import { fetchSystemLinks, type AvailableProperty, type SoldProperty } from "@/lib/idx";
import { PHOTO_FALLBACK } from "@/lib/media";
import PropertyMap from "./PropertyMap";
import SaveSearchButton from "./SaveSearchButton";

type ListedProperty = AvailableProperty | SoldProperty;

function numericPrice(property: ListedProperty, isSold: boolean) {
  const raw = isSold ? (property as SoldProperty).soldPrice : (property as AvailableProperty).price;
  return Number(raw.replace(/[^0-9]/g, ""));
}

const PRICE_OPTIONS = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Under $2M", min: 0, max: 2_000_000 },
  { label: "$2M – $3M", min: 2_000_000, max: 3_000_000 },
  { label: "$3M – $4M", min: 3_000_000, max: 4_000_000 },
  { label: "$4M+", min: 4_000_000, max: Infinity },
];
const BED_BATH_OPTIONS = [0, 2, 3, 4, 5];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-desc", label: "Price (high to low)" },
  { value: "price-asc", label: "Price (low to high)" },
  { value: "beds-desc", label: "Most bedrooms" },
];

function FilterDropdown({
  label,
  active,
  children,
}: {
  label: string;
  active: boolean;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
          active
            ? "border-primary-500 text-primary-700 bg-primary-50"
            : "border-background-300 text-foreground-700 bg-background-100 hover:border-foreground-400"
        }`}
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={1.5} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 z-30 bg-background-50 border border-background-300 rounded-xl shadow-lg p-2 min-w-[190px]"
          >
            {children(() => setOpen(false))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownOption({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
        selected ? "bg-foreground-950 text-background-50" : "text-foreground-700 hover:bg-background-200"
      }`}
    >
      {label}
    </button>
  );
}

function PropertyCard({ property, isSold }: { property: ListedProperty; isSold: boolean }) {
  const price = isSold ? (property as SoldProperty).soldPrice : (property as AvailableProperty).price;
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
  const [query, setQuery] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [priceIdx, setPriceIdx] = useState(0);
  const [minBeds, setMinBeds] = useState(0);
  const [minBaths, setMinBaths] = useState(0);
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const [fullSearchUrl, setFullSearchUrl] = useState<string | null>(null);

  const { data, loading } = useIdxListings();

  useEffect(() => {
    fetchSystemLinks()
      .then((links) => {
        const pick = links.find((l) => l.name === "Map Search") || links.find((l) => l.category === "search");
        if (pick) setFullSearchUrl(pick.url);
      })
      .catch(() => {
        // full-MLS-search link is a nice-to-have — silently skip if it fails
      });
  }, []);

  const isSold = activeTab === "sold";

  const properties = useMemo(() => {
    const base: ListedProperty[] = isSold ? data?.sold ?? [] : data?.available ?? [];
    const q = query.trim().toLowerCase();
    const { min, max } = PRICE_OPTIONS[priceIdx];
    const filtered = base.filter((p) => {
      if (q && !`${p.address} ${p.city}`.toLowerCase().includes(q)) return false;
      const price = numericPrice(p, isSold);
      if (price < min || price > max) return false;
      if (p.beds < minBeds) return false;
      if (p.baths < minBaths) return false;
      return true;
    });
    const sorted = [...filtered];
    if (sort === "price-desc") sorted.sort((a, b) => numericPrice(b, isSold) - numericPrice(a, isSold));
    else if (sort === "price-asc") sorted.sort((a, b) => numericPrice(a, isSold) - numericPrice(b, isSold));
    else if (sort === "beds-desc") sorted.sort((a, b) => b.beds - a.beds);
    return sorted;
  }, [data, query, priceIdx, minBeds, minBaths, sort, isSold]);

  return (
    <section className="w-full bg-background-50 py-16 md:py-20 lg:py-24">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8 pb-8 border-b border-background-200">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-400" strokeWidth={1.5} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="City, neighborhood, or address…"
                aria-label="Search listings by city, neighborhood, or address"
                className="w-full pl-11 pr-4 py-2.5 bg-background-100 border border-background-300 rounded-full text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            <div className="inline-flex p-1 bg-background-200 rounded-full">
              <button
                onClick={() => setActiveTab("available")}
                className={`px-5 py-2 text-sm font-medium tracking-wide rounded-full transition-all duration-300 whitespace-nowrap ${
                  activeTab === "available" ? "bg-foreground-950 text-background-50" : "text-foreground-600 hover:text-foreground-950"
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setActiveTab("sold")}
                className={`px-5 py-2 text-sm font-medium tracking-wide rounded-full transition-all duration-300 whitespace-nowrap ${
                  activeTab === "sold" ? "bg-foreground-950 text-background-50" : "text-foreground-600 hover:text-foreground-950"
                }`}
              >
                Sold
              </button>
            </div>

            <FilterDropdown label={PRICE_OPTIONS[priceIdx].label} active={priceIdx !== 0}>
              {(close) => (
                <div className="flex flex-col gap-0.5">
                  {PRICE_OPTIONS.map((opt, i) => (
                    <DropdownOption
                      key={opt.label}
                      label={opt.label}
                      selected={i === priceIdx}
                      onClick={() => {
                        setPriceIdx(i);
                        close();
                      }}
                    />
                  ))}
                </div>
              )}
            </FilterDropdown>

            <FilterDropdown label={minBeds ? `${minBeds}+ beds` : "All beds"} active={minBeds !== 0}>
              {(close) => (
                <div className="flex flex-col gap-0.5">
                  {BED_BATH_OPTIONS.map((n) => (
                    <DropdownOption
                      key={n}
                      label={n === 0 ? "Any" : `${n}+`}
                      selected={n === minBeds}
                      onClick={() => {
                        setMinBeds(n);
                        close();
                      }}
                    />
                  ))}
                </div>
              )}
            </FilterDropdown>

            <FilterDropdown label={minBaths ? `${minBaths}+ baths` : "All baths"} active={minBaths !== 0}>
              {(close) => (
                <div className="flex flex-col gap-0.5">
                  {BED_BATH_OPTIONS.map((n) => (
                    <DropdownOption
                      key={n}
                      label={n === 0 ? "Any" : `${n}+`}
                      selected={n === minBaths}
                      onClick={() => {
                        setMinBaths(n);
                        close();
                      }}
                    />
                  ))}
                </div>
              )}
            </FilterDropdown>

            {/* List / Map — meaningful on small screens where the two can't sit
                side by side; on desktop both panels already show together. */}
            <div className="inline-flex p-1 bg-background-200 rounded-full lg:ml-auto">
              <button
                onClick={() => setMobileView("list")}
                aria-pressed={mobileView === "list"}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium tracking-wide rounded-full transition-all duration-300 whitespace-nowrap ${
                  mobileView === "list" ? "bg-foreground-950 text-background-50" : "text-foreground-600 hover:text-foreground-950"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" strokeWidth={1.5} />
                List
              </button>
              <button
                onClick={() => setMobileView("map")}
                aria-pressed={mobileView === "map"}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium tracking-wide rounded-full transition-all duration-300 whitespace-nowrap ${
                  mobileView === "map" ? "bg-foreground-950 text-background-50" : "text-foreground-600 hover:text-foreground-950"
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                Map
              </button>
            </div>
          </div>

          {/* Results header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl text-foreground-950">
                {isSold ? "Recently Sold" : "Available Properties"}
              </h2>
              <p className="text-sm text-foreground-500 mt-1">
                <span className="font-medium text-foreground-900">{properties.length}</span>{" "}
                result{properties.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {fullSearchUrl && (
                <a
                  href={fullSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 text-sm font-medium text-foreground-700 border border-background-300 rounded-full hover:border-foreground-400 transition-colors whitespace-nowrap"
                >
                  Search the full MLS
                </a>
              )}
              <SaveSearchButton
                searchName={`${isSold ? "Sold" : "Available"} homes${minBeds ? `, ${minBeds}+ beds` : ""}${
                  priceIdx ? `, ${PRICE_OPTIONS[priceIdx].label}` : ""
                }`}
                criteria={{
                  status: activeTab,
                  q: query,
                  priceMin: String(PRICE_OPTIONS[priceIdx].min || ""),
                  priceMax: Number.isFinite(PRICE_OPTIONS[priceIdx].max) ? String(PRICE_OPTIONS[priceIdx].max) : "",
                  beds: String(minBeds || ""),
                  baths: String(minBaths || ""),
                }}
              />
              <label className="flex items-center gap-2 text-sm text-foreground-600">
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="pl-3 pr-8 py-2 bg-background-100 border border-background-300 rounded-full text-sm text-foreground-900 focus:outline-none focus:border-primary-500 transition-colors"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* List + Map, side by side on desktop like a real search page */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
            <div className={`lg:col-span-3 ${mobileView === "map" ? "hidden lg:block" : ""}`}>
              {loading ? (
                <p className="py-20 text-center text-sm text-foreground-500">Loading listings…</p>
              ) : properties.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeTab}-${query}-${priceIdx}-${minBeds}-${minBaths}-${sort}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 lg:max-h-[760px] lg:overflow-y-auto lg:pr-3"
                  >
                    {properties.map((property) => (
                      <PropertyCard key={property.id} property={property} isSold={activeTab === "sold"} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-foreground-700 font-medium mb-1">No listings match those filters</p>
                  <p className="text-sm text-foreground-500">Try widening your price range or clearing a filter.</p>
                </div>
              )}
            </div>

            <div className={`lg:col-span-2 ${mobileView === "list" ? "hidden lg:block" : ""}`}>
              <div className="lg:sticky lg:top-28">
                <PropertyMap tab={activeTab} properties={properties} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
