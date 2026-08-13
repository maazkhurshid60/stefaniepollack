import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <section className="w-full bg-background-50 py-20 md:py-28 lg:py-36">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <img
                src="https://images.squarespace-cdn.com/content/v1/62857f9467398e0fd622fe08/2fbd0c54-a64e-441c-854d-7fb5bdd2036e/081_09.2821_Stefanie-Pollack_Nicole-Goddard-Photography_423A3937+EDITED.jpg?format=800w"
                alt="Stefanie Pollack - Studio City Real Estate Agent"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative frame */}
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
              About Stefanie
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground-950 leading-tight">
              Distinctive Properties.
              <br />
              <span className="italic font-normal">Real Results.</span>
            </h2>
            <div className="mt-8 space-y-4 text-foreground-700 leading-relaxed">
              <p>
                With over 20 years of experience in the San Fernando Valley, Stefanie Pollack
                has built a reputation as one of Studio City&apos;s most trusted real estate
                advisors. Her data-driven expertise, combined with genuine community connections,
                creates a seamless and personalized experience for every client.
              </p>
              <p>
                Whether you are buying your first home, selling a cherished property, or
                investing in luxury real estate, Stefanie&apos;s deep market knowledge and
                unwavering dedication ensure you achieve your goals with confidence.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href="/about"
                className="px-6 py-3 bg-foreground-950 text-background-50 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-foreground-800 transition-colors duration-300 whitespace-nowrap"
              >
                Learn More
              </a>
              <a
                href="/about#testimonials"
                className="text-sm font-medium text-foreground-800 hover:text-primary-600 transition-colors duration-300 flex items-center gap-2 whitespace-nowrap"
              >
                Read Client Stories
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>

            {/* Credentials */}
            <div className="mt-12 pt-8 border-t border-background-300/50 grid grid-cols-3 gap-6">
              <div>
                <p className="text-2xl md:text-3xl font-heading text-foreground-950">20+</p>
                <p className="text-xs text-foreground-500 mt-1">Years Experience</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-heading text-foreground-950">$500M+</p>
                <p className="text-xs text-foreground-500 mt-1">In Sales</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-heading text-foreground-950">800+</p>
                <p className="text-xs text-foreground-500 mt-1">Families Helped</p>
              </div>
            </div>

            {/* Awards & recognition */}
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <img
                src="/images/awards/realtrends-verified.png"
                alt="RealTrends Verified"
                className="h-8 w-auto"
              />
              <img
                src="/images/awards/la-magazine-all-stars.png"
                alt="Los Angeles Magazine Real Estate All-Stars"
                className="h-12 w-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}