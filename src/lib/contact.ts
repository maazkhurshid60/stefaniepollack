/**
 * Stefanie's public contact details — the single source of truth for anything
 * the site shows a visitor.
 *
 * These were three separate hardcoded literals (the contact page, the footer,
 * and public/idx-wrapper.html), and they had already drifted: the footer and the
 * IDX wrapper said stefanie@pollackhomes.com while the contact page still said
 * stefanie.pollack@compass.com, so the same site offered two different addresses
 * depending on which page you landed on. That is the bug this file exists to
 * stop repeating.
 *
 * public/idx-wrapper.html is static HTML served outside the bundle, so it cannot
 * import this and still carries its own copy. If EMAIL changes, change it there
 * too — it is the one place that will not follow automatically.
 */

/**
 * Lowercased deliberately. Slack supplied it as "Stefanie@stefaniepollack.com";
 * the domain half is case-insensitive per RFC 1035, the local half is
 * case-insensitive at every mainstream provider, and every other address on
 * this site is written lowercase. Delivery is identical either way.
 */
export const EMAIL = "stefanie@stefaniepollack.com";

export const PHONE_DISPLAY = "(818) 625-6171";
export const PHONE_HREF = "tel:+18186256171";

export const LOCATION = "Studio City, CA 91604";

/** `mailto:` for EMAIL, so no caller has to rebuild the string. */
export const EMAIL_HREF = `mailto:${EMAIL}`;
