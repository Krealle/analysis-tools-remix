import { create } from "zustand";

/** Phase, Ebon Might Windows */
export type EbonMightWindowsMap = Map<number, EbonMightWindow[]>;
export type EbonMightWindow = {
  start: number;
  end: number;
  useBreath: boolean;
  fabricated?: boolean;
};
const initialEbonMightWindows: EbonMightWindowsMap = new Map();
initialEbonMightWindows.set(0, [
  { start: 4, end: 33, useBreath: true },
  { start: 38, end: 61, useBreath: false },
  { start: 68, end: 94, useBreath: false },
  { start: 100, end: 124, useBreath: false },
  { start: 129, end: 150, useBreath: false },
]);
initialEbonMightWindows.set(1, [{ start: 4, end: 33, useBreath: true }]);
initialEbonMightWindows.set(2, [
  { start: 1, end: 26, useBreath: false },
  { start: 30, end: 55, useBreath: false },
]);
initialEbonMightWindows.set(3, [
  { start: 1, end: 26, useBreath: false },
  { start: 30, end: 55, useBreath: false },
]);
initialEbonMightWindows.set(4, [
  { start: 1, end: 34, useBreath: true },
  { start: 35, end: 60, useBreath: false },
]);
initialEbonMightWindows.set(5, [
  { start: 8, end: 34, useBreath: false },
  { start: 40, end: 65, useBreath: true },
  { start: 68, end: 94, useBreath: false },
  { start: 100, end: 124, useBreath: false },
]);

type intervalParametersStore = {
  ebonMightWindows: EbonMightWindowsMap;
  setEbonMightWindow: (
    phase: number,
    index: number,
    window: EbonMightWindow
  ) => void;
  addEbonMightWindow: (phase: number) => void;
  removeEbonMightWindow: (phase: number, index: number) => void;
  addPhase: () => void;
  removePhase: (phaseNum: number) => void;
};

const useIntervalParametersStore = create<intervalParametersStore>((set) => ({
  ebonMightWindows: initialEbonMightWindows,
  setEbonMightWindow: (phase, index, window) => {
    set((state) => {
      const windows = state.ebonMightWindows.get(phase);
      if (windows) {
        windows[index] = window;
      }
      return { ebonMightWindows: state.ebonMightWindows };
    });
  },
  addEbonMightWindow: (phase) => {
    set((state) => {
      const windows = state.ebonMightWindows.get(phase);
      if (windows) {
        windows.push({ start: 0, end: 0, useBreath: false });
      }
      return { ebonMightWindows: state.ebonMightWindows };
    });
  },
  removeEbonMightWindow: (phase, index) => {
    set((state) => {
      const windows = state.ebonMightWindows.get(phase);
      if (windows) {
        windows.splice(index, 1);
      }
      return { ebonMightWindows: state.ebonMightWindows };
    });
  },
  addPhase: () => {
    set((state) => {
      state.ebonMightWindows.set(state.ebonMightWindows.size, []);
      return { ebonMightWindows: state.ebonMightWindows };
    });
  },
  removePhase: (phaseNum) => {
    set((state) => {
      state.ebonMightWindows.delete(phaseNum);
      return { ebonMightWindows: state.ebonMightWindows };
    });
  },
}));

export default useIntervalParametersStore;
