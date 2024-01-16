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
  // p1
  { start: 4, end: 34, useBreath: true },
  { start: 38, end: 65, useBreath: false },
  { start: 68, end: 94, useBreath: false },
  { start: 100, end: 124, useBreath: false },
  { start: 129, end: 150, useBreath: false },
]);
initialEbonMightWindows.set(1, [{ start: 2, end: 33, useBreath: true }]); //i1
initialEbonMightWindows.set(2, [
  //p2
  { start: 1, end: 27, useBreath: false },
]);
initialEbonMightWindows.set(3, [
  // colossus 1
  { start: 1, end: 26, useBreath: false },
  { start: 30, end: 55, useBreath: false },
]);
initialEbonMightWindows.set(4, [
  // colossus 2
  { start: 1, end: 34, useBreath: true },
  { start: 35, end: 60, useBreath: false },
  { start: 64, end: 90, useBreath: false },
]);
initialEbonMightWindows.set(5, [
  // p3
  { start: 0, end: 27, useBreath: false },
  { start: 39, end: 72, useBreath: true },
  { start: 68, end: 95, useBreath: false },
  { start: 97, end: 124, useBreath: false },
  { start: 130, end: 157, useBreath: false },
  { start: 164, end: 190, useBreath: true },
  { start: 197, end: 224, useBreath: false },
  { start: 226, end: 253, useBreath: false },
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
