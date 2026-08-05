import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Youtube, type LucideIcon } from "lucide-react";

const details: { icon: LucideIcon; label: string; value: string; href: string }[] = [
  { icon: Phone, label: "Call or Text", value: "(818) 625-6171", href: "tel:+18186256171" },
  { icon: Mail, label: "Email", value: "stefanie.pollack@compass.com", href: "mailto:stefanie.pollack@compass.com" },
  { icon: MapPin, label: "Serving", value: "Studio City, CA 91604", href: "#" },
];

const socials: { icon: LucideIcon; label: string; url: string }[] = [
  { icon: Instagram, label: "@stefanieismyrealtor", url: "https://www.instagram.com/stefanieismyrealtor/" },
  { icon: Youtube, label: "YouTube Channel", url: "https://www.youtube.com/channel/UC8QpQcHqoM_Lh3eLQXURNJA" },
];

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7 }}
    >
      <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary-600 mb-4">
        Get In Touch
      </p>
      <h2 className="font-heading text-3xl md:text-4xl text-foreground-950 leading-tight">
        Let&apos;s Start
        <br />
        <span className="italic font-normal">The Conversation.</span>
      </h2>
      <p className="mt-5 text-foreground-600 leading-relaxed max-w-md">
        Whether you&apos;re just starting to think about a move or ready to make
        one now, reach out any time. I&apos;ll go at your pace.
      </p>

      <ul className="mt-10 space-y-5">
        {details.map((d) => {
          const Icon = d.icon;
          return (
            <li key={d.label}>
              <a href={d.href} className="flex items-center gap-4 group">
                <span className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full bg-primary-100/70 text-primary-700">
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block text-[11px] font-medium tracking-[0.15em] uppercase text-foreground-500">
                    {d.label}
                  </span>
                  <span className="block text-sm text-foreground-950 group-hover:text-primary-700 transition-colors">
                    {d.value}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 pt-8 border-t border-background-200 flex items-center gap-3">
        {socials.map((s) => {
          const Icon = s.icon;
          return (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-background-300 text-foreground-600 hover:border-primary-400 hover:text-primary-700 transition-all duration-300"
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
            </a>
          );
        })}
      </div>
    </motion.div>
  );
}
