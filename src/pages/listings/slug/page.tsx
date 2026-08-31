import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Share2,
  BedDouble,
  Bath,
  Ruler,
  Calendar,
  Home,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Camera,
  Copy,
  Check,
} from "lucide-react";
import { useIdxListings } from "@/hooks/useIdxListings";
import type { AvailableProperty, SoldProperty } from "@/lib/idx";
import { PHOTO_FALLBACK } from "@/lib/media";
import { useAuth } from "@/hooks/useAuth";
import { listFavoriteMlsIds, addFavorite, removeFavorite } from "@/lib/favorites";
import { PropertyCard } from "../components/PropertyGrid";
import PropertyLocationMap from "./PropertyLocationMap";
import NotFound from "../../NotFound";

type PropertyMatch = { property: AvailableProperty | SoldProperty; isSold: boolean };
const FEATURE_TABS = [
  { key: "interior", label: "Interior" },
  { key: "exterior", label: "Exterior & Lot" },
  { key: "details", label: "Property Details" },
] as const;

export default function PropertyDetail() {
  const { slug } = useParams();
  const [saved, setSaved] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share");
  const [activeIndex, setActiveIndex] = useState(0);
  const [featTab, setFeatTab] = useState<(typeof FEATURE_TABS)[number]["key"]>("interior");
  const [copied, setCopied] = useState(false);
  const { data, loading } = useIdxListings();
  const { user, requireAuth } = useAuth();

  useEffect(() => {
    setActiveIndex(0);
    setFeatTab("interior");
  }, [slug]);

  const match: PropertyMatch | null = data
    ? (() => {
        const forSale = data.available.find((p) => p.slug === slug);
        if (forSale) return { property: forSale, isSold: false };
        const sold = data.sold.find((p) => p.slug === slug);
        if (sold) return { property: sold, isSold: true };
        return null;
      })()
    : null;
  const matchMlsId = match?.property.listingID;

  useEffect(() => {
    if (!user || !matchMlsId) {
      setSaved(false);
      return;
    }
    listFavoriteMlsIds(user.id).then((ids) => setSaved(ids.has(matchMlsId)));
  }, [user, matchMlsId]);

  const similar = useMemo(() => {
    if (!data || !match) return [];
    const available = data.available
      .filter((p) => p.slug !== slug)
      .map((property) => ({ property, isSold: false as const }));
    const sold = data.sold
      .filter((p) => p.slug !== slug)
      .map((property) => ({ property, isSold: true as const }));
    return [...available, ...sold].slice(0, 4);
  }, [data, match, slug]);

  if (loading) {
    return <div className="w-full py-32 text-center text-sm text-foreground-500">Loading…</div>;
  }

  if (!match) return <NotFound />;
  const { property, isSold } = match;
  const gallery = property.gallery?.length ? property.gallery : [property.image];
  const showPrev = () => setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length);
  const showNext = () => setActiveIndex((i) => (i + 1) % gallery.length);

  const price = isSold ? (property as SoldProperty).soldPrice : (property as AvailableProperty).price;
  const soldDateLabel = isSold ? (property as SoldProperty).dateSold : null;

  const description =
    property.remarks ||
    (isSold
      ? `${property.address} in ${property.city} sold in ${soldDateLabel} — a ${property.beds}-bedroom, ${property.baths}-bathroom home spanning approximately ${property.sqft} square feet. Curious what your own home could sell for in today's market? Reach out for a complimentary, no-obligation valuation.`
      : `Located at ${property.address} in ${property.city}, this ${property.beds}-bedroom, ${property.baths}-bathroom home offers approximately ${property.sqft} square feet of living space. Reach out to schedule a private showing or to learn more about this property.`);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: property.address, url });
        return;
      } catch {
        // user cancelled — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareLabel("Link Copied");
      setTimeout(() => setShareLabel("Share"), 2500);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(`${property.address}, ${property.city}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  const featureRows = property.features[featTab];

  return (
    <div className="w-full">
      {/* Hero gallery — full-bleed behind the fixed header, like every other interior page */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative w-full h-[60vh] min-h-[440px] max-h-[680px] overflow-hidden group"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={gallery[activeIndex]}
            alt={`${property.address} — photo ${activeIndex + 1} of ${gallery.length}`}
            referrerPolicy="no-referrer"
            onError={(e) => (e.currentTarget.src = PHOTO_FALLBACK)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/40" />

        <a
          href="/listings"
          className="absolute top-24 md:top-28 left-6 md:left-10 lg:left-16 inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to Listings
        </a>

        {isSold && (
          <div className="absolute bottom-6 left-6 md:left-10 lg:left-16 px-4 py-2 bg-foreground-950/90 text-background-50 text-xs font-semibold tracking-[0.2em] uppercase rounded-full">
            Sold
          </div>
        )}

        {gallery.length > 1 && (
          <>
            {/* Prev / Next */}
            <button
              onClick={showPrev}
              aria-label="Previous photo"
              className="absolute top-1/2 left-4 md:left-6 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              onClick={showNext}
              aria-label="Next photo"
              className="absolute top-1/2 right-4 md:right-6 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Photo counter */}
            <div className="absolute top-24 md:top-28 right-6 md:right-10 lg:right-16 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium">
              <Camera className="w-3.5 h-3.5" strokeWidth={1.5} />
              {activeIndex + 1} / {gallery.length}
            </div>

            {/* Thumbnail strip */}
            <div className="absolute bottom-6 right-6 md:right-10 lg:right-16 hidden sm:flex items-center gap-2">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`View photo ${i + 1}`}
                  className={`w-14 h-10 rounded-md overflow-hidden ring-2 transition-all duration-300 ${
                    i === activeIndex ? "ring-background-50" : "ring-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={(e) => (e.currentTarget.src = PHOTO_FALLBACK)}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Sub-nav */}
      <nav className="w-full border-b border-background-200 bg-background-50" aria-label="Section navigation">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <div className="max-w-6xl mx-auto flex items-center gap-6 md:gap-8 overflow-x-auto py-4 text-sm font-medium text-foreground-600">
            <a href="#overview" className="hover:text-primary-700 transition-colors whitespace-nowrap">Overview</a>
            <a href="#features" className="hover:text-primary-700 transition-colors whitespace-nowrap">Features</a>
            <a href="#location" className="hover:text-primary-700 transition-colors whitespace-nowrap">Location</a>
            <a href="#history" className="hover:text-primary-700 transition-colors whitespace-nowrap">History</a>
            {similar.length > 0 && (
              <a href="#similar" className="hover:text-primary-700 transition-colors whitespace-nowrap">Similar Properties</a>
            )}
          </div>
        </div>
      </nav>

      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Save / Share + location */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
            <div className="flex items-center gap-5">
              <button
                onClick={() => {
                  if (!user) {
                    requireAuth("Sign in to save this home to your favorites.");
                    return;
                  }
                  const on = !saved;
                  setSaved(on);
                  const persist = on
                    ? addFavorite(user.id, property.listingID)
                    : removeFavorite(user.id, property.listingID);
                  persist.then((ok) => {
                    if (!ok) setSaved(!on);
                  });
                }}
                className="flex items-center gap-2 text-sm text-foreground-700 hover:text-primary-700 transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${saved ? "fill-primary-600 text-primary-600" : ""}`}
                  strokeWidth={1.5}
                />
                {saved ? "Saved" : "Save"}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-sm text-foreground-700 hover:text-primary-700 transition-colors"
              >
                <Share2 className="w-4 h-4" strokeWidth={1.5} />
                {shareLabel}
              </button>
            </div>
            <p className="text-sm text-foreground-500">{property.city}</p>
          </div>

          {/* Price + specs + agent */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 mt-10">
            <div className="lg:col-span-2">
              <div id="overview">
                <p className="text-4xl md:text-5xl font-heading text-foreground-950">{price}</p>
                <p className="mt-2 text-lg text-foreground-700">{property.address}</p>
                {isSold && (
                  <p className="mt-1 text-sm text-foreground-500">Sold {soldDateLabel}</p>
                )}

                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-8 pt-8 border-t border-background-200">
                  <span className="flex items-center gap-2 text-sm text-foreground-700">
                    <BedDouble className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
                    {property.beds} Beds
                  </span>
                  <span className="flex items-center gap-2 text-sm text-foreground-700">
                    <Bath className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
                    {property.baths} Baths
                  </span>
                  <span className="flex items-center gap-2 text-sm text-foreground-700">
                    <Ruler className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
                    {property.sqft} SqFt
                  </span>
                  {property.yearBuilt && (
                    <span className="flex items-center gap-2 text-sm text-foreground-700">
                      <Calendar className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
                      Built {property.yearBuilt}
                    </span>
                  )}
                  <span className="flex items-center gap-2 text-sm text-foreground-700">
                    <Home className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
                    {property.propType}
                  </span>
                </div>

                <p className="mt-8 text-foreground-700 leading-relaxed max-w-2xl">{description}</p>
              </div>

              {/* Features */}
              <section className="mt-14 pt-14 border-t border-background-200" id="features">
                <h2 className="font-heading text-2xl text-foreground-950 mb-6">Features &amp; Amenities</h2>
                <div className="inline-flex p-1 bg-background-200 rounded-full mb-6">
                  {FEATURE_TABS.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setFeatTab(t.key)}
                      className={`px-4 py-2 text-sm font-medium tracking-wide rounded-full transition-all duration-300 whitespace-nowrap ${
                        featTab === t.key ? "bg-foreground-950 text-background-50" : "text-foreground-600 hover:text-foreground-950"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  {featureRows.map((f) => (
                    <div key={f.label} className="flex items-center justify-between gap-4 py-3 border-b border-background-200/60">
                      <dt className="text-sm text-foreground-500">{f.label}</dt>
                      <dd className="text-sm font-medium text-foreground-950 text-right">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              {/* Location */}
              <section className="mt-14 pt-14 border-t border-background-200" id="location">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-2xl text-foreground-950">Location</h2>
                  <button
                    onClick={copyAddress}
                    className="flex items-center gap-1.5 text-sm text-foreground-600 hover:text-primary-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />}
                    {copied ? "Copied!" : "Copy address"}
                  </button>
                </div>
                <p className="text-sm text-foreground-500 mb-4">{property.address}, {property.city}</p>
                <PropertyLocationMap lat={property.lat} lng={property.lng} label={property.address} />
              </section>

              {/* History */}
              <section className="mt-14 pt-14 pb-20 md:pb-28 border-t border-background-200" id="history">
                <h2 className="font-heading text-2xl text-foreground-950 mb-6">Property History</h2>
                <div className="flex flex-col">
                  {property.history.map((h, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 py-4 border-b border-background-200/60">
                      <div className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-primary-600 flex-none" />
                        <div>
                          <p className="text-sm font-medium text-foreground-950">{h.event}</p>
                          <p className="text-xs text-foreground-500 mt-0.5">{h.sub}</p>
                        </div>
                      </div>
                      {h.price && <span className="text-sm font-medium text-foreground-950 whitespace-nowrap">{h.price}</span>}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Agent card */}
            <div className="lg:col-span-1">
              <div className="bg-accent-100 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center lg:sticky lg:top-28">
                <img
                  src="/images/stefanie/headshot.jpg"
                  alt="Stefanie Pollack"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <p className="mt-4 font-heading text-lg text-foreground-950">Stefanie Pollack</p>
                <p className="text-xs text-foreground-500 tracking-wide uppercase mt-1">
                  Listing Agent &bull; DRE #01815614
                </p>
                <a
                  href="/contact"
                  className="mt-6 w-full px-6 py-3 bg-foreground-950 text-background-50 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-foreground-800 transition-colors duration-300"
                >
                  Contact Agent
                </a>
                <a
                  href={isSold ? "/sellers" : "/buyers"}
                  className="mt-3 w-full px-6 py-3 border border-foreground-300 text-foreground-800 text-sm font-medium tracking-wide uppercase rounded-md hover:border-foreground-950 hover:text-foreground-950 transition-all duration-300"
                >
                  {isSold ? "Get My Home Value" : "Schedule a Showing"}
                </a>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <section className="pt-14 pb-20 md:pb-28 border-t border-background-200" id="similar">
              <h2 className="font-heading text-2xl text-foreground-950 mb-8">Similar Properties</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {similar.map(({ property: p, isSold: s }) => (
                  <PropertyCard key={p.id} property={p} isSold={s} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
