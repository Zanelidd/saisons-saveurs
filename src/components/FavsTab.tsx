import {useTranslation} from "react-i18next";
import type {FavItem} from "@/types";
import s from "@/styles/FavsTab.module.css";

interface FavsTabProps {
    favs: FavItem[];
    onDelete: (id: string) => void;
}

export function FavsTab({favs, onDelete}: FavsTabProps) {
    const {t} = useTranslation();

    if (favs.length === 0) {
        return (
            <div className={s.empty}>
                <span className={s.emptyIcon}>🌿</span>
                <p style={{whiteSpace: "pre-line"}}>{t("favs.empty")}</p>
            </div>
        );
    }

    return (
        <div className={s.wrap}>
            <div className={s.sectionTitle}>
                {t("favs.title")}
                <span className={s.sectionTitleLine}/>
            </div>
            {favs.map(fav => {
                const plats = Object.values(fav.repas).map(meal => meal.plat);
                return (
                    <div key={fav.id} className={s.item}>
                        <div className={s.itemHeader}>
                            <div>
                                <div className={s.itemTitle}>❤️ {fav.jour} — {fav.monthName}</div>
                                <div className={s.itemMeta}>
                                    {t("favs.meta", {persons: fav.persons, diet: fav.diet, date: fav.savedAt})}
                                </div>
                            </div>
                            <button className={s.deleteBtn} onClick={() => onDelete(fav.id)}>
                                {t("favs.delete")}
                            </button>
                        </div>
                        <div className={s.tags}>
                            {plats.map((plat, i) => <span key={i} className={s.tag}>{plat}</span>)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}