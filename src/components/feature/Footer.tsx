import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  type LucideIcon,
} from "lucide-react";

const footerLinks = {
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Listings", href: "/listings" },
    { label: "Buyers", href: "/buyers" },
    { label: "Sellers", href: "/sellers" },
    { label: "Resources", href: "/resources" },
    { label: "Contact", href: "/contact" },
  ],
  explore: [
    { label: "Market Updates", href: "/resources" },
    { label: "Neighborhood Guides", href: "/resources" },
    { label: "Home Valuation", href: "/sellers" },
    { label: "Sold Properties", href: "/listings" },
  ],
  contact: [
    { Icon: Mail as LucideIcon, label: "stefanie@pollackhomes.com", href: "mailto:stefanie@pollackhomes.com" },
    { Icon: Phone as LucideIcon, label: "(818) 625-6171", href: "tel:+18186256171" },
    { Icon: MapPin as LucideIcon, label: "Studio City, CA 91604", href: "#" },
  ],
  socials: [
    { Icon: Instagram as LucideIcon, label: "Instagram", url: "https://www.instagram.com/stefanieismyrealtor/" },
    { Icon: Facebook as LucideIcon, label: "Facebook", url: "https://www.facebook.com/StefIsMyRealtor/" },
    { Icon: Linkedin as LucideIcon, label: "LinkedIn", url: "https://www.linkedin.com/in/stefaniedanhi/" },
    { Icon: Youtube as LucideIcon, label: "YouTube", url: "https://www.youtube.com/channel/UC8QpQcHqoM_Lh3eLQXURNJA" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Accessibility", href: "#" },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Footer() {
  return (
    <footer className="bg-background-50 px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
      <div className="bg-foreground-900 text-background-100 rounded-[24px] md:rounded-[32px] overflow-hidden">
        {/* Main Footer */}
        <motion.div
          className="w-full px-6 md:px-10 lg:px-16 pt-16 md:pt-20 pb-12 md:pb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6">
            {/* Logo + Tagline + Social */}
            <motion.div className="lg:col-span-4 lg:pr-8" variants={itemVariants}>
              <a href="/" className="inline-block">
                <img
                  src="https://images.squarespace-cdn.com/content/v1/62857f9467398e0fd622fe08/1765408611435-CQO5009VHL14BILFBT6P/Stefanie+Pollack_2025+Website+updates_Logo_Black.png?format=500w"
                  alt="Pollack Homes"
                  className="h-11 md:h-12 w-auto brightness-0 invert"
                />
              </a>
              <p className="mt-5 text-[15px] text-background-500 leading-relaxed max-w-xs">
                Connecting people with homes and community. Over 20 years of
                experience in Studio City and the San Fernando Valley.
              </p>
              <div className="flex items-center gap-2.5 mt-6">
                {footerLinks.socials.map((social) => {
                  const SocialIcon = social.Icon;
                  return (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-background-500/25 text-background-300 hover:border-primary-300 hover:text-primary-200 hover:bg-background-100/10 transition-all duration-300"
                      aria-label={social.label}
                    >
                      <SocialIcon className="w-4 h-4" strokeWidth={1.5} />
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* Divider on desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="h-full w-px bg-background-500/15 mx-auto" />
            </div>

            {/* Navigation */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              <h4 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-primary-300 mb-5">
                Navigation
              </h4>
              <ul className="space-y-3">
                {footerLinks.navigation.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[15px] text-background-200 hover:text-primary-200 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Explore */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              <h4 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-primary-300 mb-5">
                Explore
              </h4>
              <ul className="space-y-3">
                {footerLinks.explore.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[15px] text-background-200 hover:text-primary-200 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div className="lg:col-span-3" variants={itemVariants}>
              <h4 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-primary-300 mb-5">
                Contact
              </h4>
              <ul className="space-y-3.5">
                {footerLinks.contact.map((link) => {
                  const ContactIcon = link.Icon;
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="flex items-start gap-3 text-[15px] text-background-200 hover:text-primary-200 transition-colors duration-200 group"
                      >
                        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-1 text-primary-300 group-hover:text-primary-200 transition-colors duration-200">
                          <ContactIcon className="w-4 h-4" strokeWidth={1.5} />
                        </span>
                        <span>{link.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Licensing Band */}
        <div className="border-t border-background-500/15">
          <div className="w-full px-6 md:px-10 lg:px-16 py-8 md:py-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Licensing Left */}
              <div className="flex-shrink-0 lg:max-w-xs">
                <h4 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-primary-300 mb-4">
                  Licensing
                </h4>
                <img
                  src="https://storage.helloreaddy.io/project_files/ea13b1fb-fd83-432d-a9dd-911da517d8bf/008bc2c8-2bbc-4b60-b87a-02ae6b21a208_compressed_Compass-Logo.webp"
                  alt="Compass Real Estate"
                  className="h-5 md:h-6 w-auto brightness-0 invert opacity-90 mb-4"
                />
                <div className="space-y-1.5">
                  <p className="text-xs text-background-500">
                    Stefanie Pollack | CA DRE #01815614
                  </p>
                  <p className="text-xs text-background-500">
                    Compass California, Inc. | CA DRE #01991628
                  </p>
                </div>
              </div>

              {/* Vertical divider on desktop */}
              <div className="hidden lg:block w-px bg-background-500/15 flex-shrink-0" />

              {/* Legal Disclaimer */}
              <div className="flex-1">
                <p className="text-xs text-background-600 leading-relaxed">
                  Compass is a real estate broker licensed by the State of California and abides by
                  Equal Housing Opportunity laws. All material presented herein is intended for
                  informational purposes only. Information is compiled from sources deemed reliable but
                  is subject to errors, omissions, changes in price, condition, sale, or withdrawal
                  without notice. No statement is made as to accuracy of any description. All
                  measurements and square footages are approximate. This is not intended to solicit
                  property already listed. Nothing herein shall be construed as legal, accounting, or
                  other professional advice outside the realm of real estate brokerage.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background-500/15">
          <div className="w-full px-6 md:px-10 lg:px-16 py-5 md:py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-background-600 text-center sm:text-left">
                &copy; {new Date().getFullYear()} Stefanie Pollack Real Estate. All rights reserved.
              </p>
              <div className="flex items-center gap-5">
                {footerLinks.legal.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-xs text-background-600 hover:text-background-200 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}