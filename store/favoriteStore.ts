import { create } from "zustand";
import {
  addToFavorite,
  deleteFromFavorite,
  fetchFavoritesByCustomerId,
} from "~/actions/favorite.action";
import { FavoriteItem } from "~/constants/models";

interface FavoriteState {
  customerId: string | null;
  loading: boolean;
  error: string | null;
  favorites: FavoriteItem[];
  initFavorites: (clientId: string) => Promise<void>;
  refresh: () => void;
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (productServiceId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => {
  return {
    customerId: null,
    loading: false,
    error: null,
    favorites: [],
    initFavorites: async (clientId: string) => {
      set({ loading: true, error: null, customerId: clientId });

      try {
        const data = await fetchFavoritesByCustomerId({ customerId: clientId });
        console.log("Favorite data:", data);
        set({ favorites: data.data });
      } catch (err) {
        console.log("Error cargando favoritos:", err);
      } finally {
        set({ loading: false });
      }
    },
    refresh: () => {
      const { customerId } = get();
      if (customerId) {
        get().initFavorites(customerId);
      }
    },
    addFavorite: async (item) => {
      const { customerId } = get();
      if (!customerId) {
        throw new Error("There is not customerId");
      }
      set((state) => {
        // Evitar duplicados por id
        if (
          state.favorites.some(
            (fav) => fav.productServiceId === item.productServiceId
          )
        ) {
          return state;
        }
        return { favorites: [item, ...state.favorites] };
      });
      try {
        await addToFavorite({
          customerId,
          productServiceId: item.productServiceId,
        });
      } catch (error) {
        console.error("Error adding favorite by api:", error);
      }
    },
    removeFavorite: async (id) => {
      const { customerId } = get();
      if (!customerId) {
        throw new Error("There is not customerId");
      }
      set((state) => ({
        favorites: state.favorites.filter((fav) => fav.productServiceId !== id),
      }));
      try {
        await deleteFromFavorite({
          customerId,
          productServiceId: id,
        });
      } catch (error) {
        console.error("Error deleting favorite by api:", error);
      }
    },
    isFavorite: (productServiceId) => {
      return get().favorites.some(
        (fav) => fav.productServiceId === productServiceId
      );
    },
  };
});
