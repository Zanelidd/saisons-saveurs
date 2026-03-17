// Types bruts retournés par l'API Spoonacular
// Ne jamais utiliser ces types directement dans les composants UI —
// passer toujours par les types métier (menu.types, recipe.types)

export type SpoonacularNutrient = {
    name: string;
    amount: number;
    unit: string;
}

export type SpoonacularIngredient = {
    name: string;
    measures?: {
        metric?: {
            amount: number;
            unitShort: string;
        };
    };
}

export type SpoonacularStep = {
    number: number;
    step: string;
}

export type SpoonacularInstruction = {
    steps: SpoonacularStep[];
}

export type SpoonacularRecipe = {
    id: number;
    title: string;
    image: string;
    readyInMinutes: number;
    preparationMinutes: number;
    cookingMinutes: number;
    sourceUrl?: string;
    nutrition?: {
        nutrients: SpoonacularNutrient[];
    };
    extendedIngredients?: SpoonacularIngredient[];
    analyzedInstructions?: SpoonacularInstruction[];
}
