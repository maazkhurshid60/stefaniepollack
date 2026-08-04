import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&h=1080&fit=crop&q=80"
          alt="Luxury home exterior"
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <p className="text-white/70 text-xs md:text-sm font-medium tracking-[0.3em] uppercase mb-6">
            Los Angeles Luxury Real Estate
          </p>
          <h1 className="font-heading-h1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-medium leading-[1.1] tracking-tight">
            Connecting People
            <br />
            <span className="italic font-normal">with Homes</span>
            <br />
            &amp; <span className="italic font-normal">Community</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <a
            href="/schedule-a-meeting"
            className="px-8 py-3.5 bg-white text-foreground-950 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-primary-100 transition-all duration-300 whitespace-nowrap"
          >
            Schedule a Meeting
          </a>
          <a
            href="/listings"
            className="px-8 py-3.5 bg-transparent text-white text-sm font-medium tracking-wide uppercase rounded-md border border-white/40 hover:bg-white/10 hover:border-white transition-all duration-300 whitespace-nowrap"
          >
            View Listings
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-white/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-3 bg-white/70 animate-scroll-line" />
            </div>
          </div>
        </motion.div>

        {/* Compass badge — bottom-right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 right-8 md:bottom-10 md:right-12 flex flex-col items-end gap-1.5"
        >
          <span className="text-white/40 text-[10px] tracking-[0.25em] uppercase font-medium">
            Brokered by
          </span>
          <img
            src="https://storage.helloreaddy.io/project_files/ea13b1fb-fd83-432d-a9dd-911da517d8bf/008bc2c8-2bbc-4b60-b87a-02ae6b21a208_compressed_Compass-Logo.webp"
            alt="Compass Real Estate"
            className="h-6 md:h-8 w-auto opacity-60 hover:opacity-100 transition-opacity duration-500 cursor-pointer"
          />
        </motion.div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l border-t border-white/20 hidden lg:block" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r border-t border-white/20 hidden lg:block" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l border-b border-white/20 hidden lg:block" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r border-b border-white/20 hidden lg:block" />
    </section>
  );
}