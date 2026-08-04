import { useState, FormEvent } from "react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("success");
    setMessage("Thank you for subscribing! You will receive exclusive off-market listings.");
    setEmail("");
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section className="w-full bg-background-200 py-20 md:py-28">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary-600 mb-4">
            Stay Informed
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground-950">
            Sign Up for{" "}
            <span className="italic font-normal">Exclusive</span> Off-Market Listings
          </h2>
          <p className="mt-4 text-foreground-600 leading-relaxed">
            Be the first to know about properties before they hit the market.
            Join Stefanie&apos;s exclusive network of buyers and sellers.
          </p>

          <form onSubmit={handleSubmit} className="mt-8" data-readdy-form>
            <input type="text" name="contact_alt" tabIndex={-1} autoComplete="off" aria-hidden="true" readOnly className="opacity-0 absolute w-0 h-0" />
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 bg-background-50 border border-background-300 rounded-md text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-foreground-950 text-background-50 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-foreground-800 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
            {status !== "idle" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-sm ${status === "success" ? "text-primary-700" : "text-red-600"}`}
              >
                {message}
              </motion.p>
            )}
          </form>

          <p className="mt-6 text-xs text-foreground-400">
            By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}