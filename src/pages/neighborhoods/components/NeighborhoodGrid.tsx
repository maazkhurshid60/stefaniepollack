import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { neighborhoods } from "@/mocks/home";

export default function NeighborhoodGrid() {
  return (
    <section className="w-full bg-background-50 pb-20 md:pb-28 lg:pb-36">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {neighborhoods.map((n, i) => (
            <motion.a
              key={n.id}
              href="/listings"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.12 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl block"
            >
              <img
                src={n.image}
                alt={n.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <h3 className="font-heading text-2xl md:text-3xl text-white">{n.name}</h3>
                <p className="mt-1 text-sm text-white/80">{n.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase text-white/90 group-hover:text-white transition-colors">
                  Explore Listings
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.5} />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
