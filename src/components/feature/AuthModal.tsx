import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useLead } from "@/hooks/useLead";

const inputClass =
  "w-full px-4 py-3 bg-background-100 border border-background-300 rounded-md text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors";

export default function AuthModal() {
  const { modalOpen, modalReason, closeModal, signIn } = useLead();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "busy">("idle");
  const [error, setError] = useState("");

  const reset = () => {
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setStatus("idle");
    setError("");
  };

  const close = () => {
    closeModal();
    reset();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("busy");
    const { error: err } = await signIn({
      email,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
    });
    if (err) {
      setError(err);
      setStatus("idle");
    } else {
      close();
    }
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-foreground-950/50 backdrop-blur-sm"
            onClick={close}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              role="dialog"
              aria-label="Save your info"
              className="pointer-events-auto w-[min(420px,100%)] bg-background-50 rounded-2xl border border-background-200/60 shadow-xl p-7"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl text-foreground-950">Continue</h2>
                <button onClick={close} aria-label="Close" className="text-foreground-400 hover:text-foreground-950 transition-colors">
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              {modalReason && <p className="mt-2 text-sm text-foreground-600">{modalReason}</p>}

              <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  className={inputClass}
                />
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  autoComplete="family-name"
                  className={inputClass}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  autoComplete="email"
                  className={inputClass}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone (optional)"
                  autoComplete="tel"
                  className={inputClass}
                />
                {error && <p className="text-xs text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={status === "busy"}
                  className="mt-1 w-full px-6 py-3 bg-foreground-950 text-background-50 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-foreground-800 transition-colors disabled:opacity-60"
                >
                  {status === "busy" ? "Please wait…" : "Continue"}
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
