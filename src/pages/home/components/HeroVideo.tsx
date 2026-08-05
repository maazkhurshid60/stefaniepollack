import { useEffect, useRef, useState } from "react";

/**
 * Hero background video. Desktop fades the video in once it can play;
 * mobile, reduced-motion, and data-saver connections never download it —
 * they just see the poster frame. Ported from the same pattern used on
 * my-app/app/components/home/HeroVideo.tsx.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } })
      .connection;
    const slow = conn?.saveData || /2g/.test(conn?.effectiveType ?? "");

    if (!mq.matches || reducedMotion || slow) {
      setReady(true);
      return;
    }
    setSrc("/video/hero.mp4");
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!src || !v) return;
    const reveal = () => {
      setReady(true);
      v.play().catch(() => {});
    };
    if (v.readyState >= 3) {
      reveal();
      return;
    }
    v.addEventListener("canplay", reveal, { once: true });
    // preload="none" means inserting a <source> child alone never starts a
    // fetch — nothing loads and "canplay" never fires without an explicit
    // load() to kick it off.
    v.load();
    return () => v.removeEventListener("canplay", reveal);
  }, [src]);

  return (
    <>
      <img
        src="/images/hero-poster.jpg"
        alt="Stefanie Pollack — Studio City real estate"
        className={`w-full h-full object-cover scale-105 animate-slow-zoom transition-opacity duration-1000 ${
          ready && src ? "opacity-0" : "opacity-100"
        }`}
      />
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          ready && src ? "opacity-100" : "opacity-0"
        }`}
      >
        {src && <source src={src} type="video/mp4" />}
      </video>
    </>
  );
}
