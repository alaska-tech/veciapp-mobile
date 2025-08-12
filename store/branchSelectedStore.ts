import { create } from "zustand";
import { Branch } from "~/constants/models";
import { persist, PersistOptions } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface BranchSelectedState {
  branch?: Branch;
  set: (branch: Branch) => void;
  clear: () => void;
}
type MyPersist = PersistOptions<BranchSelectedState>;
export const useBranchSelectedStore = create<BranchSelectedState>()(
  persist<BranchSelectedState, [], [], MyPersist>(
    (set) => ({
      branch: undefined,
      set: (branch) => set({ branch }),
      clear: () => set({ branch: undefined }),
    }),
    {
      name: "branchSelectedStore",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
