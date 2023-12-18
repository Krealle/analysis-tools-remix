import { create } from "zustand";
import { TimeSkipIntervals } from "../util/types";
import {
  ABILITY_BLACKLIST,
  ABILITY_NO_BOE_SCALING,
  ABILITY_NO_EM_SCALING,
  ABILITY_NO_SCALING,
  ABILITY_NO_SHIFTING_SCALING,
} from "../util/constants";

type FightParametersStore = {
  timeSkipIntervals: TimeSkipIntervals[];
  parameterError: boolean;
  parameterErrorMsg: string;
  showOptions: boolean;
  enemyBlacklist: number[];
  abilityBlacklist: string;
  abilityNoScaling: string;
  abilityNoBoEScaling: string;
  abilityNoEMScaling: string;
  abilityNoShiftingScaling: string;
  ebonMightWeight: number;
  intervalTimer: number;
  deathCountFilter: string;
  setTimeSkipIntervals: (payload: TimeSkipIntervals[]) => void;
  addTimeSkipInterval: (payload: TimeSkipIntervals) => void;
  removeTimeSkipInterval: (payload: number) => void;
  changeTimeSkipInterval: (payload: {
    index: number;
    entry: "start" | "end";
    value: string;
  }) => void;
  setParameterError: (payload: boolean) => void;
  setParameterErrorMsg: (payload: string) => void;
  setShowOptions: (payload: boolean) => void;
  modifyEnemyBlacklist: (payload: { value: number; add: boolean }) => void;
  setAbilityBlacklist: (payload: string) => void;
  setAbilityNoScaling: (payload: string) => void;
  setAbilityNoBoEScaling: (payload: string) => void;
  setAbilityNoEMScaling: (payload: string) => void;
  setAbilityNoShiftingScaling: (payload: string) => void;
  setEbonMightWeight: (payload: number) => void;
  setIntervalTimer: (payload: number) => void;
  setDeathCountFilter: (payload: string) => void;
};

const useFightParametersStore = create<FightParametersStore>((set) => ({
  timeSkipIntervals: [],
  parameterError: false,
  parameterErrorMsg: "",
  showOptions: false,
  enemyBlacklist: [],
  abilityBlacklist: ABILITY_BLACKLIST.toString(),
  abilityNoScaling: ABILITY_NO_SCALING.toString(),
  abilityNoBoEScaling: ABILITY_NO_BOE_SCALING.toString(),
  abilityNoEMScaling: ABILITY_NO_EM_SCALING.toString(),
  abilityNoShiftingScaling: ABILITY_NO_SHIFTING_SCALING.toString(),
  ebonMightWeight: 0.5,
  intervalTimer: 30,
  deathCountFilter: "",

  /** Time skips */
  setTimeSkipIntervals: (payload) => set({ timeSkipIntervals: payload }),
  addTimeSkipInterval: (payload) =>
    set((state) => ({
      timeSkipIntervals: [...state.timeSkipIntervals, payload],
    })),
  removeTimeSkipInterval: (payload) =>
    set((state) => ({
      timeSkipIntervals: state.timeSkipIntervals.splice(payload, 1),
    })),
  changeTimeSkipInterval: (payload) =>
    set((state) => {
      const { index, entry, value } = payload;
      const newIntervals = [...state.timeSkipIntervals];
      if (entry === "start") {
        newIntervals[index].start = value;
      } else {
        newIntervals[index].end = value;
      }
      return { timeSkipIntervals: newIntervals };
    }),

  /** Errors */
  setParameterError: (payload) => set({ parameterError: payload }),
  setParameterErrorMsg: (payload) => set({ parameterErrorMsg: payload }),

  /** Options state */
  setShowOptions: (payload) => set({ showOptions: payload }),

  /** Filters */
  modifyEnemyBlacklist: (payload) =>
    set((state) => ({
      enemyBlacklist: payload.add
        ? [...state.enemyBlacklist, payload.value]
        : state.enemyBlacklist.filter((item) => item !== payload.value),
    })),
  setAbilityBlacklist: (payload) => set({ abilityBlacklist: payload }),
  setAbilityNoScaling: (payload) => set({ abilityNoScaling: payload }),
  setAbilityNoBoEScaling: (payload) => set({ abilityNoBoEScaling: payload }),
  setAbilityNoEMScaling: (payload) => set({ abilityNoEMScaling: payload }),
  setAbilityNoShiftingScaling: (payload) =>
    set({ abilityNoShiftingScaling: payload }),
  setEbonMightWeight: (payload) => set({ ebonMightWeight: payload }),
  setIntervalTimer: (payload) => set({ intervalTimer: payload }),
  setDeathCountFilter: (payload) => set({ deathCountFilter: payload }),
}));

export default useFightParametersStore;
