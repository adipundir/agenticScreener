import { create } from "zustand";

const useJobOpeningsStore = create((set) => ({
  jobOpenings: [], 
  myPostingsCount : 0,
  setJobOpenings: (jobOpenings : []) => set({ jobOpenings }), 
  setMyPostingsCount: (myPostingsCount : number) => set({ myPostingsCount }), 
}));

export default useJobOpeningsStore;
