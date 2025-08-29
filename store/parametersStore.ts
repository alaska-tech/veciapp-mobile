import { create } from "zustand";
import { refreshParameters } from "~/actions/parameter.action";
import { Parameter } from "~/constants/models";

interface ParametersState {
  loading: boolean;
  error: string | null;
  parameters: Parameter[];
  initParameters: () => Promise<void>;
  refresh: () => void;
}

export const useParametersStore = create<ParametersState>((set, get) => {
  return {
    loading: false,
    error: null,
    parameters: [],
    initParameters: async () => {
      set({ loading: true, error: null });

      try {
        const data = await refreshParameters();
        console.log("Favorite data:", data);
        set({ parameters: data || [] });
      } catch (err) {
        console.log("Error cargando favoritos:", err);
      } finally {
        set({ loading: false });
      }
    },
    refresh: () => {
      const {  initParameters } = get();
      initParameters();
    },
  };
});
