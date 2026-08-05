import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Intro() {
  return (
    <section className="w-full bg-background-50 py-20 md:py-28 lg:py-36">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary-600 mb-4">
              For Sellers
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground-950 leading-tight">
              Ready For
              <br />
              <span className="italic font-normal">Closing Day?</span>
            </h2>
            <div className="mt-8 space-y-4 text-foreground-700 leading-relaxed">
              <p>
                You don&apos;t have the time or energy to add &ldquo;get the home
                ready to sell&rdquo; to your already full plate. What you&apos;d
                love is to fast-forward straight to closing day. My team and I
                know the key to getting multiple strong offers, fast: on-point
                pricing, standout staging, savvy digital marketing, and stellar
                negotiation.
              </p>
              <p>
                I&apos;m obsessed with over-delivering for my clients — working
                hard to bring the right buyers to the table and vetting every
                offer carefully, while helping you avoid unpleasant surprises
                once you&apos;re in escrow.
              </p>
              <p>
                When you&apos;re making a decision this big, you deserve a
                Realtor who&apos;s ready to go to work for your family.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="https://get.homebot.ai/?id=a4aeb5dc-a3b8-4fb8-8003-7d0485c61c9e"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground-950 text-background-50 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-foreground-800 transition-colors duration-300 whitespace-nowrap"
              >
                Get Your Free Home Value
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <img
                src="/images/stefanie/portrait-3.jpg"
                alt="Stefanie Pollack, Studio City listing agent"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-primary-300 rounded-lg -z-10 hidden lg:block" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
