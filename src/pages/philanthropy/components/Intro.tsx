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
            Giving Back
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground-950">
            Community,
            <br />
            <span className="italic font-normal">Not Just Clients.</span>
          </h2>
          <p className="mt-6 text-foreground-600 leading-relaxed">
            My greatest joy is being of purpose to those in need — whether that
            means helping a family find their next home, or rolling up my sleeves
            for our community. Giving back to local causes and strengthening the
            neighborhoods where we live is important to me. Take a look at some of
            the community drives and events from over the years, and stay
            connected for the ones still to come.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
