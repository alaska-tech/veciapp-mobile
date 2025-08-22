import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  toggleLoading: () => void;
}

export const useGlobalLoadingScreen = create<LoadingState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  toggleLoading: () => set((state) => ({ isLoading: !state.isLoading })),
}));
