import { motion } from "framer-motion";

export default function Intro() {
  return (
    <section className="w-full bg-background-50 py-20 md:py-24">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary-600 mb-4">
            Local Knowledge
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground-950">
            Every Neighborhood,
            <br />
            <span className="italic font-normal">Every Detail.</span>
          </h2>
          <p className="mt-6 text-foreground-600 leading-relaxed">
            Growing up — and now raising a family — in Studio City, Stefanie has a
            deep appreciation for what each neighborhood in the San Fernando Valley
            has to offer. Whether a home is in the hills or the flats, she uses her
            local knowledge and negotiation experience to help buyers and sellers
            understand the real advantages of each area.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
