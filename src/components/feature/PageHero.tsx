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
  return (
    <section className="relative w-full h-[85vh] min-h-[560px] max-h-[900px] overflow-hidden">
      <div className="absolute inset-0 bg-foreground-950">
        {/* Blurred, scaled-up copy of the same photo fills the whole band.
            The sharp copy below is object-contain so the photo is always
            shown in full (never cropping the subject) — but these are 3:2
            photos in a band that's ~2.4:1 on a wide screen, so contain
            always leaves side gaps. Filling them with a blurred blow-up of
            the same image reads as a soft continuation instead of the flat
            black bars that were there before. scale-125 keeps the blur's
            soft edge outside the frame. */}
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl"
        />
        <img src={image} alt={imageAlt} className="relative w-full h-full object-contain" />
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
