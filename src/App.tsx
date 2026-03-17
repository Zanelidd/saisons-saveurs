import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlannerTab }   from "@/components/PlannerTab";
import { FavsTab }      from "@/components/FavsTab";
import { LangSwitcher } from "@/components/LangSwitcher";
import { useFavs }      from "@/hooks/useFavs";
import type { FavItem } from "@/types";
import s from "@/styles/App.module.css";

type Tab = "planner" | "favs";

export default function App() {
    const [tab, setTab]              = useState<Tab>("planner");
    const { favs, addFav, removeFav, isFav } = useFavs();
    const { t } = useTranslation();

    const handleFavToggle = (fav: FavItem) => {
        if (isFav(fav.id)) {
            removeFav(fav.id);
        } else {
            addFav(fav);
        }
    };

    return (
        <div className={s.app}>
            <div className={s.wrap}>

                {/* Tabs + LangSwitcher */}
                <div className={s.topBar}>
                    <div className={s.tabsBar}>
                        {(["planner", "favs"] as Tab[]).map((id, i) => (
                            <button
                                key={id}
                                onClick={() => setTab(id)}
                                className={`${s.tab} ${tab === id ? s.active : ""}`}
                            >
                                {id === "planner"
                                    ? `🌿 ${t("nav.planner")}`
                                    : <>❤️ {t("nav.favs")} <span className={s.tabBadge}>{favs.length}</span></>
                                }
                            </button>
                        ))}
                    </div>
                    <LangSwitcher />
                </div>

                {tab === "planner"
                    ? <PlannerTab onFavToggle={handleFavToggle} isFav={isFav} />
                    : <FavsTab    favs={favs} onDelete={removeFav} />
                }
            </div>
        </div>
    );
}