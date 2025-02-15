import { create } from "zustand";

const useJobOpeningsStore = create((set) => ({
  jobOpenings: [], 
  setJobOpenings: (jobOpenings : []) => set({ jobOpenings }), 
}));

export default useJobOpeningsStore;
