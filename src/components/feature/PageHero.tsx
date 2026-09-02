import { motion } from "framer-motion";

export default function PageHero({
  eyebrow,
  title,
  italicTitle,
  subtitle,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  italicTitle?: string;
  subtitle?: string;
  image: string;
  imageAlt: string;
}) {
  /* The band is shaped to the photos themselves (all 1800x1200, i.e. 3:2)
     rather than to a slice of viewport height. A fixed-height band is always
     some other ratio than the photo, and object-contain then has to leave
     the difference empty — which is where the side bars came from. Matching
     the ratio means the photo fills the full width, edge to edge, with
     nothing cropped off it.

     min-h keeps a usable band on narrow phones (where 3:2 would only be
     ~260px tall, too short for the heading); max-h stops it running away on
     ultrawide monitors. In both of those the ratio no longer matches
     exactly, which is what the blurred layer below is for. */
  return (
    <section className="relative w-full aspect-[3/2] min-h-[520px] max-h-[1750px] overflow-hidden">
      <div className="absolute inset-0 bg-foreground-950">
        {/* Blurred, scaled-up copy of the same photo, as a backstop for the
            min-h/max-h cases above (and sub-pixel rounding): any sliver the
            sharp copy doesn't cover reads as a soft continuation of the
            image rather than a hard black edge. scale-125 keeps the blur's
            own soft edge outside the frame. */}
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl"
        />
        {/* Phones are the one place the band can't match the photo: min-h holds
            it at 520px while a 3:2 photo would only be ~260px tall there, so
            object-contain would leave half the band blurred backdrop. Fill it
            by cropping instead — the crop is horizontal (the photo scales to
            the band's height and overflows its width), so nothing is lost from
            the top or bottom of the frame. Desktop keeps the whole photo. */}
        <img
          src={image}
          alt={imageAlt}
          className="relative w-full h-full object-cover md:object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/55" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-white/70 text-xs md:text-sm font-medium tracking-[0.3em] uppercase mb-5">
            {eyebrow}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-medium leading-tight">
            {title}
            {italicTitle && (
              <>
                {" "}
                <span className="italic font-normal">{italicTitle}</span>
              </>
            )}
          </h1>
          {subtitle && (
            <p className="mt-5 text-white/75 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
