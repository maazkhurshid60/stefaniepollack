import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { allTestimonials } from "@/mocks/home";

export default function TestimonialsGrid() {
  return (
    <section id="testimonials" className="w-full bg-background-500 py-20 md:py-28 lg:py-36 scroll-mt-24">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 md:mb-20"
          >
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary-600 mb-5">
              Testimonials
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground-950">
              Real Clients.
              <br />
              <span className="italic font-normal">Real Stories.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {allTestimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="flex flex-col bg-background-50 rounded-2xl border border-background-200/60 p-8"
              >
                <Quote className="w-7 h-7 text-primary-300 mb-5" strokeWidth={1.5} />
                <p className="text-sm text-foreground-700 leading-relaxed flex-grow">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 pt-5 border-t border-background-200">
                  <p className="text-sm font-medium text-foreground-950 tracking-wide">
                    {t.author}
                  </p>
                  <p className="text-xs text-foreground-500 mt-1">{t.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
