import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Lock, Heart } from "lucide-react";
import PageHero from "@/components/feature/PageHero";
import { useAuth } from "@/hooks/useAuth";
import { useIdxListings } from "@/hooks/useIdxListings";
import { listFavoriteMlsIds } from "@/lib/favorites";
import { listSavedSearches, deleteSavedSearch, type SavedSearchRow } from "@/lib/savedSearches";
import { PropertyCard, type ListedProperty } from "../listings/components/PropertyGrid";

function criteriaSummary(criteria: Record<string, unknown>): string {
  const parts = Object.entries(criteria)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`);
  return parts.length ? parts.join(" · ") : "All listings";
}

export default function Account() {
  const { user, loading: authLoading, requireAuth } = useAuth();
  const [tab, setTab] = useState<"favorites" | "searches">("favorites");

  /* ---------- Favorites ---------- */
  const { data, loading: listingsLoading } = useIdxListings();
  const [savedMls, setSavedMls] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (!user) return;
    listFavoriteMlsIds(user.id).then(setSavedMls);
  }, [user]);
  const favorites = useMemo((): { property: ListedProperty; isSold: boolean }[] => {
    if (!data) return [];
    const available = data.available.filter((p) => savedMls.has(p.listingID)).map((property) => ({ property, isSold: false }));
    const sold = data.sold.filter((p) => savedMls.has(p.listingID)).map((property) => ({ property, isSold: true }));
    return [...available, ...sold];
  }, [data, savedMls]);

  /* ---------- Saved searches ---------- */
  const [searches, setSearches] = useState<SavedSearchRow[]>([]);
  const [loadingSearches, setLoadingSearches] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSearches([]);
      return;
    }
    setLoadingSearches(true);
    listSavedSearches(user.id)
      .then(setSearches)
      .finally(() => setLoadingSearches(false));
  }, [user]);

  const removeSearch = async (searchId: string) => {
    if (!user) return;
    setDeletingId(searchId);
    const ok = await deleteSavedSearch(user.id, searchId);
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
          {!user ? (
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
                <h1 className="font-heading text-2xl text-foreground-950 mb-2">Sign In To Continue</h1>
                <p className="text-sm text-foreground-600 mb-6">
                  Sign in to see your favorite homes and saved searches.
                </p>
                <button
                  type="button"
                  onClick={() => requireAuth()}
                  className="px-6 py-3 bg-foreground-950 text-background-50 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-foreground-800 transition-colors"
                >
                  Sign In / Register
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
                    {favorites.map(({ property, isSold }) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isSold={isSold}
                        showSave
                        initialSaved
                        onToggleSaved={(mlsId, isSaved) => {
                          if (isSaved) return;
                          setSavedMls((prev) => {
                            const next = new Set(prev);
                            next.delete(mlsId);
                            return next;
                          });
                        }}
                      />
                    ))}
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
