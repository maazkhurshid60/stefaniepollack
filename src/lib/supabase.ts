import { createClient } from "@supabase/supabase-js";

// Shared Supabase project (see D:\Client\sade\supabase-shared). Every row
// this app writes is tagged with SITE so it stays scoped to Stefanie's data
// even though the Andrew Liberty site shares the same project/auth pool.
export const SITE = "stefanie-pollack" as const;

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
