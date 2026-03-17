import {useCallback, useState} from "react";
import type {FavItem} from "@/types";

const STORAGE_KEY = "ssv_favs";

function loadFavs(): FavItem[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
        return [];
    }
}

function persistFavs(favs: FavItem[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

// Séparé du cache TanStack Query car les favoris sont
// une donnée utilisateur, pas une donnée distante.
export function useFavs() {
    const [favs, setFavsState] = useState<FavItem[]>(loadFavs);

    const setFavs = useCallback((updater: FavItem[] | ((prev: FavItem[]) => FavItem[])) => {
        setFavsState(prev => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            persistFavs(next);
            return next;
        });
    }, []);

    const addFav = useCallback((fav: FavItem) => {
        setFavs(prev => [fav, ...prev.filter(f => f.id !== fav.id)]);
    }, [setFavs]);

    const removeFav = useCallback((id: string) => {
        setFavs(prev => prev.filter(f => f.id !== id));
    }, [setFavs]);

    const isFav = useCallback((id: string) => {
        return favs.some(f => f.id === id);
    }, [favs]);

    return {favs, addFav, removeFav, isFav};
}
