import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, ExternalLink, Mail } from "lucide-react";
import PageHero from "@/components/feature/PageHero";
import { findLeadByEmail, getLeadSearches, deleteLeadSearch, type SavedSearch } from "@/lib/idx";

const LEAD_ID_KEY = "idx-lead-id";
const LEAD_EMAIL_KEY = "idx-lead-email";

function criteriaSummary(criteria: Record<string, unknown>): string {
  const parts = Object.entries(criteria)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`);
  return parts.length ? parts.join(" · ") : "All listings";
}

export default function Account() {
  const [leadId, setLeadId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [lookupStatus, setLookupStatus] = useState<"idle" | "checking" | "not-found" | "error">("idle");

  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loadingSearches, setLoadingSearches] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem(LEAD_ID_KEY);
    const savedEmail = localStorage.getItem(LEAD_EMAIL_KEY);
    if (savedId) setLeadId(savedId);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  useEffect(() => {
    if (!leadId) return;
    setLoadingSearches(true);
    getLeadSearches(leadId)
      .then(setSearches)
      .catch(() => setSearches([]))
      .finally(() => setLoadingSearches(false));
  }, [leadId]);

  const lookUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLookupStatus("checking");
    try {
      const found = await findLeadByEmail(email);
      if (found) {
        localStorage.setItem(LEAD_ID_KEY, found);
        localStorage.setItem(LEAD_EMAIL_KEY, email);
        setLeadId(found);
        setLookupStatus("idle");
      } else {
        setLookupStatus("not-found");
      }
    } catch {
      setLookupStatus("error");
    }
  };

  const useDifferentEmail = () => {
    localStorage.removeItem(LEAD_ID_KEY);
    localStorage.removeItem(LEAD_EMAIL_KEY);
    setLeadId(null);
    setEmail("");
    setSearches([]);
    setLookupStatus("idle");
  };

  const removeSearch = async (searchId: string) => {
    if (!leadId) return;
    setDeletingId(searchId);
    const ok = await deleteLeadSearch(leadId, searchId);
    if (ok) setSearches((prev) => prev.filter((s) => s.id !== searchId));
    setDeletingId(null);
  };

  return (
    <div className="w-full">
      <PageHero
        eyebrow="Your Account"
        title="My Saved"
        italicTitle="Searches"
        subtitle="Pick up right where you left off — see and manage the searches you've saved."
        image="/images/stefanie/lifestyle-4.jpg"
        imageAlt="My saved searches"
      />

      <section className="w-full bg-background-50 py-20 md:py-28 lg:py-36">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <div className="max-w-2xl mx-auto">
            {!leadId ? (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-background-50 rounded-2xl border border-background-200/60 p-8 md:p-10 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary-100/70 text-primary-700 flex items-center justify-center mx-auto mb-5">
                  <Mail className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <h1 className="font-heading text-2xl text-foreground-950 mb-2">Sign In With Your Email</h1>
                <p className="text-sm text-foreground-600 mb-6">
                  Enter the email you used when saving a search on the Listings page.
                </p>
                <form onSubmit={lookUp} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="flex-1 px-4 py-3 bg-background-100 border border-background-300 rounded-md text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={lookupStatus === "checking"}
                    className="px-6 py-3 bg-foreground-950 text-background-50 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-foreground-800 transition-colors whitespace-nowrap disabled:opacity-60"
                  >
                    {lookupStatus === "checking" ? "Checking…" : "Continue"}
                  </button>
                </form>
                {lookupStatus === "not-found" && (
                  <p className="mt-4 text-sm text-foreground-600">
                    We couldn&rsquo;t find any saved searches for that email.{" "}
                    <a href="/listings" className="text-primary-700 underline">
                      Save one from the Listings page
                    </a>{" "}
                    first.
                  </p>
                )}
                {lookupStatus === "error" && (
                  <p className="mt-4 text-sm text-red-600">Something went wrong — please try again.</p>
                )}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="font-heading text-2xl text-foreground-950">My Saved Searches</h1>
                    <p className="text-sm text-foreground-500 mt-1">{email}</p>
                  </div>
                  <button onClick={useDifferentEmail} className="text-xs font-medium text-foreground-600 underline hover:text-foreground-950 whitespace-nowrap">
                    Use a different email
                  </button>
                </div>

                {loadingSearches ? (
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
                  <div className="flex flex-col gap-4">
                    {searches.map((s) => (
                      <article
                        key={s.id}
                        className="bg-background-50 rounded-xl border border-background-200/60 p-5 flex items-start justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <h3 className="font-medium text-foreground-950">{s.searchName}</h3>
                          <p className="text-xs text-foreground-500 mt-1 break-words">{criteriaSummary(s.criteria)}</p>
                          <a
                            href={s.resultsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-primary-700 hover:text-primary-800"
                          >
                            View matching homes
                            <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                          </a>
                        </div>
                        <button
                          onClick={() => removeSearch(s.id)}
                          disabled={deletingId === s.id}
                          aria-label={`Delete ${s.searchName}`}
                          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-foreground-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
