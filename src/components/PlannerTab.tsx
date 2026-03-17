import {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "@tanstack/react-query";
import {DayCard} from "./DayCard";
import {buildMenuQueryKey, useMenu} from "@/hooks/useMenu";
import {getVeggiesForMonth} from "@/data/veggies.data";
import type {Diet, FavItem} from "@/types";
import s from "@/styles/PlannerTab.module.css";

const SEASON_ACCENT: Record<number, string> = {
    1: "#3a7aab", 2: "#3a7aab", 3: "#5a9e5a", 4: "#5a9e5a", 5: "#5a9e5a",
    6: "#d4922a", 7: "#d4922a", 8: "#d4922a",
    9: "#c0522a", 10: "#c0522a", 11: "#c0522a", 12: "#3a7aab",
};

const HEADER_GRADIENT: Record<number, string> = {
    1: "linear-gradient(150deg,#0e1e3b,#182c5c 55%,#284278)",
    2: "linear-gradient(150deg,#0e1e3b,#182c5c 55%,#284278)",
    3: "linear-gradient(150deg,#1e3b1e,#2e5c2e 55%,#4a7c3a)",
    4: "linear-gradient(150deg,#1e3b1e,#2e5c2e 55%,#4a7c3a)",
    5: "linear-gradient(150deg,#1e3b1e,#2e5c2e 55%,#4a7c3a)",
    6: "linear-gradient(150deg,#3b2a0e,#5c4418 55%,#7c5e28)",
    7: "linear-gradient(150deg,#3b2a0e,#5c4418 55%,#7c5e28)",
    8: "linear-gradient(150deg,#3b2a0e,#5c4418 55%,#7c5e28)",
    9: "linear-gradient(150deg,#3b1a0e,#5c2c18 55%,#7c4228)",
    10: "linear-gradient(150deg,#3b1a0e,#5c2c18 55%,#7c4228)",
    11: "linear-gradient(150deg,#3b1a0e,#5c2c18 55%,#7c4228)",
    12: "linear-gradient(150deg,#0e1e3b,#182c5c 55%,#284278)",
};

const LEAVES = [
    {emoji: "🌿", fontSize: 100, style: {top: -10, left: "4%", transform: "rotate(-18deg)"}},
    {emoji: "🍃", fontSize: 140, style: {bottom: -24, right: "6%", transform: "rotate(28deg)"}},
    {emoji: "🌱", fontSize: 56, style: {top: 18, right: "22%", transform: "rotate(8deg)"}},
];

const SEASON_KEY: Record<number, string> = {
    1: "winter", 2: "winter", 3: "spring", 4: "spring", 5: "spring",
    6: "summer", 7: "summer", 8: "summer",
    9: "autumn", 10: "autumn", 11: "autumn", 12: "winter",
};

interface PlannerTabProps {
    onFavToggle: (fav: FavItem) => void;
    isFav: (id: string) => boolean;
}

export function PlannerTab({onFavToggle, isFav}: PlannerTabProps) {
    const {t} = useTranslation();
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [selected, setSelected] = useState<Set<string>>(() =>
        new Set(getVeggiesForMonth(new Date().getMonth() + 1).map(v => v.name))
    );
    const [diet, setDiet] = useState<Diet>("omnivore");
    const [persons, setPersons] = useState<number>(2);
    const [days, setDays] = useState<number>(5);
    const [menuId, setMenuId] = useState<number | null>(null);
    const [enabled, setEnabled] = useState(false);

    const inSeason = useMemo(() => getVeggiesForMonth(month), [month]);
    const accent = SEASON_ACCENT[month];
    const queryClient = useQueryClient();
    const monthShort = t("months.short", {returnObjects: true}) as string[];
    const monthFull = t("months.full", {returnObjects: true}) as string[];

    const menuParams = {ingredients: Array.from(selected), diet, persons, days, month};

    const handleMonthChange = (m: number) => {
        setMonth(m);
        setSelected(new Set(getVeggiesForMonth(m).map(v => v.name)));
        setEnabled(false);
        setMenuId(null);
    };

    const toggleVeg = (name: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(name)) {
                next.delete(name);
            } else {
                next.add(name);
            }
            return next;
        });
    };

    const {data: menu, isLoading, isError} = useMenu(menuParams, enabled);

    const handleGenerate = () => {
        setMenuId(Date.now());
        setEnabled(true);
    };

    const handleRefresh = () => {
        queryClient.removeQueries({queryKey: buildMenuQueryKey(menuParams)});
        setMenuId(Date.now());
        setEnabled(true);
    };

    return (
        <div>
            {/* Header */}
            <div className={s.header} style={{background: HEADER_GRADIENT[month]}}>
                {LEAVES.map(({emoji, fontSize, style}, i) => (
                    <span key={i} className={s.headerLeaf} style={{fontSize, ...style}}>{emoji}</span>
                ))}
                <h1 className={s.headerTitle}>
                    {t("header.title").split(" & ").map((part, i) => (
                        i === 0 ? <span key={i}>{part} <em className={s.headerTitleEm}>&</em> </span> :
                            <span key={i}>{part}</span>
                    ))}
                </h1>
                <p className={s.headerSub}>{t("header.subtitle")}</p>
            </div>

            <div style={{height: 32}}/>

            {/* Mois */}
            <div className={s.sectionTitle}>{t("planner.month")} <span className={s.sectionTitleLine}/></div>
            <div className={s.monthStrip}>
                {monthShort.map((name, i) => (
                    <button
                        key={i}
                        onClick={() => handleMonthChange(i + 1)}
                        className={`${s.monthBtn} ${month === i + 1 ? s.active : ""}`}
                        style={month === i + 1 ? {
                            background: accent,
                            borderColor: accent
                        } as React.CSSProperties : undefined}
                    >
                        {name}
                    </button>
                ))}
            </div>

            {/* Légumes */}
            <div className={s.sectionTitle}>{t("planner.vegetables")} <span className={s.sectionTitleLine}/></div>
            <p className={s.sectionSub}>
                {t("planner.veggieSubtitle", {
                    month: monthFull[month - 1],
                    season: t(`season.${SEASON_KEY[month]}`),
                    count: inSeason.length,
                })}
            </p>
            <div className={s.veggieGrid}>
                {inSeason.map(v => {
                    const sel = selected.has(v.name);
                    return (
                        <div
                            key={v.name}
                            onClick={() => toggleVeg(v.name)}
                            className={`${s.veggieCard} ${sel ? s.selected : ""}`}
                            style={sel ? {borderColor: accent, background: `${accent}18`} : undefined}
                        >
                            <span className={s.veggieEmoji}>{v.emoji}</span>
                            <span className={s.veggieName} style={sel ? {color: accent} : undefined}>{v.name}</span>
                            <div className={s.veggieDots}>
                                {Array.from({length: 12}, (_, i) => {
                                    const on = v.months.includes((i + 1) as typeof v.months[number]);
                                    const now = i + 1 === month;
                                    return (
                                        <span
                                            key={i}
                                            className={`${s.veggieDot} ${on ? s.on : ""} ${now && on ? s.now : ""}`}
                                            style={on ? {background: accent, ...(now ? {boxShadow: `0 0 0 2px ${accent}44`} : {})} : undefined}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            <p className={s.hint}>
                {t("planner.hint", {count: selected.size})}
            </p>

            {/* Préférences */}
            <div className={s.prefsRow}>
                <select className={s.select} value={diet} onChange={e => setDiet(e.target.value as Diet)}>
                    <option value="omnivore">   {t("diet.omnivore")}</option>
                    <option value="vegetarien"> {t("diet.vegetarien")}</option>
                    <option value="vegan">      {t("diet.vegan")}</option>
                    <option value="sans-gluten">{t("diet.sans-gluten")}</option>
                </select>
                <select className={s.select} value={persons} onChange={e => setPersons(Number(e.target.value))}>
                    <option value={1}>{t("persons.one")}</option>
                    <option value={2}>{t("persons.two")}</option>
                    <option value={4}>{t("persons.four")}</option>
                </select>
                <select className={s.select} value={days} onChange={e => setDays(Number(e.target.value))}>
                    <option value={3}>{t("daysOption.three")}</option>
                    <option value={5}>{t("daysOption.five")}</option>
                    <option value={7}>{t("daysOption.seven")}</option>
                </select>
            </div>

            {/* Boutons */}
            <button
                onClick={handleGenerate}
                disabled={isLoading || selected.size === 0}
                className={s.generateBtn}
                style={{background: `linear-gradient(135deg, #1e3b1e, ${accent})`}}
            >
                {isLoading ? t("planner.generating") : t("planner.generate")}
            </button>

            {menu && (
                <button onClick={handleRefresh} disabled={isLoading} className={s.refreshBtn}>
                    {t("planner.refresh")}
                </button>
            )}

            {isError && <div className={s.error}>{t("planner.error")}</div>}

            {isLoading && (
                <div className={s.loading}>
                    <div className={s.spinner} style={{borderTopColor: accent}}/>
                    <p>{t("planner.searching")}</p>
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
                    monthName={monthFull[month - 1]}
                />
            ))}
        </div>
    );
}