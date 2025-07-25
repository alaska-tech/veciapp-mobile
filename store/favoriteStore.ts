import { create } from "zustand";

export interface FavoriteItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  discount?: number;
  branchId: string;
}

interface FavoriteState {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string | number) => void;
}

export const useFavoriteStore = create<FavoriteState>((set) => {
  return {
    favorites: [],
    addFavorite: (item) =>
      set((state) => {
        // Evitar duplicados por id
        if (state.favorites.some((fav) => fav.id === item.id)) return state;
        return { favorites: [...state.favorites, item] };
      }),
    removeFavorite: (id) =>
      set((state) => ({
        favorites: state.favorites.filter((fav) => fav.id !== id),
      })),
  };
});
