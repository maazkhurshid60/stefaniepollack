import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="relative w-full py-28 md:py-36 lg:py-44 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=800&fit=crop&q=80"
          alt="Luxury home interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground-950/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-white/60 text-xs font-medium tracking-[0.3em] uppercase mb-6">
            Your Journey Begins Here
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white leading-tight">
            Your New Home
            <br />
            <span className="italic font-normal">Awaits</span>
          </h2>
          <p className="mt-6 text-white/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Let Stefanie guide you through every step of finding or selling your
            perfect property in the San Fernando Valley.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="px-8 py-3.5 bg-white text-foreground-950 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-primary-100 transition-all duration-300 whitespace-nowrap"
            >
              Schedule a Meeting
            </a>
            <a
              href="/contact"
              className="px-8 py-3.5 bg-transparent text-white text-sm font-medium tracking-wide uppercase rounded-md border border-white/40 hover:bg-white/10 transition-all duration-300 whitespace-nowrap"
            >
              Get in Touch
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}