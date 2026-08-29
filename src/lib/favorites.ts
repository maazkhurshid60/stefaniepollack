import { supabase, SITE } from "./supabase";

export async function listFavoriteMlsIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("favorites")
    .select("mls_id")
    .eq("user_id", userId)
    .eq("site", SITE);
  if (error || !data) return new Set();
  return new Set(data.map((row) => row.mls_id as string));
}

export async function addFavorite(userId: string, mlsId: string): Promise<boolean> {
  const { error } = await supabase
    .from("favorites")
    .upsert({ user_id: userId, site: SITE, mls_id: mlsId }, { onConflict: "user_id,site,mls_id" });
  return !error;
}

export async function removeFavorite(userId: string, mlsId: string): Promise<boolean> {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("site", SITE)
    .eq("mls_id", mlsId);
  return !error;
}
