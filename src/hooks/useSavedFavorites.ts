import { useEffect, useState } from "react";
import { useLead } from "./useLead";
import { listFavoriteMlsIds } from "@/lib/favorites";

export function useSavedFavorites(): Set<string> {
  const { leadId } = useLead();
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!leadId) {
      setSaved(new Set());
      return;
    }
    listFavoriteMlsIds(leadId).then(setSaved);
  }, [leadId]);

  return saved;
}
