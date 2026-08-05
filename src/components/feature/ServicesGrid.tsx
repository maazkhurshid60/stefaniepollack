import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export default function ServicesGrid({
  eyebrow,
  title,
  italicTitle,
  services,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  italicTitle?: string;
  services: { icon: LucideIcon; title: string; description: string }[];
  image: string;
  imageAlt: string;
}) {
  return (
    <section className="w-full bg-accent-100 py-20 md:py-28 lg:py-36">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 md:mb-16"
          >
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary-600 mb-4">
              {eyebrow}
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground-950">
              {title}
              {italicTitle && (
                <>
                  {" "}
                  <span className="italic font-normal">{italicTitle}</span>
                </>
              )}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-2 lg:sticky lg:top-28"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Services list */}
            <div className="lg:col-span-3 divide-y divide-background-300/50">
              {services.map((service, i) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                    className="flex gap-5 md:gap-6 py-7 first:pt-0 last:pb-0"
                  >
                    <div className="w-11 h-11 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-background-50 text-primary-700">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg md:text-xl text-foreground-950">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm text-foreground-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
