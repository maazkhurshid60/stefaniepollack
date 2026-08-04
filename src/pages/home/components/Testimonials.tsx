import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "@/mocks/home";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full bg-background-500 py-20 md:py-28 lg:py-36">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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

          {/* Quote */}
          <div className="mt-20 md:mt-24 relative min-h-[300px] md:min-h-[240px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <Quote className="w-10 h-10 md:w-12 md:h-12 text-primary-300 mb-8 md:mb-10" strokeWidth={1.5} />
                <blockquote className="text-lg md:text-xl lg:text-2xl text-foreground-800 leading-relaxed font-light max-w-3xl">
                  &ldquo;{testimonials[activeIndex].quote}&rdquo;
                </blockquote>
                <div className="mt-10 md:mt-12">
                  <p className="text-sm font-medium text-foreground-950 tracking-wide uppercase">
                    {testimonials[activeIndex].author}
                  </p>
                  <p className="text-xs text-foreground-500 mt-2">
                    {testimonials[activeIndex].location}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-3 mt-12 md:mt-16">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "bg-foreground-950 w-8"
                    : "w-2 bg-foreground-400 hover:bg-foreground-600"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}