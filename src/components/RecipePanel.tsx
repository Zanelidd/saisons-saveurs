import { useState } from "react";
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
  const { data: recipe, isLoading, isError } = useRecipe(open ? recipeId : null);

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        disabled={isLoading}
        className={s.toggleBtn}
        style={{ "--accent": accent } as React.CSSProperties}
      >
        {open ? "✕ Fermer" : isLoading ? "…" : "📖 Recette"}
      </button>

      <div
        className={`${s.panel} ${open ? s.open : ""}`}
        style={{ maxHeight: open ? 420 : 0 }}
      >
        {open && (
          <div className={s.panelInner}>

            {isLoading && (
              <div className={s.loadingWrap}>
                <div className={s.spinner} style={{ "--accent": accent } as React.CSSProperties} />
                Chargement de la recette…
              </div>
            )}

            {isError && <p className={s.errorText}>⚠️ Impossible de charger la recette.</p>}

            {recipe && (
              <>
                <div className={s.recipeTitle}>🍳 {recipe.titre}</div>

                <div className={s.metaRow}>
                  {recipe.temps_prep    && <span className={s.metaBadge}>⏱ Prép. {recipe.temps_prep}</span>}
                  {recipe.temps_cuisson && <span className={s.metaBadge}>🔥 {recipe.temps_cuisson}</span>}
                  {recipe.difficulte    && <span className={s.metaBadge}>⭐ {recipe.difficulte}</span>}
                </div>

                {recipe.sourceUrl && (
                  <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className={s.sourceLink}
                    style={{ "--accent": accent } as React.CSSProperties}>
                    Voir la recette originale ↗
                  </a>
                )}

                <span className={s.sectionLabel} style={{ "--accent": accent } as React.CSSProperties}>
                  Ingrédients
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
                  Préparation
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
