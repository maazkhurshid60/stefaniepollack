import { motion } from "framer-motion";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import PageHero from "@/components/feature/PageHero";
import CalendlyInline from "@/components/feature/CalendlyInline";
import { useLead } from "@/hooks/useLead";

const CALENDLY_URL = "https://calendly.com/stefaniepollack";

/* Drawn from Stefanie's own Calendly description rather than invented, so the
   page and the booking widget below it can't drift apart. */
const expectations = [
  {
    icon: Clock,
    title: "Thirty Minutes",
    description:
      "Long enough to cover what matters, short enough to fit into a working day.",
  },
  {
    icon: MapPin,
    title: "Wherever Suits You",
    description:
      "A phone call, a Zoom, at your home, or at the office — you choose when you book.",
  },
  {
    icon: MessageCircle,
    title: "No Obligation",
    description:
      "Market conditions, a price on your home, or just a first conversation. Whatever you need.",
  },
];

export default function Schedule() {
  // Signed in already? Then we know their email — no reason to ask twice.
  const { email } = useLead();

  return (
    <div className="w-full">
      <PageHero
        eyebrow="Schedule"
        title="Let's Talk About"
        italicTitle="Your Move"
        subtitle="Pick a time that works for you and it lands straight on Stefanie's calendar."
        image="/images/stefanie/schedule-hero.jpg"
        imageAlt="Stefanie Pollack in a Studio City kitchen"
      />

      <section className="w-full bg-background-50 py-20 md:py-24">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {expectations.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <span className="w-11 h-11 flex items-center justify-center rounded-full bg-primary-100/70 text-primary-700">
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-heading text-xl text-foreground-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-foreground-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="book" className="w-full bg-accent-100 py-20 md:py-28 lg:py-32">
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
                Choose Your
                <br />
                <span className="italic font-normal">Day And Time.</span>
              </h2>
            </motion.div>

            {/* Heights are measured, not guessed — see CalendlyInline. Calendly
                reflows on its own breakpoints and gets TALLER as it narrows:
                its booking step needs 796px at 1000px+ wide, 1090px between 640
                and 999, and 953px below. These three steps track the width this
                container actually resolves to, with a little slack. */}
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
