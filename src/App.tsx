import { useState } from "react";
import { PlannerTab } from "@/components/PlannerTab";
import { FavsTab }    from "@/components/FavsTab";
import { useFavs }    from "@/hooks/useFavs";
import type { FavItem } from "@/types";
import s from "@/styles/App.module.css";

type Tab = "planner" | "favs";

export default function App() {
  const [tab, setTab] = useState<Tab>("planner");
  const { favs, addFav, removeFav, isFav } = useFavs();

  const handleFavToggle = (fav: FavItem) => {
    isFav(fav.id) ? removeFav(fav.id) : addFav(fav);
  };

  return (
    <div className={s.app}>
      <div className={s.wrap}>

        {/* Tabs */}
        <div className={s.tabsBar}>
          {(["planner", "favs"] as Tab[]).map((id, i) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`${s.tab} ${tab === id ? s.active : ""}`}
            >
              {id === "planner" ? "🌿 Mon menu" : (
                <>❤️ Favoris <span className={s.tabBadge}>{favs.length}</span></>
              )}
            </button>
          ))}
        </div>

        {tab === "planner"
          ? <PlannerTab onFavToggle={handleFavToggle} isFav={isFav} />
          : <FavsTab    favs={favs} onDelete={removeFav} />
        }
      </div>
    </div>
  );
}
