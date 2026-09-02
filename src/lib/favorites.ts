import { getLeadFavorites, saveLeadFavorite, deleteLeadFavorite } from "./idx";

export async function listFavoriteMlsIds(leadId: string): Promise<Set<string>> {
  const map = await getLeadFavorites(leadId).catch(() => new Map<string, string>());
  return new Set(map.keys());
}

export async function addFavorite(leadId: string, idxId: string, listingId: string): Promise<boolean> {
  const id = await saveLeadFavorite(leadId, idxId, listingId).catch(() => null);
  return id != null;
}

export async function removeFavorite(leadId: string, listingId: string): Promise<boolean> {
  const map = await getLeadFavorites(leadId).catch(() => new Map<string, string>());
  const favoriteId = map.get(listingId);
  if (!favoriteId) return false;
  return deleteLeadFavorite(leadId, favoriteId).catch(() => false);
}
