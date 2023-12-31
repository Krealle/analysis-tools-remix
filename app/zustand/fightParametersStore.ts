import { create } from "zustand";
import { TimeSkipIntervals } from "../util/types";
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

const initTS: TimeSkipIntervals[] = [
  { start: "0:01", end: "0:03" },
  { start: "0:36", end: "0:37" },
  { start: "1:01", end: "1:07" },
  { start: "1:34", end: "1:39" },
  { start: "2:04", end: "2:08" },
];

type FightParametersStore = {
  timeSkipIntervals: TimeSkipIntervals[];
  parameterError: string | undefined;
  showOptions: boolean;
  enemyBlacklist: Set<number>;
  abilityFilters: AbilityFilters<string>;
  weights: Weights;
  intervalEbonMightWeight: number;
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
  setParameterError: (payload: string | undefined) => void;
  setShowOptions: (payload: boolean) => void;
  modifyEnemyBlacklist: (payload: { value: number; add: boolean }) => void;
  setAbilityFilter: (payload: {
    ability: keyof AbilityFilters<string>;
    value: string;
  }) => void;
  setIntervalEbonMightWeight: (payload: number) => void;
  setWeights: (payload: { ability: keyof Weights; value: string }) => void;
  setIntervalTimer: (payload: number) => void;
  setDeathCountFilter: (payload: string) => void;
};

const useFightParametersStore = create<FightParametersStore>((set) => ({
  timeSkipIntervals: initTS,
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
  intervalEbonMightWeight: 0.5,
  intervalTimer: 40,
  deathCountFilter: "",
  weights: {
    ebonMightWeight: EBON_MIGHT_CORRECTION_VALUE,
    shiftingSandsWeight: SHIFTING_SANDS_CORRECTION_VALUE,
    prescienceWeight: PRESCIENCE_CORRECTION_VALUE,
  },

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
  setIntervalTimer: (payload) => set({ intervalTimer: payload }),
  setDeathCountFilter: (payload) => set({ deathCountFilter: payload }),

  /** Weights */
  setIntervalEbonMightWeight: (payload) =>
    set({ intervalEbonMightWeight: payload }),
  setWeights: (payload) =>
    set((state) => ({
      weights: {
        ...state.weights,
        [payload.ability]: payload.value,
      },
    })),
}));

export default useFightParametersStore;
