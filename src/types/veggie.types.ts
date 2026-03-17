export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type Season = "spring" | "summer" | "autumn" | "winter";

export interface Veggie {
    emoji: string;
    name: string;
    months: MonthNumber[];
}
