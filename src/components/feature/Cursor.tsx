import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Trailing custom cursor: a small dot glued to the pointer, and a lagging
 * glow behind it carrying the roofline mark. Fine-pointer devices only, off
 * under reduced-motion — see the gating query in index.css. Re-runs on route
 * change so newly mounted links/buttons still trigger the hover state.
 */
export default function Cursor() {
  const location = useLocation();

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    const glow = document.querySelector<HTMLElement>(".cursor-glow");
    if (!dot || !glow) return;

    let mouseX = -100;
    let mouseY = -100;
    let glowX = -100;
    let glowY = -100;
    let raf = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.body.classList.add("has-cursor");
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const trail = () => {
      glowX += (mouseX - glowX) * 0.16;
      glowY += (mouseY - glowY) * 0.16;
      glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(trail);
    };
    raf = requestAnimationFrame(trail);

    const onMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const interactive = el.closest("a, button, input, label, [data-cursor]");
      glow.classList.toggle("is-hover", !!interactive);
    };
    document.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(raf);
    };
  }, [location.pathname]);

  return (
    <>
      <div className="cursor-dot" aria-hidden="true"></div>
      <div className="cursor-glow" aria-hidden="true">
        <img className="cursor-mark" src="/images/cursor-mark.svg" alt="" />
      </div>
    </>
  );
}
