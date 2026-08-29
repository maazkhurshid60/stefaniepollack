import { useEffect, useRef, useState } from "react";
import { Bookmark, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createSavedSearch } from "@/lib/savedSearches";
import { createLead, saveLeadSearch } from "@/lib/idx";

const LEAD_ID_KEY = "idx-lead-id";

/** "Save this search" — stores the search under the signed-in account
 *  (Supabase), and best-effort mirrors it into IDX Broker's own lead/CRM
 *  so Stefanie sees it in her IDX dashboard too. The IDX side never blocks
 *  success shown to the user. */
export default function SaveSearchButton({
  searchName,
  criteria,
}: {
  searchName: string;
  criteria: Record<string, string>;
}) {
  const { user, requireAuth } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(searchName);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const openPopover = () => {
    if (!user) {
      requireAuth("Sign in to save this search and get notified of new matches.");
      return;
    }
    setName(searchName);
    setStatus("idle");
    setOpen(true);
  };

  const mirrorToIdx = async () => {
    if (!user?.email) return;
    try {
      let leadId = localStorage.getItem(LEAD_ID_KEY);
      if (!leadId) {
        const fullName = (user.user_metadata?.full_name as string | undefined) || "";
        const [firstName, ...rest] = fullName.trim().split(" ");
        leadId = await createLead({
          firstName: firstName || "Search",
          lastName: rest.join(" ") || "Alert",
          email: user.email,
          phone: (user.user_metadata?.phone as string | undefined) || undefined,
        });
        if (leadId) localStorage.setItem(LEAD_ID_KEY, leadId);
      }
      if (leadId) await saveLeadSearch(leadId, { searchName: name, search: criteria });
    } catch {
      /* best-effort only — the Supabase save is the source of truth for the user */
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setStatus("saving");
    const ok = await createSavedSearch(user.id, name.trim() || searchName, criteria);
    setStatus(ok ? "saved" : "error");
    if (ok) mirrorToIdx();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={openPopover}
        className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-foreground-700 border border-background-300 rounded-full hover:border-foreground-400 transition-colors whitespace-nowrap"
      >
        <Bookmark className="w-3.5 h-3.5" strokeWidth={1.5} />
        Save search
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-30 w-72 bg-background-50 border border-background-300 rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-foreground-950">Get notified of new matches</p>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X className="w-4 h-4 text-foreground-400" strokeWidth={1.5} />
            </button>
          </div>

          {status === "saved" ? (
            <div>
              <p className="text-sm text-primary-700">
                Saved — you&rsquo;ll hear from Stefanie&rsquo;s team when a matching home hits the market.
              </p>
              <a
                href="/account"
                className="mt-2 inline-block text-xs font-medium text-foreground-600 underline hover:text-foreground-950"
              >
                View all your saved searches
              </a>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-2.5">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name this search"
                className="w-full px-3 py-2 bg-background-100 border border-background-300 rounded-md text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400"
              />
              <button
                type="submit"
                disabled={status === "saving"}
                className="mt-1 w-full px-4 py-2 bg-foreground-950 text-background-50 text-sm font-medium rounded-md hover:bg-foreground-800 transition-colors disabled:opacity-60"
              >
                {status === "saving" ? "Saving…" : "Save this search"}
              </button>
              {status === "error" && (
                <p className="text-xs text-red-600">Something went wrong — please try again.</p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
