export type Macros = {
    kcal: number;
    proteines: number;
    glucides: number;
    lipides: number;
}

export interface MealEntry extends Macros  {
    id: number;
    plat: string;
    image: string;
}

export type DayMenu = {
    jour: string;
    repas: {
        dejeuner: MealEntry;
        diner: MealEntry;
    };
}
