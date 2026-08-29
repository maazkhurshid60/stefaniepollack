import { supabase, SITE } from "./supabase";

export type SavedSearchRow = {
  id: string;
  name: string;
  criteria: Record<string, unknown>;
  created_at: string;
};

export async function listSavedSearches(userId: string): Promise<SavedSearchRow[]> {
  const { data, error } = await supabase
    .from("saved_searches")
    .select("id, name, criteria, created_at")
    .eq("user_id", userId)
    .eq("site", SITE)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as SavedSearchRow[];
}

export async function createSavedSearch(
  userId: string,
  name: string,
  criteria: Record<string, unknown>
): Promise<boolean> {
  const { error } = await supabase
    .from("saved_searches")
    .insert({ user_id: userId, site: SITE, name, criteria });
  return !error;
}

export async function deleteSavedSearch(userId: string, id: string): Promise<boolean> {
  const { error } = await supabase.from("saved_searches").delete().eq("user_id", userId).eq("id", id);
  return !error;
}
