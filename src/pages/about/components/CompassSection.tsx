import { motion } from "framer-motion";

export default function CompassSection() {
  return (
    <section className="w-full bg-accent-100 py-20 md:py-28">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary-600 mb-4">
            Backed By Compass
          </p>
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-foreground-950">
            The #1 Independent
            <br />
            <span className="italic font-normal">Real Estate Brokerage</span>
          </h2>
          <p className="mt-6 text-foreground-600 leading-relaxed">
            Compass is the #1 real estate brokerage in the country, represented in 67
            markets across the U.S. by more than 25,000 agents. It pairs the
            industry&apos;s top talent with technology built to make the search and
            sell experience intelligent and seamless — giving Stefanie&apos;s clients
            an edge at every step of the process.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
