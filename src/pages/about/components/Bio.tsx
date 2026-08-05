import { motion } from "framer-motion";

export default function Bio() {
  return (
    <section className="w-full bg-background-50 py-20 md:py-28 lg:py-36">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-7xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative lg:sticky lg:top-28"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <img
                src="/images/stefanie/headshot.jpg"
                alt="Stefanie Pollack, Studio City Realtor"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-primary-300 rounded-lg -z-10 hidden lg:block" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary-600 mb-4">
              Experience. Technology. Passion. Integrity.
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground-950 leading-tight">
              A Studio City Native,
              <br />
              <span className="italic font-normal">Through and Through.</span>
            </h2>

            <div className="mt-8 space-y-5 text-foreground-700 leading-relaxed">
              <p>
                Stefanie Pollack is a Studio City native — born and raised in the
                neighborhood she has spent her career serving. She began her real
                estate journey in mortgage banking before returning to Los Angeles
                to build a business rooted in trust, local expertise, and old-fashioned
                hard work.
              </p>
              <p>
                With Compass — the nation&apos;s largest independent real estate
                brokerage — behind her, Stefanie pairs deep market knowledge with the
                technology and support that let her move quickly and confidently on
                her clients&apos; behalf. Whether she&apos;s walking a first-time buyer
                through the process from pre-approval to closing, or guiding a
                longtime homeowner through a sale, she brings the same tenacious work
                ethic and genuine care to every transaction.
              </p>
              <p>
                Stefanie is both a homeowner and an income-property owner herself,
                which makes her especially empathetic to what her clients are
                navigating in today&apos;s market. She&apos;s in constant
                communication throughout the process and consistently goes beyond the
                standard Realtor playbook to get her clients the outcome they&apos;re
                after.
              </p>
              <p>
                Off the clock, Stefanie is raising her family in Studio City, where
                you&apos;ll find her on the local hiking trails, at a favorite spot
                along Ventura Boulevard, or organizing the next neighborhood event.
                She is committed to earning your trust and giving you the tools to
                make confident, informed decisions — whether you&apos;re just
                starting to think about a move, or ready to make one now.
              </p>
            </div>

            <p className="mt-8 text-sm text-foreground-500 tracking-wide">
              Stefanie Pollack &bull; DRE #01815614
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="/contact"
                className="px-6 py-3 bg-foreground-950 text-background-50 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-foreground-800 transition-colors duration-300 whitespace-nowrap"
              >
                Get in Touch
              </a>
              <a
                href="/listings"
                className="px-6 py-3 border border-foreground-300 text-foreground-800 text-sm font-medium tracking-wide uppercase rounded-md hover:border-foreground-950 hover:text-foreground-950 transition-all duration-300 whitespace-nowrap"
              >
                View Listings
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
