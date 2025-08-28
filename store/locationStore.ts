import { create } from "zustand";
import * as Location from "expo-location";

interface LocationState {
  customerId: string | null;
  loading: boolean;
  error: string | null;
  location: [number, number] | null;
  getLocation: (clientId: string) => Promise<void>;
  refresh: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => {
  async function getCurrentLocation(): Promise<[number, number] | undefined> {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw { error: "Permission to access location was denied" };
      }
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      console.log("Current location:", latitude, longitude);
      return [latitude, longitude];
    } catch (error) {
      throw { error: "Error getting location" };
    }
  }
  return {
    customerId: null,
    loading: false,
    error: null,
    location: null,
    getLocation: async (clientId: string) => {
      set({ loading: true, error: null, customerId: clientId });
      try {
        const response = await getCurrentLocation();
        if (!response) return;
        set({ location: response });
      } catch (err) {
        console.log("Error cargando favoritos:", err);
      } finally {
        set({ loading: false });
      }
    },
    refresh: () => {
      const { customerId, getLocation: initFavorites } = get();
      if (customerId) {
        initFavorites(customerId);
      }
    },
  };
});
