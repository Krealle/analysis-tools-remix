import { create } from "zustand";

type FightBoxesStore = {
  selectedIds: Set<number>;
  setSelectedIds: (idsToSelect: number[]) => void;
  removeId: (idToRemove: number) => void;
  addId: (idToAdd: number) => void;

  /** Map of fight names for whether they are collapsed
   * This map gets initialized when fight boxes are rendered
   * key: fight name
   * value: true if collapsed */
  collapsedFights: Map<string, boolean>;
  collapseFight: (fightName: string, shouldCollapse?: boolean) => void;
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

  collapsedFights: new Map<string, boolean>(),
  collapseFight: (fightName, shouldCollapse) =>
    set((state) => {
      const newCollapsedFights = new Map(state.collapsedFights);

      const isCollapsed = newCollapsedFights.get(fightName);

      newCollapsedFights.set(
        fightName,
        shouldCollapse ?? !isCollapsed ?? false
      );

      return { collapsedFights: newCollapsedFights };
    }),
}));

export default useFightBoxesStore;
