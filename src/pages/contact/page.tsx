import { motion } from "framer-motion";
import PageHero from "@/components/feature/PageHero";
import CalendlyInline from "@/components/feature/CalendlyInline";
import { useLead } from "@/hooks/useLead";
import ContactInfo from "./components/ContactInfo";
import ContactForm from "./components/ContactForm";

const CALENDLY_URL = "https://calendly.com/stefaniepollack";

export default function Contact() {
  /* Every "Schedule a Meeting" button on the site already points here, so the
     booking calendar belongs on this page. Someone signed in has told us their
     email once already — passing it through means they don't type it again. */
  const { email } = useLead();

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

      <section id="schedule" className="w-full bg-accent-100 py-20 md:py-28 lg:py-32">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary-600 mb-4">
                Book A Time
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground-950 leading-tight">
                Prefer To Talk?
                <br />
                <span className="italic font-normal">Pick A Time That Works.</span>
              </h2>
              <p className="mt-5 text-foreground-600 leading-relaxed max-w-xl mx-auto">
                Choose a slot that suits you and it goes straight onto
                Stefanie&apos;s calendar — no back-and-forth to arrange it.
              </p>
            </motion.div>

            {/* Heights are measured, not guessed. Calendly re-flows on its own
                internal breakpoints and gets TALLER as it gets narrower: its
                booking step needs 796px at 1000px+ wide, 1090px between 640 and
                999, and 953px below that. These three steps track the width
                this container actually resolves to (max-w-5xl minus the page
                padding), with a little slack. Undershooting doesn't clip — it
                puts a scrollbar inside the iframe, which is worse than the
                spare background an overshoot leaves. */}
            <CalendlyInline
              url={CALENDLY_URL}
              prefillEmail={email ?? undefined}
              className="mt-12 h-[1000px] min-[640px]:h-[1120px] min-[1152px]:h-[820px]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
