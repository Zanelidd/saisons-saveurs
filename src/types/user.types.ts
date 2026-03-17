export type Diet = "omnivore" | "vegetarien" | "vegan" | "sans-gluten";

export type UserPrefs = {
    diet: Diet;
    persons: number;
    days: number;
}
