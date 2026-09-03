import { useEffect, useRef } from "react";

/* Calendly publishes this embed as a <div> plus a <script>. That pair can't go
   straight into JSX for two reasons:

   1. React does not execute a <script> tag it renders, so the script would
      never run at all.
   2. Even loaded by hand, widget.js only auto-scans the page for
      .calendly-inline-widget elements once, when it loads. This is a
      client-routed SPA — by the time someone navigates to /contact a second
      time the script is already loaded and cached, so no scan happens and the
      widget area comes up blank.

   Loading the script ourselves and then calling initInlineWidget on our own
   element is what makes the embed survive client-side navigation. */

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: { name?: string; email?: string };
      }) => void;
    };
  }
}

/* Prefill arrives as separate strings rather than an object: an object literal
   is a new reference on every render, which would re-run the effect and
   rebuild the iframe endlessly. */
export default function CalendlyInline({
  url,
  prefillName,
  prefillEmail,
  className = "",
}: {
  url: string;
  prefillName?: string;
  prefillEmail?: string;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const mount = () => {
      if (cancelled || !window.Calendly || !host.current) return;
      /* Clear before mounting. StrictMode runs effects twice in development,
         and a revisit can land on an element Calendly has already filled —
         without this, each pass appends another iframe. */
      host.current.innerHTML = "";
      window.Calendly.initInlineWidget({
        url,
        parentElement: host.current,
        ...(prefillName || prefillEmail
          ? { prefill: { name: prefillName, email: prefillEmail } }
          : {}),
      });
    };

    if (window.Calendly) {
      mount();
      return () => {
        cancelled = true;
      };
    }

    // One <script> for the whole app, however many widgets end up asking for it.
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
    const pending = script;
    pending.addEventListener("load", mount);
    return () => {
      cancelled = true;
      pending.removeEventListener("load", mount);
    };
  }, [url, prefillName, prefillEmail]);

  /* Calendly sizes its iframe to 100% of this element, so the height has to
     come from here. The booking UI stacks on narrow screens and sits side by
     side on wide ones, hence the three steps — a single fixed height either
     wastes a screenful on desktop or forces a scrollbar inside the iframe on a
     phone, which is the worst of the options. */
  return <div ref={host} className={`w-full min-w-[320px] ${className}`} />;
}
