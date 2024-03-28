import { create } from "zustand";
import {
  ABILITY_BLACKLIST,
  ABILITY_NO_EM_SCALING,
  ABILITY_NO_SCALING,
  ABILITY_NO_SHIFTING_SCALING,
  EBON_MIGHT_CORRECTION_VALUE,
  PRESCIENCE_CORRECTION_VALUE,
  SHIFTING_SANDS_CORRECTION_VALUE,
} from "../util/constants";

export type AbilityFilters<T> = {
  noEbonMightScaling: T;
  noShiftingSandsScaling: T;
  noScaling: T;
  blacklist: T;
};

export type Weights = {
  ebonMightWeight: number;
  shiftingSandsWeight: number;
  prescienceWeight: number;
};

type FightParametersStore = {
  parameterError: string | undefined;
  showOptions: boolean;
  enemyBlacklist: Set<number>;
  abilityFilters: AbilityFilters<string>;
  weights: Weights;
  mrtPlayerAmount: number;
  deathCountFilter: string;

  setMrtPlayerAmount: (payload: number) => void;
  setParameterError: (payload: string | undefined) => void;
  setShowOptions: (payload: boolean) => void;
  modifyEnemyBlacklist: (payload: { value: number; add: boolean }) => void;
  setAbilityFilter: (payload: {
    ability: keyof AbilityFilters<string>;
    value: string;
  }) => void;
  setWeights: (payload: { ability: keyof Weights; value: string }) => void;
  setDeathCountFilter: (payload: string) => void;
};

const useFightParametersStore = create<FightParametersStore>((set) => ({
  parameterError: undefined,
  parameterErrorMsg: "",
  showOptions: false,
  enemyBlacklist: new Set<number>(),
  abilityFilters: {
    noEbonMightScaling: ABILITY_NO_EM_SCALING.toString(),
    noShiftingSandsScaling: ABILITY_NO_SHIFTING_SCALING.toString(),
    noScaling: ABILITY_NO_SCALING.toString(),
    blacklist: ABILITY_BLACKLIST.toString(),
  },
  mrtPlayerAmount: 2,
  deathCountFilter: "",
  weights: {
    ebonMightWeight: EBON_MIGHT_CORRECTION_VALUE,
    shiftingSandsWeight: SHIFTING_SANDS_CORRECTION_VALUE,
    prescienceWeight: PRESCIENCE_CORRECTION_VALUE,
  },

  setMrtPlayerAmount: (payload) => set({ mrtPlayerAmount: payload }),

  /** Errors */
  setParameterError: (payload) => set({ parameterError: payload }),

  /** Options state */
  setShowOptions: (payload) => set({ showOptions: payload }),

  /** Filters */
  modifyEnemyBlacklist: (payload) =>
    set((state) => {
      const newEnemyBlacklist = new Set(state.enemyBlacklist);
      if (payload.add) {
        newEnemyBlacklist.add(payload.value);
      } else {
        newEnemyBlacklist.delete(payload.value);
      }
      return { enemyBlacklist: newEnemyBlacklist };
    }),
  setAbilityFilter: (payload) =>
    set((state) => ({
      abilityFilters: {
        ...state.abilityFilters,
        [payload.ability]: payload.value,
      },
    })),
  setDeathCountFilter: (payload) => set({ deathCountFilter: payload }),

  /** Weights */
  setWeights: (payload) =>
    set((state) => ({
      weights: {
        ...state.weights,
        [payload.ability]: payload.value,
      },
    })),
}));

export default useFightParametersStore;
