import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import PageHero from "@/components/feature/PageHero";
import ContactInfo from "./components/ContactInfo";
import ContactForm from "./components/ContactForm";

export default function Contact() {
  return (
    <div className="w-full">
      <PageHero
        eyebrow="Contact"
        title="Let's Find Your"
        italicTitle="Next Chapter"
        image="/images/stefanie/lifestyle-6.jpg"
        imageAlt="Contact Stefanie Pollack"
      />

      <section className="w-full bg-background-50 py-20 md:py-28 lg:py-36">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto items-start">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>

      {/* The booking calendar itself lives on /schedule, which has the room for
          it. Running the same third-party embed on two adjacent pages would
          mean two copies to keep in step and a second heavy iframe to load, so
          this hands people over instead. */}
      <section className="w-full bg-accent-100 py-16 md:py-20">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-primary-100/70 text-primary-700">
              <CalendarCheck className="w-5 h-5" strokeWidth={1.5} />
            </span>
            <h2 className="mt-6 font-heading text-3xl md:text-4xl text-foreground-950 leading-tight">
              Prefer To Talk?
              <br />
              <span className="italic font-normal">Pick A Time That Works.</span>
            </h2>
            <p className="mt-5 text-foreground-600 leading-relaxed">
              Book a thirty-minute call, Zoom, or in-person meeting and it goes
              straight onto Stefanie&apos;s calendar — no back-and-forth to
              arrange it.
            </p>
            <a
              href="/schedule"
              className="mt-8 inline-block px-8 py-3.5 bg-foreground-950 text-white text-sm font-medium tracking-wide uppercase rounded-md hover:bg-foreground-800 transition-all duration-300"
            >
              See Available Times
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
