import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

// ── QueryClient ───────────────────────────────────────────────
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Les données ne sont jamais considérées périmées automatiquement —
            // un menu ou une recette Spoonacular ne change pas entre deux visites
            staleTime: Infinity,

            // On garde les données en cache indéfiniment (persistance localStorage)
            gcTime: Infinity,

            // Pas de retry agressif sur les erreurs API (quota limité)
            retry: 1,

            // Pas de refetch au focus ou à la reconnexion — inutile ici
            refetchOnWindowFocus:    false,
            refetchOnReconnect:      false,
            refetchOnMount:          false,
        },
    },
});

// ── Persistance localStorage ──────────────────────────────────
const persister = createSyncStoragePersister({
    storage: window.localStorage,
    key:     "ssv_query_cache",
    // Sérialisation / désérialisation par défaut (JSON)
});

persistQueryClient({
    queryClient,
    persister,
    // Durée max de vie du cache persisté : 30 jours
    // Au-delà, le cache est purgé et les données sont re-fetchées
    maxAge: 1000 * 60 * 60 * 24 * 30,
});