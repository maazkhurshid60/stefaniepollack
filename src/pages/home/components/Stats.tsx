import { motion } from "framer-motion";
import { stats } from "@/mocks/home";

export default function Stats() {
  return (
    <section className="w-full bg-accent-100 py-16 md:py-20">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-foreground-950">
              Moving Los Angeles —{" "}
              <span className="italic font-normal">one home at a time.</span>
            </h2>
            <p className="mt-3 text-sm text-foreground-600">
              Guiding families through every step of their real estate journey.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl lg:text-6xl font-heading text-foreground-950 leading-none">
                  {stat.value}
                </p>
                <p className="mt-3 text-xs md:text-sm text-foreground-600 tracking-wide uppercase">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}