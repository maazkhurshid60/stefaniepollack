import { motion } from "framer-motion";

export default function Intro() {
  return (
    <section className="w-full bg-background-50 py-20 md:py-28 lg:py-36">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <img
                src="/images/stefanie/lifestyle-4.jpg"
                alt="Stefanie Pollack with buyer clients"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-full h-full border border-primary-300 rounded-lg -z-10 hidden lg:block" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="order-1 lg:order-2"
          >
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary-600 mb-4">
              For Buyers
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground-950 leading-tight">
              Wondering Where
              <br />
              <span className="italic font-normal">You&apos;ll Land Next?</span>
            </h2>
            <div className="mt-8 space-y-4 text-foreground-700 leading-relaxed">
              <p>
                You&apos;re on the hunt for the right home, and looking for an agent
                to help make it happen. Your standards are high — but your time and
                energy are anything but unlimited. Between running a household, a
                job, and everything else on your plate, you need someone doing the
                heavy lifting on your behalf.
              </p>
              <p>
                You&apos;ve saved your favorite listings and you&apos;re ready to
                kick the search into high gear. Now all you need is an expert
                Realtor to guide you through the process step by step, from
                pre-approval to closing — someone thorough and knowledgeable enough
                to help you avoid unpleasant surprises after you move in.
              </p>
              <p>
                When you&apos;re making a decision this big, the Realtor you choose
                should be ready to go to work for your family.
              </p>
            </div>
            <div className="mt-10">
              <a
                href="/contact"
                className="inline-flex px-6 py-3 bg-foreground-950 text-background-50 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-foreground-800 transition-colors duration-300 whitespace-nowrap"
              >
                Start Your Search
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
