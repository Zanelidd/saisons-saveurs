import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RecipePanel } from "./RecipePanel";
import type { DayMenu, Diet, FavItem } from "@/types";
import s from "@/styles/DayCard.module.css";

interface DayCardProps {
    dayMenu:     DayMenu;
    dayIdx:      number;
    menuId:      number;
    diet:        Diet;
    persons:     number;
    defaultOpen: boolean;
    accent:      string;
    isFav:       boolean;
    onFavToggle: (fav: FavItem) => void;
    month:       number;
    monthName:   string;
}

export function DayCard({
                            dayMenu, dayIdx, menuId, diet, persons,
                            defaultOpen, accent, isFav, onFavToggle,
                            month, monthName,
                        }: DayCardProps) {
    const [open, setOpen] = useState(defaultOpen);
    const { t } = useTranslation();

    const repasEntries = Object.entries(dayMenu.repas);

    const totals = repasEntries.reduce(
        (acc, [, meal]) => ({
            kcal:      acc.kcal      + meal.kcal,
            proteines: acc.proteines + meal.proteines,
            glucides:  acc.glucides  + meal.glucides,
            lipides:   acc.lipides   + meal.lipides,
        }),
        { kcal: 0, proteines: 0, glucides: 0, lipides: 0 },
    );

    const macroTotal = totals.proteines + totals.glucides + totals.lipides || 1;
    const pW = Math.round(totals.proteines / macroTotal * 100);
    const gW = Math.round(totals.glucides  / macroTotal * 100);
    const lW = 100 - pW - gW;

    const favId = `${menuId}_${dayIdx}`;

    const handleFavClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFavToggle({
            id: favId, jour: dayMenu.jour,
            month, monthName, persons, diet,
            repas: dayMenu.repas,
            savedAt: new Date().toLocaleDateString(),
        });
    };

    return (
        <div className={s.card}>
            {/* Header */}
            <div className={s.header} onClick={() => setOpen(o => !o)}>
                <div className={s.headerLeft}>
                    <span className={s.dayName}>{dayMenu.jour}</span>
                    {totals.kcal > 0 && (
                        <span className={s.kcalBadge}>{t("nutrition.kcalDay", { value: totals.kcal })}</span>
                    )}
                </div>
                <div className={s.headerRight}>
                    <button
                        className={s.favBtn}
                        onClick={handleFavClick}
                        title={isFav ? t("favs.remove") : t("favs.save")}
                    >
                        {isFav ? "❤️" : "🤍"}
                    </button>
                    <span className={`${s.arrow} ${open ? s.open : ""}`}>▼</span>
                </div>
            </div>

            {/* Body */}
            <div className={`${s.body} ${open ? s.open : ""}`} style={{ maxHeight: open ? 2000 : 0 }}>

                {/* Nutrition bar */}
                {totals.kcal > 0 && (
                    <div className={s.nutriWrap}>
                        <div className={s.nutriBar}>
                            <div className={s.nbProtein} style={{ width: `${pW}%` }} />
                            <div className={s.nbCarbs}   style={{ width: `${gW}%` }} />
                            <div className={s.nbFat}     style={{ width: `${lW}%` }} />
                        </div>
                        <div className={s.nutriLegend}>
                            {([
                                ["nbProtein", t("nutrition.proteins", { value: totals.proteines })],
                                ["nbCarbs",   t("nutrition.carbs",    { value: totals.glucides })],
                                ["nbFat",     t("nutrition.fat",      { value: totals.lipides })],
                            ] as const).map(([cls, label]) => (
                                <span key={label} className={s.nutriItem}>
                  <span className={`${s.nutriDot} ${s[cls]}`} />
                                    {label}
                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Meals */}
                {repasEntries.map(([type, meal]) => {
                    const labelKey = type === "déjeuner" || type === "dejeuner" ? "meal.lunch" : "meal.dinner";
                    return (
                        <div key={type} className={s.meal}>
                            <div className={s.mealTop}>
                                <div className={s.mealLabel}>{t(labelKey)}</div>
                                <div className={s.mealBody}>
                                    <div className={s.mealName}>{meal.plat}</div>
                                    {meal.kcal > 0 && (
                                        <div className={s.macros}>
                                            <span className={`${s.pill} ${s.pillKcal}`}>{t("meal.kcal",    { value: meal.kcal })}</span>
                                            <span className={`${s.pill} ${s.pillP}`}   >{t("meal.protein", { value: meal.proteines })}</span>
                                            <span className={`${s.pill} ${s.pillG}`}   >{t("meal.carbs",   { value: meal.glucides })}</span>
                                            <span className={`${s.pill} ${s.pillL}`}   >{t("meal.fat",     { value: meal.lipides })}</span>
                                        </div>
                                    )}
                                    <RecipePanel recipeId={meal.id} diet={diet} persons={persons} accent={accent} />
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div style={{ height: 4 }} />
            </div>
        </div>
    );
}