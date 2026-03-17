import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DayCard } from "./DayCard";
import { useMenu, buildMenuQueryKey } from "@/hooks/useMenu";
import { getVeggiesForMonth } from "@/data/veggies.data";
import type { Diet, FavItem } from "@/types";
import s from "@/styles/PlannerTab.module.css";

const MONTH_SHORT = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
const MONTH_FULL  = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

const SEASON_LBL: Record<number, string> = {
    1:"Hiver ❄️",2:"Hiver ❄️",3:"Printemps 🌸",4:"Printemps 🌸",5:"Printemps 🌸",
    6:"Été ☀️",7:"Été ☀️",8:"Été ☀️",
    9:"Automne 🍂",10:"Automne 🍂",11:"Automne 🍂",12:"Hiver ❄️",
};

const SEASON_ACCENT: Record<number, string> = {
    1:"#3a7aab",2:"#3a7aab",3:"#5a9e5a",4:"#5a9e5a",5:"#5a9e5a",
    6:"#d4922a",7:"#d4922a",8:"#d4922a",
    9:"#c0522a",10:"#c0522a",11:"#c0522a",12:"#3a7aab",
};

const HEADER_GRADIENT: Record<number, string> = {
    1:"linear-gradient(150deg,#0e1e3b,#182c5c 55%,#284278)",
    2:"linear-gradient(150deg,#0e1e3b,#182c5c 55%,#284278)",
    3:"linear-gradient(150deg,#1e3b1e,#2e5c2e 55%,#4a7c3a)",
    4:"linear-gradient(150deg,#1e3b1e,#2e5c2e 55%,#4a7c3a)",
    5:"linear-gradient(150deg,#1e3b1e,#2e5c2e 55%,#4a7c3a)",
    6:"linear-gradient(150deg,#3b2a0e,#5c4418 55%,#7c5e28)",
    7:"linear-gradient(150deg,#3b2a0e,#5c4418 55%,#7c5e28)",
    8:"linear-gradient(150deg,#3b2a0e,#5c4418 55%,#7c5e28)",
    9:"linear-gradient(150deg,#3b1a0e,#5c2c18 55%,#7c4228)",
    10:"linear-gradient(150deg,#3b1a0e,#5c2c18 55%,#7c4228)",
    11:"linear-gradient(150deg,#3b1a0e,#5c2c18 55%,#7c4228)",
    12:"linear-gradient(150deg,#0e1e3b,#182c5c 55%,#284278)",
};

const LEAVES = [
    { emoji: "🌿", fontSize: 100, style: { top: -10,  left: "4%",  transform: "rotate(-18deg)" } },
    { emoji: "🍃", fontSize: 140, style: { bottom: -24, right: "6%", transform: "rotate(28deg)"  } },
    { emoji: "🌱", fontSize: 56,  style: { top: 18,   right: "22%", transform: "rotate(8deg)"   } },
];

interface PlannerTabProps {
    onFavToggle: (fav: FavItem) => void;
    isFav:       (id: string) => boolean;
}

export function PlannerTab({ onFavToggle, isFav }: PlannerTabProps) {
    const [month,   setMonth]   = useState<number>(new Date().getMonth() + 1);
    const [selected,setSelected]= useState<Set<string>>(() => new Set(getVeggiesForMonth(new Date().getMonth() + 1).map(v => v.name)));
    const [diet,    setDiet]    = useState<Diet>("omnivore");
    const [persons, setPersons] = useState<number>(2);
    const [days,    setDays]    = useState<number>(5);
    const [menuId,  setMenuId]  = useState<number | null>(null);
    const [enabled, setEnabled] = useState(false);

    const inSeason = useMemo(() => getVeggiesForMonth(month), [month]);
    const accent    = SEASON_ACCENT[month];
    const queryClient = useQueryClient();

    const menuParams = { ingredients: Array.from(selected), diet, persons, days, month };

    const handleMonthChange = (m: number) => {
        setMonth(m);
        setSelected(new Set(getVeggiesForMonth(m).map(v => v.name)));
        setEnabled(false);
        setMenuId(null);
    };

    const toggleVeg = (name: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(name) ? next.delete(name) : next.add(name);
            return next;
        });
    };

    const { data: menu, isLoading, isError } = useMenu(menuParams, enabled);

    const handleGenerate = () => {
        setMenuId(Date.now());
        setEnabled(true);
    };

    const handleRefresh = () => {
        // Supprime l'entrée du cache pour cette combinaison exacte
        // → force un nouvel appel API au prochain render
        queryClient.removeQueries({ queryKey: buildMenuQueryKey(menuParams) });
        setMenuId(Date.now());
        setEnabled(true);
    };

    return (
        <div>
            {/* Header */}
            <div className={s.header} style={{ background: HEADER_GRADIENT[month] }}>
                {LEAVES.map(({ emoji, fontSize, style }, i) => (
                    <span key={i} className={s.headerLeaf} style={{ fontSize, ...style }}>{emoji}</span>
                ))}
                <h1 className={s.headerTitle}>
                    Saisons <em className={s.headerTitleEm}>&</em> Saveurs
                </h1>
                <p className={s.headerSub}>Des menus équilibrés selon les légumes du moment</p>
            </div>

            <div style={{ height: 32 }} />

            {/* Mois */}
            <div className={s.sectionTitle}>Mois <span className={s.sectionTitleLine} /></div>
            <div className={s.monthStrip}>
                {MONTH_SHORT.map((name, i) => (
                    <button
                        key={i}
                        onClick={() => handleMonthChange(i + 1)}
                        className={`${s.monthBtn} ${month === i + 1 ? s.active : ""}`}
                        style={month === i + 1 ? { background: accent, borderColor: accent } as React.CSSProperties : undefined}
                    >
                        {name}
                    </button>
                ))}
            </div>

            {/* Légumes */}
            <div className={s.sectionTitle}>Légumes de saison <span className={s.sectionTitleLine} /></div>
            <p className={s.sectionSub}>{MONTH_FULL[month - 1]} · {SEASON_LBL[month]} · {inSeason.length} légumes</p>
            <div className={s.veggieGrid}>
                {inSeason.map(v => {
                    const sel = selected.has(v.name);
                    return (
                        <div
                            key={v.name}
                            onClick={() => toggleVeg(v.name)}
                            className={`${s.veggieCard} ${sel ? s.selected : ""}`}
                            style={sel ? { borderColor: accent, background: `${accent}18` } : undefined}
                        >
                            <span className={s.veggieEmoji}>{v.emoji}</span>
                            <span className={s.veggieName} style={sel ? { color: accent } : undefined}>{v.name}</span>
                            <div className={s.veggieDots}>
                                {Array.from({ length: 12 }, (_, i) => {
                                    const on  = v.months.includes((i + 1) as typeof v.months[number]);
                                    const now = i + 1 === month;
                                    return (
                                        <span
                                            key={i}
                                            className={`${s.veggieDot} ${on ? s.on : ""} ${now && on ? s.now : ""}`}
                                            style={on ? { background: accent, ...(now ? { boxShadow: `0 0 0 2px ${accent}44` } : {}) } : undefined}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            <p className={s.hint}>
                {selected.size === 0
                    ? "⚠️ Sélectionnez au moins un légume"
                    : `${selected.size} légume${selected.size > 1 ? "s" : ""} sélectionné${selected.size > 1 ? "s" : ""}`}
            </p>

            {/* Préférences */}
            <div className={s.prefsRow}>
                <select className={s.select} value={diet} onChange={e => setDiet(e.target.value as Diet)}>
                    <option value="omnivore">🍖 Omnivore</option>
                    <option value="vegetarien">🥦 Végétarien</option>
                    <option value="vegan">🌱 Vegan</option>
                    <option value="sans-gluten">🌾 Sans gluten</option>
                </select>
                <select className={s.select} value={persons} onChange={e => setPersons(Number(e.target.value))}>
                    <option value={1}>👤 1 personne</option>
                    <option value={2}>👥 2 personnes</option>
                    <option value={4}>👨‍👩‍👧‍👦 4 personnes</option>
                </select>
                <select className={s.select} value={days} onChange={e => setDays(Number(e.target.value))}>
                    <option value={3}>3 jours</option>
                    <option value={5}>5 jours</option>
                    <option value={7}>7 jours</option>
                </select>
            </div>

            {/* Bouton générer */}
            <button
                onClick={handleGenerate}
                disabled={isLoading || selected.size === 0}
                className={s.generateBtn}
                style={{ background: `linear-gradient(135deg, #1e3b1e, ${accent})` }}
            >
                {isLoading ? "⏳ Searching for recipes…" : "✨ Generate my balanced menu"}
            </button>

            {/* Bouton refresh — visible uniquement si un menu existe */}
            {menu && (
                <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className={s.refreshBtn}
                >
                    🔄 Generate a different menu
                </button>
            )}

            {isError && <div className={s.error}>⚠️ Erreur lors de la génération. Vérifiez votre clé API ou réessayez.</div>}

            {isLoading && (
                <div className={s.loading}>
                    <div className={s.spinner} style={{ borderTopColor: accent }} />
                    <p>Recherche des meilleures recettes de saison…</p>
                </div>
            )}

            {/* Menu */}
            {menu?.map((dayMenu, i) => (
                <DayCard
                    key={`${menuId}_${i}`}
                    dayMenu={dayMenu}
                    dayIdx={i}
                    menuId={menuId!}
                    diet={diet}
                    persons={persons}
                    defaultOpen={i === 0}
                    accent={accent}
                    isFav={isFav(`${menuId}_${i}`)}
                    onFavToggle={onFavToggle}
                    month={month}
                    monthName={MONTH_FULL[month - 1]}
                />
            ))}
        </div>
    );
}