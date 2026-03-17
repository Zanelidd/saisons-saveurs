export type Diet = "omnivore" | "vegetarien" | "vegan" | "sans-gluten";

export interface UserPrefs {
    diet: Diet;
    persons: number;
    days: number;
}
