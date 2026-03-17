// Types bruts retournés par l'API Spoonacular
// Ne jamais utiliser ces types directement dans les composants UI —
// passer toujours par les types métier (menu.types, recipe.types)

export interface SpoonacularNutrient {
  name:   string;
  amount: number;
  unit:   string;
}

export interface SpoonacularIngredient {
  name:     string;
  measures?: {
    metric?: {
      amount:    number;
      unitShort: string;
    };
  };
}

export interface SpoonacularStep {
  number: number;
  step:   string;
}

export interface SpoonacularInstruction {
  steps: SpoonacularStep[];
}

export interface SpoonacularRecipe {
  id:                    number;
  title:                 string;
  image:                 string;
  readyInMinutes:        number;
  preparationMinutes:    number;
  cookingMinutes:        number;
  sourceUrl?:            string;
  nutrition?: {
    nutrients: SpoonacularNutrient[];
  };
  extendedIngredients?:   SpoonacularIngredient[];
  analyzedInstructions?:  SpoonacularInstruction[];
}
