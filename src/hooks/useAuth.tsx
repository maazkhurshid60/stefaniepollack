/* eslint-disable react-refresh/only-export-components -- context provider + its hook are one cohesive module */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, SITE } from "@/lib/supabase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  /** Opens the shared sign-in/sign-up modal. `reason` is shown as a headline. */
  requireAuth: (reason?: string) => void;
  modalOpen: boolean;
  modalReason: string | null;
  closeModal: () => void;
  signUp: (
    email: string,
    password: string,
    opts: { fullName: string; phone?: string }
  ) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const requireAuth = useCallback((reason?: string) => {
    setModalReason(reason ?? null);
    setModalOpen(true);
  }, []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const signUp: AuthContextValue["signUp"] = useCallback(async (email, password, opts) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { site: SITE, full_name: opts.fullName, phone: opts.phone ?? null } },
    });
    return { error: error?.message ?? null, needsConfirmation: !error && !data.session };
  }, []);

  const signIn: AuthContextValue["signIn"] = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      loading,
      requireAuth,
      modalOpen,
      modalReason,
      closeModal,
      signUp,
      signIn,
      signOut,
    }),
    [session, loading, requireAuth, modalOpen, modalReason, closeModal, signUp, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
