import { useEffect, useRef, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { useLead } from "@/hooks/useLead";

const ACK_KEY = "idx-full-mls-notice-seen";

/** Link out to IDX Broker's own hosted MLS search.
 *
 *  IDX has no SSO: its hosted pages keep their own login on idxbroker.com, and
 *  the lead API is CRUD-only, so there's no way to sign a visitor in from here.
 *  What does tie the two together is the email — it's a unique key on leads for
 *  this account (a duplicate PUT comes back 409 "Lead already exists"), so
 *  saving over there under the same address lands on the same lead record, and
 *  those saves then show up in /account. Hence this one-time nudge telling the
 *  visitor which address to use. */
export default function FullMlsLink({ url }: { url: string }) {
  const { leadId, email, requireLead } = useLead();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const seen = () => {
    try {
      return localStorage.getItem(ACK_KEY) === "1";
    } catch {
      return false; // private mode etc. — just show the notice again
    }
  };

  const go = () => {
    try {
      localStorage.setItem(ACK_KEY, "1");
    } catch {
      /* non-fatal — the notice simply shows again next time */
    }
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const onClick = (e: React.MouseEvent) => {
    // Signed out: capture an email first, so there's an account for their MLS
    // saves to come back to at all.
    if (!leadId) {
      e.preventDefault();
      requireLead("Save your info first, so homes you save on the full MLS search come back to your account here.");
      return;
    }
    if (seen()) return; // already knows the drill — let the link through
    e.preventDefault();
    setOpen(true);
  };

  return (
    <div className="relative" ref={ref}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-foreground-700 border border-background-300 rounded-full hover:border-foreground-400 transition-colors whitespace-nowrap"
      >
        Search the full MLS
      </a>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-30 w-80 bg-background-50 border border-background-300 rounded-xl shadow-lg p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-sm font-medium text-foreground-950">Use the same email over there</p>
            <button onClick={() => setOpen(false)} aria-label="Close" className="flex-shrink-0">
              <X className="w-4 h-4 text-foreground-400" strokeWidth={1.5} />
            </button>
          </div>
          <p className="text-sm text-foreground-600 leading-relaxed">
            The full MLS search has its own sign-in. Register there with{" "}
            <b className="text-foreground-950 break-words">{email}</b> and any home you save will show up in
            your account here too.
          </p>
          <button
            type="button"
            onClick={go}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-foreground-950 text-background-50 text-sm font-medium rounded-md hover:bg-foreground-800 transition-colors"
          >
            Continue to MLS search
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  );
}
