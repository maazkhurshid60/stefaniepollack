/** MLS photos are served from api.cotality.com (via IDX Broker), which is
 *  behind Incapsula and appears to only authorize requests referred from
 *  IDX Broker's own hosted pages — hotlinking from this site can 403. Swap
 *  failed photos to this local placeholder instead of a broken image icon. */
export const PHOTO_FALLBACK = "/images/photo-unavailable.svg";
