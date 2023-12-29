import { create } from "zustand";

type FightBoxesStore = {
  selectedIds: Set<number>;
  setSelectedIds: (idsToSelect: number[]) => void;
  removeId: (idToRemove: number) => void;
  addId: (idToAdd: number) => void;
};

const useFightBoxesStore = create<FightBoxesStore>((set) => ({
  selectedIds: new Set<number>(),
  setSelectedIds: (idsToSelect) => set({ selectedIds: new Set(idsToSelect) }),
  removeId: (idToRemove) =>
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      newSelectedIds.delete(idToRemove);
      return { selectedIds: newSelectedIds };
    }),
  addId: (idToAdd) =>
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      newSelectedIds.add(idToAdd);
      return { selectedIds: newSelectedIds };
    }),
}));

export default useFightBoxesStore;
