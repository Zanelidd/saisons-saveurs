import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecipe } from "@/hooks/useRecipe";
import type { Diet } from "@/types";
import s from "@/styles/RecipePanel.module.css";

interface RecipePanelProps {
    recipeId: number;
    diet:     Diet;
    persons:  number;
    accent:   string;
}

export function RecipePanel({ recipeId, accent }: RecipePanelProps) {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const { data: recipe, isLoading, isError } = useRecipe(open ? recipeId : null);

    const difficultyKey =
        recipe?.difficulte === "Facile" || recipe?.difficulte === "Easy"   ? "difficulty.easy"   :
            recipe?.difficulte === "Moyen"  || recipe?.difficulte === "Medium" ? "difficulty.medium" :
                "difficulty.hard";

    return (
        <>
            <button
                onClick={() => setOpen(o => !o)}
                disabled={isLoading}
                className={s.toggleBtn}
                style={{ "--accent": accent } as React.CSSProperties}
            >
                {open ? t("recipe.close") : isLoading ? "…" : t("recipe.open")}
            </button>

            <div className={`${s.panel} ${open ? s.open : ""}`} style={{ maxHeight: open ? 420 : 0 }}>
                {open && (
                    <div className={s.panelInner}>
                        {isLoading && (
                            <div className={s.loadingWrap}>
                                <div className={s.spinner} style={{ "--accent": accent } as React.CSSProperties} />
                                {t("recipe.loading")}
                            </div>
                        )}

                        {isError && <p className={s.errorText}>{t("recipe.error")}</p>}

                        {recipe && (
                            <>
                                <div className={s.recipeTitle}>🍳 {recipe.titre}</div>
                                <div className={s.metaRow}>
                                    {recipe.temps_prep    && <span className={s.metaBadge}>{t("recipe.prep", { value: recipe.temps_prep })}</span>}
                                    {recipe.temps_cuisson && <span className={s.metaBadge}>{t("recipe.cook", { value: recipe.temps_cuisson })}</span>}
                                    {recipe.difficulte    && <span className={s.metaBadge}>{t(difficultyKey)}</span>}
                                </div>
                                {recipe.sourceUrl && (
                                    <a href={recipe.sourceUrl} target="_blank" rel="noreferrer"
                                       className={s.sourceLink} style={{ "--accent": accent } as React.CSSProperties}>
                                        {t("recipe.source")}
                                    </a>
                                )}
                                <span className={s.sectionLabel} style={{ "--accent": accent } as React.CSSProperties}>
                  {t("recipe.ingredients")}
                </span>
                                <ul className={s.ingredientsList}>
                                    {recipe.ingredients.map((ing, i) => (
                                        <li key={i} className={s.ingredientItem}>
                                            <span className={s.ingredientBullet} style={{ color: accent }}>•</span>
                                            {ing}
                                        </li>
                                    ))}
                                </ul>
                                <span className={s.sectionLabel} style={{ "--accent": accent } as React.CSSProperties}>
                  {t("recipe.steps")}
                </span>
                                <ol className={s.stepsList}>
                                    {recipe.etapes.map((step, i) => (
                                        <li key={i} className={s.stepItem}>
                                            <span className={s.stepNumber} style={{ background: accent }}>{i + 1}</span>
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}