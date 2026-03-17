export interface Macros {
  kcal:      number;
  proteines: number;
  glucides:  number;
  lipides:   number;
}

export interface MealEntry extends Macros {
  id:    number;
  plat:  string;
  image: string;
}

export interface DayMenu {
  jour: string;
  repas: {
    déjeuner: MealEntry;
    dîner:    MealEntry;
  };
}
