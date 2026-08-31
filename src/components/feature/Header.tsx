import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Listings", href: "/listings" },
  { label: "Blog", href: "/blog" },
  { label: "Testimonials", href: "/about#testimonials" },
  { label: "Buyers", href: "/buyers" },
  { label: "Sellers", href: "/sellers" },
  { label: "Resources", href: "/resources" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, requireAuth, signOut } = useAuth();
  const { pathname } = useLocation();
  // Inner pages have no dark hero behind the header — keep it solid & legible
  // from the moment they load, not just after scrolling past 60px.
  const solid = scrolled || pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          solid
            ? "bg-background-50/95 backdrop-blur-md border-b border-background-200/50"
            : "bg-transparent"
        }`}
      >
        <div className="w-full px-6 md:px-10 lg:px-16">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <a href="/" className="flex-shrink-0">
              <img
                src="https://storage.helloreaddy.io/project_files/ea13b1fb-fd83-432d-a9dd-911da517d8bf/e98c7909-df05-4785-9269-6c3c1bf310c3_compressed_Pollack-logo.webp"
                alt="Pollack Homes"
                className={`h-10 md:h-12 w-auto transition-all duration-500 ${
                  solid ? "brightness-0" : ""
                }`}
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative text-sm font-medium tracking-wide uppercase transition-colors duration-300 group whitespace-nowrap ${
                    solid
                      ? "text-foreground-800 hover:text-foreground-950"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300 ${
                      solid ? "bg-foreground-950" : "bg-white"
                    }`}
                  />
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-5">
              {user ? (
                <div className="flex items-center gap-4">
                  <a
                    href="/account"
                    className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 whitespace-nowrap ${
                      solid ? "text-foreground-700 hover:text-foreground-950" : "text-white/80 hover:text-white"
                    }`}
                  >
                    My Account
                  </a>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 whitespace-nowrap ${
                      solid ? "text-foreground-700 hover:text-foreground-950" : "text-white/80 hover:text-white"
                    }`}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => requireAuth()}
                  className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 whitespace-nowrap ${
                    solid ? "text-foreground-700 hover:text-foreground-950" : "text-white/80 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
              )}
              <a
                href="/contact"
                className={`px-5 py-2.5 text-sm font-medium tracking-wide uppercase rounded-md transition-all duration-300 whitespace-nowrap ${
                  solid
                    ? "bg-foreground-950 text-background-50 hover:bg-foreground-800"
                    : "bg-white/10 text-white border border-white/30 hover:bg-white hover:text-foreground-950 backdrop-blur-sm"
                }`}
              >
                Contact
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 transition-colors ${
                solid ? "text-foreground-950" : "text-white"
              }`}
              aria-label="Toggle menu"
            >
              <span
                className={`block h-px w-6 transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-[3.5px]" : ""
                } ${solid ? "bg-foreground-950" : "bg-white"}`}
              />
              <span
                className={`block h-px w-6 transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                } ${solid ? "bg-foreground-950" : "bg-white"}`}
              />
              <span
                className={`block h-px w-6 transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
                } ${solid ? "bg-foreground-950" : "bg-white"}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background-50"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl md:text-3xl font-heading font-medium text-foreground-950 hover:text-primary-600 transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              {user ? (
                <motion.a
                  href="/account"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.08, duration: 0.4 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-medium text-foreground-700 hover:text-primary-600 transition-colors"
                >
                  My Account
                </motion.a>
              ) : (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.08, duration: 0.4 }}
                  onClick={() => { setMobileOpen(false); requireAuth(); }}
                  className="text-lg font-medium text-foreground-700 hover:text-primary-600 transition-colors"
                >
                  Sign In
                </motion.button>
              )}
              <motion.a
                href="/contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navLinks.length + 1) * 0.08, duration: 0.4 }}
                onClick={() => setMobileOpen(false)}
                className="mt-4 px-8 py-3 bg-foreground-950 text-background-50 text-sm font-medium tracking-wide uppercase rounded-md"
              >
                Contact Stefanie
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
