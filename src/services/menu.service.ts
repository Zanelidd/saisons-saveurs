import type {DayMenu, Macros, MealEntry, RecipeDetail, SpoonacularNutrient, SpoonacularRecipe} from "@/types";

const DAY_NAMES = [
    "Lundi", "Mardi", "Mercredi", "Jeudi",
    "Vendredi", "Samedi", "Dimanche",
] as const;

// ── Helpers nutrition ─────────────────────────────────────────
function getNutrient(nutrients: SpoonacularNutrient[], name: string): number {
    return Math.round(nutrients.find(n => n.name === name)?.amount ?? 0);
}

function extractMacros(recipe: SpoonacularRecipe): Macros {
    const nutrients = recipe.nutrition?.nutrients ?? [];
    return {
        kcal: getNutrient(nutrients, "Calories"),
        proteines: getNutrient(nutrients, "Protein"),
        glucides: getNutrient(nutrients, "Carbohydrates"),
        lipides: getNutrient(nutrients, "Fat"),
    };
}

function toMealEntry(recipe: SpoonacularRecipe): MealEntry {
    return {
        id: recipe.id,
        plat: recipe.title,
        image: recipe.image,
        ...extractMacros(recipe),
    };
}

// ── Construction du menu ──────────────────────────────────────
// Spoonacular n'a pas d'endpoint "menu par légumes" —
// on distribue les recettes retournées sur les jours demandés
export function buildMenuFromRecipes(
    recipes: SpoonacularRecipe[],
    days: number,
): DayMenu[] {
    if (recipes.length < 2) {
        throw new Error("Pas assez de recettes pour construire un menu.");
    }

    const shuffled = [...recipes].sort(() => Math.random() - 0.5);

    return Array.from({length: days}, (_, i) => ({
        jour: DAY_NAMES[i],
        repas: {
            dejeuner: toMealEntry(shuffled[i * 2] ?? shuffled[i % shuffled.length]),
            diner: toMealEntry(shuffled[i * 2 + 1] ?? shuffled[(i + 1) % shuffled.length]),
        },
    }));
}

// ── Transformation recette brute → RecipeDetail ───────────────
export function parseRecipeDetail(raw: SpoonacularRecipe): RecipeDetail {
    const readyIn = raw.readyInMinutes ?? 0;

    return {
        titre: raw.title,
        temps_prep: raw.preparationMinutes > 0 ? `${raw.preparationMinutes} min` : null,
        temps_cuisson: raw.cookingMinutes > 0 ? `${raw.cookingMinutes} min` : `${readyIn} min`,
        difficulte: readyIn <= 20 ? "Facile" : readyIn <= 45 ? "Moyen" : "Élaboré",
        sourceUrl: raw.sourceUrl ?? "",
        ingredients: (raw.extendedIngredients ?? []).map(ing => {
            const qty = ing.measures?.metric?.amount ? Math.round(ing.measures.metric.amount) : null;
            const unit = ing.measures?.metric?.unitShort ?? "";
            return qty ? `${qty}${unit} de ${ing.name}` : ing.name;
        }),
        etapes: raw.analyzedInstructions?.[0]?.steps.map(s => s.step) ?? [],
        nutrition: extractMacros(raw),
    };
}