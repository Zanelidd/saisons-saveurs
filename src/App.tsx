import {useState} from "react";
import {useTranslation} from "react-i18next";
import {PlannerTab} from "@/components/PlannerTab";
import {FavsTab} from "@/components/FavsTab";
import {LangSwitcher} from "@/components/LangSwitcher";
import {useFavs} from "@/hooks/useFavs";

import s from "@/styles/App.module.css";
import type {FavItem} from "@/types/fav.types.ts";

type Tab = "planner" | "favs";

export default function App() {
    const [tab, setTab] = useState<Tab>("planner");
    const {favs, addFav, removeFav, isFav} = useFavs();
    const {t} = useTranslation();

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

                {/* Nav bar : spacer | tabs | lang */}
                <div className={s.navBar}>
                    <div className={s.navSpacer}/>

                    <div className={s.tabsBar}>
                        {(["planner", "favs"] as Tab[]).map((id) => (
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

                    <div className={s.langWrap}>
                        <LangSwitcher/>
                    </div>
                </div>

                {/* Contenu */}
                {tab === "planner"
                    ? <PlannerTab onFavToggle={handleFavToggle} isFav={isFav}/>
                    : <FavsTab favs={favs} onDelete={removeFav}/>
                }

            </div>
        </div>
    );
}