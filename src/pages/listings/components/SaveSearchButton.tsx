import { useEffect, useRef, useState } from "react";
import { Bookmark, X } from "lucide-react";
import { createLead, saveLeadSearch } from "@/lib/idx";

const LEAD_ID_KEY = "idx-lead-id";
const LEAD_EMAIL_KEY = "idx-lead-email";

/** "Save this search" — creates (or reuses, via localStorage) an IDX Broker
 *  lead, then stores the current filter criteria as that lead's saved
 *  search via leads/search/{leadId}. No login system — just enough to
 *  capture intent, matching what the API actually supports. */
export default function SaveSearchButton({
  searchName,
  criteria,
}: {
  searchName: string;
  criteria: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem(LEAD_EMAIL_KEY);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("saving");
    try {
      let leadId = localStorage.getItem(LEAD_ID_KEY);
      if (!leadId) {
        const [firstName, ...rest] = name.trim().split(" ");
        leadId = await createLead({
          firstName: firstName || "Search",
          lastName: rest.join(" ") || "Alert",
          email,
        });
        if (leadId) localStorage.setItem(LEAD_ID_KEY, leadId);
      }
      if (!leadId) throw new Error("Could not create lead");
      localStorage.setItem(LEAD_EMAIL_KEY, email);

      const ok = await saveLeadSearch(leadId, { searchName, search: criteria });
      setStatus(ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 bg-background-100 border border-background-300 rounded-md text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
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
