import { create } from "zustand";
import { initialEncounterEbonMightWindows } from "./interval/defaultIntervals";
import { EncounterNames } from "../util/enemyTables";
import { Static, Type } from "@sinclair/typebox";
import { validateIntervalFormat } from "./interval/validation";

const EbonMightWindow = Type.Object({
  start: Type.Number(),
  end: Type.Number(),
  useBreath: Type.Boolean(),
  fabricated: Type.Optional(Type.Boolean()),
});
export type EbonMightWindow = Static<typeof EbonMightWindow>;

const EbonMightWindowsMap = Type.Record(
  Type.Number(),
  Type.Array(EbonMightWindow)
);
export type EbonMightWindowsMap = Static<typeof EbonMightWindowsMap>;

export const EncounterEbonMightWindows = Type.Record(
  Type.String(),
  EbonMightWindowsMap
);
export type EncounterEbonMightWindows = Static<
  typeof EncounterEbonMightWindows
>;

type intervalParametersStore = {
  setEbonMightWindow: (
    phase: number,
    index: number,
    window: EbonMightWindow
  ) => void;
  addEbonMightWindow: (phase: number) => void;
  removeEbonMightWindow: (phase: number, index: number) => void;

  encounterEbonMightWindows: EncounterEbonMightWindows;
  writeToLocalStorage: (windows: EncounterEbonMightWindows) => void;
  restoreFromLocalStorage: () => void;
  importIntervals: (intervals: string) => void;

  selectedFight: string;
  changeFight: (fight: string) => void;
};

const useIntervalParametersStore = create<intervalParametersStore>((set) => ({
  setEbonMightWindow: (phase, index, window) => {
    set((state) => {
      const windows =
        state.encounterEbonMightWindows[state.selectedFight][phase];
      if (windows) {
        windows[index] = window;
        state.writeToLocalStorage(state.encounterEbonMightWindows);
      }

      return { encounterEbonMightWindows: state.encounterEbonMightWindows };
    });
  },
  addEbonMightWindow: (phase) => {
    set((state) => {
      const windows =
        state.encounterEbonMightWindows[state.selectedFight][phase];
      if (windows) {
        windows.push({ start: 0, end: 0, useBreath: false });
        state.writeToLocalStorage(state.encounterEbonMightWindows);
      }

      return { encounterEbonMightWindows: state.encounterEbonMightWindows };
    });
  },
  removeEbonMightWindow: (phase, index) => {
    set((state) => {
      const windows =
        state.encounterEbonMightWindows[state.selectedFight][phase];
      if (windows) {
        windows.splice(index, 1);
        state.writeToLocalStorage(state.encounterEbonMightWindows);
      }

      return { encounterEbonMightWindows: state.encounterEbonMightWindows };
    });
  },

  // This gets overridden by localStorage when a report is loaded
  // Can't do it directly cus Zustand throws hissy fits
  encounterEbonMightWindows: initialEncounterEbonMightWindows,
  writeToLocalStorage: (windows) => {
    localStorage.setItem("encounterEbonMightWindows", JSON.stringify(windows));
  },
  restoreFromLocalStorage: () => {
    set((state) => {
      const storedEncounterWindows = localStorage.getItem(
        "encounterEbonMightWindows"
      );
      if (storedEncounterWindows) {
        try {
          const parsedEncounterWindows = JSON.parse(storedEncounterWindows);
          const maybeProperInput = validateIntervalFormat(
            parsedEncounterWindows
          );

          if (!maybeProperInput) {
            throw new Error();
          }
          return { encounterEbonMightWindows: maybeProperInput };
        } catch (e) {
          // if somehow localStorage format is incorrect just default it
          // this should only be able to happen if someone tries to make changes
          // directly to their localStorage
          state.writeToLocalStorage(initialEncounterEbonMightWindows);
          return {
            encounterEbonMightWindows: initialEncounterEbonMightWindows,
          };
        }
      } else {
        state.writeToLocalStorage(initialEncounterEbonMightWindows);
        return { encounterEbonMightWindows: initialEncounterEbonMightWindows };
      }
    });
  },
  // type check is made before this fn is called
  importIntervals: (intervals) => {
    set((state) => {
      const parsedIntervals = JSON.parse(
        intervals
      ) as EncounterEbonMightWindows;

      state.writeToLocalStorage(parsedIntervals);
      return { encounterEbonMightWindows: parsedIntervals };
    });
  },

  selectedFight: EncounterNames.FyrakkTheBlazing,
  changeFight: (fight) => {
    set({
      selectedFight: fight,
    });
  },
}));

export default useIntervalParametersStore;
