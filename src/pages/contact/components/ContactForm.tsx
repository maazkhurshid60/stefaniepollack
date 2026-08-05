import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "");
    if (!email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("success");
    setMessage("Thanks for reaching out — Stefanie will be in touch shortly.");
    e.currentTarget.reset();
    setTimeout(() => setStatus("idle"), 6000);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7 }}
      onSubmit={handleSubmit}
      data-readdy-form
      className="bg-background-50 rounded-2xl border border-background-200/60 p-8 md:p-10"
    >
      <input type="text" name="contact_alt" tabIndex={-1} autoComplete="off" aria-hidden="true" readOnly className="opacity-0 absolute w-0 h-0" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-xs font-medium tracking-wide uppercase text-foreground-600 mb-2">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-4 py-3 bg-background-100 border border-background-300 rounded-md text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs font-medium tracking-wide uppercase text-foreground-600 mb-2">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full px-4 py-3 bg-background-100 border border-background-300 rounded-md text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
            placeholder="(818) 000-0000"
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="email" className="block text-xs font-medium tracking-wide uppercase text-foreground-600 mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-3 bg-background-100 border border-background-300 rounded-md text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
          placeholder="you@email.com"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="block text-xs font-medium tracking-wide uppercase text-foreground-600 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full px-4 py-3 bg-background-100 border border-background-300 rounded-md text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors resize-none"
          placeholder="Tell me a bit about what you're looking for..."
        />
      </div>

      <button
        type="submit"
        className="mt-6 w-full sm:w-auto px-8 py-3.5 bg-foreground-950 text-background-50 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-foreground-800 transition-colors whitespace-nowrap"
      >
        Send Message
      </button>

      {status !== "idle" && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 text-sm ${status === "success" ? "text-primary-700" : "text-red-600"}`}
        >
          {message}
        </motion.p>
      )}
    </motion.form>
  );
}
