/* eslint-disable react-refresh/only-export-components -- context provider + its hook are one cohesive module */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createLead, findLeadByEmail } from "@/lib/idx";

const STORAGE_KEY = "idx-lead-session";

type LeadSession = { leadId: string; email: string; firstName: string };

type LeadContextValue = {
  leadId: string | null;
  email: string | null;
  loading: boolean;
  /** Opens the shared "save your info" modal. `reason` is shown as a headline. */
  requireLead: (reason?: string) => void;
  modalOpen: boolean;
  modalReason: string | null;
  closeModal: () => void;
  signIn: (input: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<{
    error: string | null;
    /** True when this created a brand-new lead, which is when IDX sends its
     *  "verify your email to activate your account" message — a returning
     *  visitor is matched to their existing lead and gets no such email. */
    created: boolean;
  }>;
  signOut: () => void;
};

const LeadContext = createContext<LeadContextValue | null>(null);

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<LeadSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw) as LeadSession);
    } catch {
      /* corrupt/missing — treat as signed out */
    }
    setLoading(false);
  }, []);

  const requireLead = useCallback((reason?: string) => {
    setModalReason(reason ?? null);
    setModalOpen(true);
  }, []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const signIn: LeadContextValue["signIn"] = useCallback(async (input) => {
    try {
      let leadId = await findLeadByEmail(input.email);
      const created = !leadId;
      if (!leadId) {
        leadId = await createLead({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
        });
      }
      if (!leadId) return { error: "Something went wrong — please try again.", created: false };
      const next: LeadSession = { leadId, email: input.email, firstName: input.firstName };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSession(next);
      return { error: null, created };
    } catch {
      return { error: "Something went wrong — please try again.", created: false };
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      leadId: session?.leadId ?? null,
      email: session?.email ?? null,
      loading,
      requireLead,
      modalOpen,
      modalReason,
      closeModal,
      signIn,
      signOut,
    }),
    [session, loading, requireLead, modalOpen, modalReason, closeModal, signIn, signOut]
  );

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}

export function useLead() {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error("useLead must be used within LeadProvider");
  return ctx;
}
