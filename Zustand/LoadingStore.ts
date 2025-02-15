import { create } from "zustand";

const useLoadingStore = create((set) => ({
  isLoading: false,
  setIsLoading: (isLoading : boolean) => set({ isLoading }), 
}));

export default useLoadingStore;