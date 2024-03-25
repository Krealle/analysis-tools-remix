import { create } from "zustand";
import { CombatantSpec } from "../analysis/combatant/combatantEnums";

export enum AugBuffs {
  EBON_MIGHT = 395152,
  SHIFTING_SANDS = 413984,
  PRESCIENCE = 410089,
}

export type AugBuffValue = Record<AugBuffs, number>;

export type BuffEfficiencyMap = Map<CombatantSpec, AugBuffValue>;
const initialBuffEfficiencyMap: BuffEfficiencyMap = new Map();
for (const spec of Object.values(CombatantSpec)) {
  initialBuffEfficiencyMap.set(spec, {
    [AugBuffs.EBON_MIGHT]: 0,
    [AugBuffs.SHIFTING_SANDS]: 0,
    [AugBuffs.PRESCIENCE]: 0,
  });
}

type BuffEfficiencyStore = {
  buffEfficiencyMap: BuffEfficiencyMap;
  setBuffEfficiencyForSpec: (
    value: number,
    spec: CombatantSpec,
    buff: AugBuffs
  ) => void;
};

const useBuffEfficiencyStore = create<BuffEfficiencyStore>((set) => ({
  buffEfficiencyMap: initialBuffEfficiencyMap,
  setBuffEfficiencyForSpec: (value, spec, buff) =>
    set((state) => {
      const newMap = new Map(state.buffEfficiencyMap);
      const augBuffValue = newMap.get(spec)!;
      newMap.set(spec, { ...augBuffValue, [buff]: value });
      return { buffEfficiencyMap: newMap };
    }),
}));

export default useBuffEfficiencyStore;
