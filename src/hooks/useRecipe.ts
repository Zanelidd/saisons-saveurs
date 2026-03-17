import { useQuery } from "@tanstack/react-query";
import { fetchRecipeDetail } from "@/services/spoonacular.service";
import { parseRecipeDetail } from "@/services/menu.service";
import type { RecipeDetail } from "@/types";

// Chaque recette est identifiée par son id Spoonacular.
// Une fois chargée, elle est mise en cache indéfiniment.
export function useRecipe(id: number | null) {
  return useQuery<RecipeDetail, Error>({
    queryKey: ["recipe", id],
    queryFn:  async () => {
      const raw = await fetchRecipeDetail(id!);
      return parseRecipeDetail(raw);
    },
    // N'exécute la requête que si on a un id valide
    enabled:   id !== null,
    staleTime: Infinity,
    gcTime:    Infinity,
  });
}
