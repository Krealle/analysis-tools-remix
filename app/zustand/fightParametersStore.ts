import { create } from "zustand";
import { TimeSkipIntervals } from "../util/types";
import {
  ABILITY_BLACKLIST,
  ABILITY_NO_BOE_SCALING,
  ABILITY_NO_EM_SCALING,
  ABILITY_NO_SCALING,
  ABILITY_NO_SHIFTING_SCALING,
  EBON_MIGHT_CORRECTION_VALUE,
  PRESCIENCE_CORRECTION_VALUE,
  SHIFTING_SANDS_CORRECTION_VALUE,
} from "../util/constants";

type FightParametersStore = {
  timeSkipIntervals: TimeSkipIntervals[];
  parameterError: string | undefined;
  showOptions: boolean;
  enemyBlacklist: number[];
  abilityBlacklist: string;
  abilityNoScaling: string;
  abilityNoBoEScaling: string;
  abilityNoEMScaling: string;
  abilityNoShiftingScaling: string;
  intervalEbonMightWeight: number;
  intervalTimer: number;
  deathCountFilter: string;
  ebonMightWeight: number;
  shiftingSandsWeight: number;
  prescienceWeight: number;
  setTimeSkipIntervals: (payload: TimeSkipIntervals[]) => void;
  addTimeSkipInterval: (payload: TimeSkipIntervals) => void;
  removeTimeSkipInterval: (payload: number) => void;
  changeTimeSkipInterval: (payload: {
    index: number;
    entry: "start" | "end";
    value: string;
  }) => void;
  setParameterError: (payload: string | undefined) => void;
  setShowOptions: (payload: boolean) => void;
  modifyEnemyBlacklist: (payload: { value: number; add: boolean }) => void;
  setAbilityBlacklist: (payload: string) => void;
  setAbilityNoScaling: (payload: string) => void;
  setAbilityNoBoEScaling: (payload: string) => void;
  setAbilityNoEMScaling: (payload: string) => void;
  setAbilityNoShiftingScaling: (payload: string) => void;
  setIntervalEbonMightWeight: (payload: number) => void;
  setEbonMightWeight: (payload: number) => void;
  setShiftingSandsWeight: (payload: number) => void;
  setPrescienceWeight: (payload: number) => void;
  setIntervalTimer: (payload: number) => void;
  setDeathCountFilter: (payload: string) => void;
};

const useFightParametersStore = create<FightParametersStore>((set) => ({
  timeSkipIntervals: [],
  parameterError: undefined,
  parameterErrorMsg: "",
  showOptions: false,
  enemyBlacklist: [],
  abilityBlacklist: ABILITY_BLACKLIST.toString(),
  abilityNoScaling: ABILITY_NO_SCALING.toString(),
  abilityNoBoEScaling: ABILITY_NO_BOE_SCALING.toString(),
  abilityNoEMScaling: ABILITY_NO_EM_SCALING.toString(),
  abilityNoShiftingScaling: ABILITY_NO_SHIFTING_SCALING.toString(),
  intervalEbonMightWeight: 0.5,
  intervalTimer: 30,
  deathCountFilter: "",
  ebonMightWeight: EBON_MIGHT_CORRECTION_VALUE,
  shiftingSandsWeight: SHIFTING_SANDS_CORRECTION_VALUE,
  prescienceWeight: PRESCIENCE_CORRECTION_VALUE,

  /** Time skips */
  setTimeSkipIntervals: (payload) => set({ timeSkipIntervals: payload }),
  addTimeSkipInterval: (payload) =>
    set((state) => ({
      timeSkipIntervals: [...state.timeSkipIntervals, payload],
    })),
  removeTimeSkipInterval: (payload) =>
    set((state) => ({
      timeSkipIntervals: state.timeSkipIntervals.filter(
        (_, idx) => idx !== payload
      ),
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
  setIntervalTimer: (payload) => set({ intervalTimer: payload }),
  setDeathCountFilter: (payload) => set({ deathCountFilter: payload }),

  /** Weights */
  setIntervalEbonMightWeight: (payload) =>
    set({ intervalEbonMightWeight: payload }),
  setEbonMightWeight: (payload) => set({ ebonMightWeight: payload }),
  setShiftingSandsWeight: (payload) => set({ shiftingSandsWeight: payload }),
  setPrescienceWeight: (payload) => set({ prescienceWeight: payload }),
}));

export default useFightParametersStore;
