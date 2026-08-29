import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const inputClass =
  "w-full px-4 py-3 bg-background-100 border border-background-300 rounded-md text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors";

export default function AuthModal() {
  const { modalOpen, modalReason, closeModal, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "confirm">("idle");
  const [error, setError] = useState("");

  const reset = () => {
    setFullName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setStatus("idle");
    setError("");
  };

  const close = () => {
    closeModal();
    reset();
    setMode("signin");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("busy");
    if (mode === "signin") {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err);
        setStatus("idle");
      } else {
        close();
      }
    } else {
      if (!fullName.trim()) {
        setError("Please enter your name.");
        setStatus("idle");
        return;
      }
      const { error: err, needsConfirmation } = await signUp(email, password, {
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
      });
      if (err) {
        setError(err);
        setStatus("idle");
      } else if (needsConfirmation) {
        setStatus("confirm");
      } else {
        close();
      }
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
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-label="Sign in"
            className="fixed z-[101] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(420px,calc(100%-32px))] bg-background-50 rounded-2xl border border-background-200/60 shadow-xl p-7"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl text-foreground-950">
                {mode === "signin" ? "Sign In" : "Create Account"}
              </h2>
              <button onClick={close} aria-label="Close" className="text-foreground-400 hover:text-foreground-950 transition-colors">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {modalReason && <p className="mt-2 text-sm text-foreground-600">{modalReason}</p>}

            {status === "confirm" ? (
              <p className="mt-5 text-sm text-foreground-600 leading-relaxed">
                Almost there — we sent a confirmation link to <b className="text-foreground-950">{email}</b>. Click it,
                then come back and sign in.
              </p>
            ) : (
              <>
                <div className="mt-5 flex gap-1 bg-background-100 rounded-md p-1">
                  <button
                    type="button"
                    onClick={() => { setMode("signin"); setError(""); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                      mode === "signin" ? "bg-background-50 text-foreground-950 shadow-sm" : "text-foreground-500"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode("signup"); setError(""); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                      mode === "signup" ? "bg-background-50 text-foreground-950 shadow-sm" : "text-foreground-500"
                    }`}
                  >
                    Register
                  </button>
                </div>

                <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
                  {mode === "signup" && (
                    <>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        autoComplete="name"
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
                    </>
                  )}
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
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    className={inputClass}
                  />
                  {error && <p className="text-xs text-red-600">{error}</p>}
                  <button
                    type="submit"
                    disabled={status === "busy"}
                    className="mt-1 w-full px-6 py-3 bg-foreground-950 text-background-50 text-sm font-medium tracking-wide uppercase rounded-md hover:bg-foreground-800 transition-colors disabled:opacity-60"
                  >
                    {status === "busy" ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
