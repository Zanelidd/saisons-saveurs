import {createContext, useContext, useState} from "react";
import {useTranslation} from "react-i18next";
import {useRecipe} from "@/hooks/useRecipe";
import type {Diet} from "@/types";
import s from "@/styles/RecipePanel.module.css";

interface RecipePanelProps {
    recipeId: number;
    diet: Diet;
    persons: number;
    accent: string;
    children: React.ReactNode;
}

interface RecipeCtx {
    open: boolean;
    toggle: () => void;
    recipeId: number;
    accent: string;
    isLoading: boolean;
}

const Ctx = createContext<RecipeCtx | null>(null);

// ── Provider ──────────────────────────────────────────────────
export function RecipePanel({recipeId, accent, children}: RecipePanelProps) {
    const [open, setOpen] = useState(false);
    const {isLoading} = useRecipe(open ? recipeId : null);

    return (
        <Ctx.Provider value={{open, toggle: () => setOpen(o => !o), recipeId, accent, isLoading}}>
            {children}
        </Ctx.Provider>
    );
}

// ── Bouton toggle ─────────────────────────────────────────────
RecipePanel.Button = function RecipePanelButton() {
    const ctx = useContext(Ctx)!;
    const {t} = useTranslation();

    return (
        <button
            onClick={ctx.toggle}
            disabled={ctx.isLoading}
            className={s.toggleBtn}
            style={{"--accent": ctx.accent} as React.CSSProperties}
        >
            {ctx.open ? t("recipe.close") : ctx.isLoading ? "…" : t("recipe.open")}
        </button>
    );
};

// ── Panel dépliable ───────────────────────────────────────────
RecipePanel.Panel = function RecipePanelContent() {
    const ctx = useContext(Ctx)!;
    const {t} = useTranslation();
    const {data: recipe, isLoading, isError} = useRecipe(ctx.open ? ctx.recipeId : null);

    const difficultyKey =
        recipe?.difficulte === "Facile" ? "difficulty.easy" :
            recipe?.difficulte === "Moyen" ? "difficulty.medium" :
                "difficulty.hard";

    return (
        <div
            className={`${s.panel} ${ctx.open ? s.open : ""}`}
            style={{maxHeight: ctx.open ? 420 : 0}}
        >
            {ctx.open && (
                <div className={s.panelInner}>

                    {isLoading && (
                        <div className={s.loadingWrap}>
                            <div className={s.spinner} style={{"--accent": ctx.accent} as React.CSSProperties}/>
                            {t("recipe.loading")}
                        </div>
                    )}

                    {isError && <p className={s.errorText}>{t("recipe.error")}</p>}

                    {recipe && (
                        <>
                            <div className={s.recipeTitle}>🍳 {recipe.titre}</div>

                            <div className={s.metaRow}>
                                {recipe.temps_prep &&
                                    <span className={s.metaBadge}>{t("recipe.prep", {value: recipe.temps_prep})}</span>}
                                {recipe.temps_cuisson && <span
                                    className={s.metaBadge}>{t("recipe.cook", {value: recipe.temps_cuisson})}</span>}
                                {recipe.difficulte && <span className={s.metaBadge}>{t(difficultyKey)}</span>}
                            </div>

                            {recipe.sourceUrl && (
                                <a href={recipe.sourceUrl} target="_blank" rel="noreferrer"
                                   className={s.sourceLink} style={{"--accent": ctx.accent} as React.CSSProperties}>
                                    {t("recipe.source")}
                                </a>
                            )}

                            <span className={s.sectionLabel} style={{"--accent": ctx.accent} as React.CSSProperties}>
                {t("recipe.ingredients")}
              </span>
                            <ul className={s.ingredientsList}>
                                {recipe.ingredients.map((ing, i) => (
                                    <li key={i} className={s.ingredientItem}>
                                        <span className={s.ingredientBullet} style={{color: ctx.accent}}>•</span>
                                        {ing}
                                    </li>
                                ))}
                            </ul>

                            <span className={s.sectionLabel} style={{"--accent": ctx.accent} as React.CSSProperties}>
                {t("recipe.steps")}
              </span>
                            <ol className={s.stepsList}>
                                {recipe.etapes.map((step, i) => (
                                    <li key={i} className={s.stepItem}>
                                        <span className={s.stepNumber} style={{background: ctx.accent}}>{i + 1}</span>
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </>
                    )}

                </div>
            )}
        </div>
    );
};