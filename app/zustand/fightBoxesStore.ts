import { create } from "zustand";

type FightBoxesStore = {
  selectedIds: number[];
  setSelectedIds: (idsToSelect: number[]) => void;
  removeId: (idToRemove: number) => void;
  addId: (idToAdd: number) => void;
};

const useFightBoxesStore = create<FightBoxesStore>((set) => ({
  selectedIds: [],
  setSelectedIds: (idsToSelect) => set({ selectedIds: idsToSelect }),
  removeId: (idToRemove) =>
    set((state) => ({
      selectedIds: state.selectedIds.filter((id) => id !== idToRemove),
    })),
  addId: (idToAdd) =>
    set((state) => ({ selectedIds: state.selectedIds.concat(idToAdd) })),
}));

export default useFightBoxesStore;
