import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Lock, Heart } from "lucide-react";
import PageHero from "@/components/feature/PageHero";
import { useLead } from "@/hooks/useLead";
import { useIdxListings } from "@/hooks/useIdxListings";
import { getLeadFavoriteListings, type FavoriteListing } from "@/lib/idx";
import { listSavedSearches, deleteSavedSearch, type SavedSearchRow } from "@/lib/savedSearches";
import { PropertyCard } from "../listings/components/PropertyGrid";

function criteriaSummary(criteria: Record<string, unknown>): string {
  const parts = Object.entries(criteria)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`);
  return parts.length ? parts.join(" · ") : "All listings";
}

export default function Account() {
  const { leadId, loading: authLoading, requireLead } = useLead();
  const [tab, setTab] = useState<"favorites" | "searches">("favorites");

  /* ---------- Favorites ----------
     Read straight from the lead's saved properties rather than intersecting
     saved ids with this site's own feed: a visitor saving from IDX's hosted
     MLS pages can save any listing in the MLS, and those rows carry the whole
     listing with them, so they render here too. `data` is still fetched, but
     only to link a saved listing that *is* one of Stefanie's to its page on
     this site instead of to IDX's. */
  const { data } = useIdxListings();
  const [favorites, setFavorites] = useState<FavoriteListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  useEffect(() => {
    if (!leadId) {
      setFavorites([]);
      return;
    }
    setListingsLoading(true);
    getLeadFavoriteListings(leadId)
      .then(setFavorites)
      .catch(() => setFavorites([]))
      .finally(() => setListingsLoading(false));
  }, [leadId]);

  /** listingID -> this site's own slug, for the saved listings that are ours. */
  const ownSlugs = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of [...(data?.available ?? []), ...(data?.sold ?? [])]) map.set(p.listingID, p.slug);
    return map;
  }, [data]);

  /* ---------- Saved searches ---------- */
  const [searches, setSearches] = useState<SavedSearchRow[]>([]);
  const [loadingSearches, setLoadingSearches] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!leadId) {
      setSearches([]);
      return;
    }
    setLoadingSearches(true);
    listSavedSearches(leadId)
      .then(setSearches)
      .finally(() => setLoadingSearches(false));
  }, [leadId]);

  const removeSearch = async (searchId: string) => {
    if (!leadId) return;
    setDeletingId(searchId);
    const ok = await deleteSavedSearch(leadId, searchId);
    if (ok) setSearches((prev) => prev.filter((s) => s.id !== searchId));
    setDeletingId(null);
  };

  if (authLoading) return null;

  return (
    <div className="w-full">
      <PageHero
        eyebrow="Your Account"
        title="My Search"
        italicTitle="Portal"
        subtitle="Pick up right where you left off — your saved homes and searches, in one place."
        image="/images/stefanie/lifestyle-4.jpg"
        imageAlt="My account"
      />

      <section className="w-full bg-background-50 py-20 md:py-28 lg:py-36">
        <div className="w-full px-6 md:px-10 lg:px-16">
          {!leadId ? (
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-background-50 rounded-2xl border border-background-200/60 p-8 md:p-10 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary-100/70 text-primary-700 flex items-center justify-center mx-auto mb-5">
                  <Lock className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <h1 className="font-heading text-2xl text-foreground-950 mb-2">Continue To See Your Favorites</h1>
                <p className="text-sm text-foreground-600 mb-6">
                  Save your info to see your favorite homes and saved searches.
                </p>
                <button
                  type="button"
                  onClick={() => requireLead()}
                  className="px-6 py-3 bg-foreground-950 text-background-50 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-foreground-800 transition-colors"
                >
                  Continue
                </button>
              </motion.div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                <h1 className="font-heading text-2xl text-foreground-950">My Search Portal</h1>
                <div className="inline-flex p-1 bg-background-200 rounded-full">
                  <button
                    onClick={() => setTab("favorites")}
                    className={`px-5 py-2 text-sm font-medium tracking-wide rounded-full transition-all duration-300 whitespace-nowrap ${
                      tab === "favorites" ? "bg-foreground-950 text-background-50" : "text-foreground-600 hover:text-foreground-950"
                    }`}
                  >
                    Favorites ({favorites.length})
                  </button>
                  <button
                    onClick={() => setTab("searches")}
                    className={`px-5 py-2 text-sm font-medium tracking-wide rounded-full transition-all duration-300 whitespace-nowrap ${
                      tab === "searches" ? "bg-foreground-950 text-background-50" : "text-foreground-600 hover:text-foreground-950"
                    }`}
                  >
                    Saved Searches ({searches.length})
                  </button>
                </div>
              </div>

              {tab === "favorites" ? (
                listingsLoading ? (
                  <p className="text-sm text-foreground-500 py-12 text-center">Loading…</p>
                ) : favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-8 h-8 text-foreground-300 mx-auto mb-3" strokeWidth={1.5} />
                    <p className="text-foreground-700 font-medium mb-1">No saved homes yet</p>
                    <p className="text-sm text-foreground-500 mb-6">Tap Save on any listing and it&rsquo;ll show up here.</p>
                    <a
                      href="/listings"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-foreground-950 text-background-50 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-foreground-800 transition-colors"
                    >
                      <Search className="w-4 h-4" strokeWidth={1.5} />
                      Browse Listings
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {favorites.map((property) => {
                      const ownSlug = ownSlugs.get(property.listingID);
                      return (
                        <PropertyCard
                          key={property.favoriteId}
                          property={property}
                          isSold={property.isSold}
                          showSave
                          initialSaved
                          href={ownSlug ? `/listings/${ownSlug}` : property.externalUrl ?? undefined}
                          onToggleSaved={(mlsId, isSaved) => {
                            if (isSaved) return;
                            setFavorites((prev) => prev.filter((f) => f.listingID !== mlsId));
                          }}
                        />
                      );
                    })}
                  </div>
                )
              ) : loadingSearches ? (
                <p className="text-sm text-foreground-500 py-12 text-center">Loading…</p>
              ) : searches.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-foreground-700 font-medium mb-1">No saved searches yet</p>
                  <p className="text-sm text-foreground-500 mb-6">Save a search from the Listings page and it&rsquo;ll show up here.</p>
                  <a
                    href="/listings"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-foreground-950 text-background-50 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-foreground-800 transition-colors"
                  >
                    <Search className="w-4 h-4" strokeWidth={1.5} />
                    Browse Listings
                  </a>
                </div>
              ) : (
                <div className="max-w-2xl flex flex-col gap-4">
                  {searches.map((s) => (
                    <article
                      key={s.id}
                      className="bg-background-50 rounded-xl border border-background-200/60 p-5 flex items-start justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <h3 className="font-medium text-foreground-950">{s.name}</h3>
                        <p className="text-xs text-foreground-500 mt-1 break-words">{criteriaSummary(s.criteria)}</p>
                      </div>
                      <button
                        onClick={() => removeSearch(s.id)}
                        disabled={deletingId === s.id}
                        aria-label={`Delete ${s.name}`}
                        className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-foreground-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
