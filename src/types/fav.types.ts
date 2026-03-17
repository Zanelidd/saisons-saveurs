import type {Diet} from "./user.types";
import type {DayMenu} from "./menu.types";

export interface FavItem {
    id: string;
    jour: string;
    month: number;
    monthName: string;
    persons: number;
    diet: Diet;
    repas: DayMenu["repas"];
    savedAt: string;
}
