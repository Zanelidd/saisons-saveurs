import type { Macros } from "./menu.types";

export interface RecipeDetail {
  titre:         string;
  temps_prep:    string | null;
  temps_cuisson: string;
  difficulte:    "Facile" | "Moyen" | "Élaboré";
  sourceUrl:     string;
  ingredients:   string[];
  etapes:        string[];
  nutrition:     Macros;
}
