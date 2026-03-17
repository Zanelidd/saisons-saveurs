import type { Diet, SpoonacularRecipe } from "@/types";

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY as string;
const BASE_URL = "https://api.spoonacular.com";

const DIET_MAP: Record<Diet, string> = {
    omnivore:      "",
    vegetarien:    "vegetarian",
    vegan:         "vegan",
    "sans-gluten": "gluten free",
};

// ── Recherche de recettes par ingrédients ─────────────────────
export interface SearchRecipesParams {
    ingredients: string[];
    diet:        Diet;
    number?:     number;
}

export async function searchRecipesByIngredients({
                                                     ingredients,
                                                     diet,
                                                     number = 14,
                                                 }: SearchRecipesParams): Promise<SpoonacularRecipe[]> {
    const params = new URLSearchParams({
        apiKey:               API_KEY,
        includeIngredients:   ingredients.join(","),
        number:               String(number),
        sort:                 "max-used-ingredients",
        sortDirection:        "desc",
        addRecipeInformation: "true",
        fillIngredients:      "true",
    });

    const dietValue = DIET_MAP[diet];
    if (dietValue) params.set("diet", dietValue);

    const res = await fetch(`${BASE_URL}/recipes/complexSearch?${params}`);
    if (!res.ok) throw new Error(`Spoonacular ${res.status}: ${res.statusText}`);

    const data = await res.json();
    return data.results ?? [];
}

// ── Détail complet d'une recette ──────────────────────────────
export async function fetchRecipeDetail(id: number): Promise<SpoonacularRecipe> {
    const params = new URLSearchParams({
        apiKey:           API_KEY,
        includeNutrition: "true",
    });

    const res = await fetch(`${BASE_URL}/recipes/${id}/information?${params}`);
    if (!res.ok) throw new Error(`Spoonacular ${res.status}: ${res.statusText}`);

    return res.json();
}