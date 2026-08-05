import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Share2, BedDouble, Bath, Ruler, ArrowLeft } from "lucide-react";
import { featuredProperties, soldListings } from "@/mocks/home";
import NotFound from "../../NotFound";

type PropertyMatch =
  | { property: (typeof featuredProperties)[number]; isSold: false }
  | { property: (typeof soldListings)[number]; isSold: true };

function findProperty(slug: string | undefined): PropertyMatch | null {
  const forSale = featuredProperties.find((p) => p.slug === slug);
  if (forSale) return { property: forSale, isSold: false };
  const sold = soldListings.find((p) => p.slug === slug);
  if (sold) return { property: sold, isSold: true };
  return null;
}

export default function PropertyDetail() {
  const { slug } = useParams();
  const [saved, setSaved] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share");

  const match = findProperty(slug);
  if (!match) return <NotFound />;
  const { property, isSold } = match;

  const price = isSold
    ? (property as (typeof soldListings)[number]).soldPrice
    : (property as (typeof featuredProperties)[number]).price;
  const soldDateLabel = isSold ? (property as (typeof soldListings)[number]).dateSold : null;

  const description = isSold
    ? `${property.address} in ${property.city} sold in ${soldDateLabel} — a ${property.beds}-bedroom, ${property.baths}-bathroom home spanning approximately ${property.sqft} square feet. Curious what your own home could sell for in today's market? Reach out for a complimentary, no-obligation valuation.`
    : `Located at ${property.address} in ${property.city}, this ${property.beds}-bedroom, ${property.baths}-bathroom home offers approximately ${property.sqft} square feet of living space. Reach out to schedule a private showing or to learn more about this property.`;

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

  return (
    <div className="w-full">
      {/* Hero image — full-bleed behind the fixed header, like every other interior page */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative w-full h-[60vh] min-h-[440px] max-h-[680px] overflow-hidden"
      >
        <img src={property.image} alt={property.address} className="w-full h-full object-cover" />
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
      </motion.div>

      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Save / Share + location */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
            <div className="flex items-center gap-5">
              <button
                onClick={() => setSaved((s) => !s)}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 mt-10 pb-20 md:pb-28">
            <div className="lg:col-span-2">
              <p className="text-4xl md:text-5xl font-heading text-foreground-950">{price}</p>
              <p className="mt-2 text-lg text-foreground-700">{property.address}</p>
              {isSold && (
                <p className="mt-1 text-sm text-foreground-500">Sold {soldDateLabel}</p>
              )}

              <div className="flex items-center gap-8 mt-8 pt-8 border-t border-background-200">
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
              </div>

              <p className="mt-8 text-foreground-700 leading-relaxed max-w-2xl">{description}</p>
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
        </div>
      </div>
    </div>
  );
}
