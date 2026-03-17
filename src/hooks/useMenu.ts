import {useQuery} from "@tanstack/react-query";
import {searchRecipesByIngredients} from "@/services/spoonacular.service";
import {buildMenuFromRecipes} from "@/services/menu.service";
import type {Diet} from "@/types/user.types.ts";
import type {DayMenu} from "@/types/menu.types.ts";

interface UseMenuParams {
    ingredients: string[];
    diet: Diet;
    persons: number;
    days: number;
    month: number;
}

// La queryKey inclut tous les paramètres qui influencent le résultat.
// Si la combinaison a déjà été fetchée → données depuis le cache, zéro appel API.
// Exportée pour permettre l'invalidation manuelle (bouton refresh).
export function buildMenuQueryKey(params: UseMenuParams) {
    return [
        "menu",
        params.month,
        [...params.ingredients].sort(), // trié pour éviter les doublons de cache
        params.diet,
        params.persons,
        params.days,
    ] as const;
}

export function useMenu(params: UseMenuParams, enabled: boolean) {
    return useQuery<DayMenu[], Error>({
        queryKey: buildMenuQueryKey(params),
        queryFn: async () => {
            const recipes = await searchRecipesByIngredients({
                ingredients: params.ingredients,
                diet: params.diet,
                number: params.days * 2, // 2 repas par jour
            });
            return buildMenuFromRecipes(recipes, params.days);
        },
        enabled,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}