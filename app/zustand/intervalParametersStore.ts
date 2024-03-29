import { create } from "zustand";
import { initialEncounterEbonMightWindows } from "./interval/defaultIntervals";
import { EncounterNames } from "../util/encounters/encounters";
import { Static, Type } from "@sinclair/typebox";
import { validateIntervalFormat } from "./interval/validation";
import { EncounterName } from "../util/encounters/types";

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

type Setting = "Window Length" | "Window Delay" | "Threads";
type SettingValue<T extends Setting> = T extends "Threads" ? boolean : number;
export type AutoGenWindowSettings = {
  "Window Length": number;
  "Window Delay": number;
  Threads: boolean;
};

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

  selectedInterval: string;
  changeSelectedInterval: (fight: EncounterName) => void;
  intervalToUse: string;
  changeIntervalToUse: (fight: EncounterName) => void;

  autoGenWindowSettings: AutoGenWindowSettings;
  setAutoGenSetting: <T extends Setting>(
    setting: T,
    value: SettingValue<T>
  ) => void;
};

const useIntervalParametersStore = create<intervalParametersStore>((set) => ({
  setEbonMightWindow: (phase, index, window) => {
    set((state) => {
      const windows =
        state.encounterEbonMightWindows[state.selectedInterval][phase];
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
        state.encounterEbonMightWindows[state.selectedInterval][phase];
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
        state.encounterEbonMightWindows[state.selectedInterval][phase];
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

          // When changes to data structure have been made
          // We need to ensure that the local format is synced with new format
          Object.entries(initialEncounterEbonMightWindows).forEach(
            ([encounterName, defaultValue]) => {
              if (!maybeProperInput[encounterName]) {
                console.warn(
                  `Added missing encounter entry for ${encounterName}!`
                );
                maybeProperInput[encounterName] = defaultValue;
              } else {
                // Sometimes phases are added after the fact, we should therefor put in the new phases.
                const currentLocalPhases = Object.entries(
                  maybeProperInput[encounterName]
                );
                const currentInitialPhases = Object.entries(defaultValue);
                const phaseDifference =
                  currentInitialPhases.length - currentLocalPhases.length;

                if (phaseDifference > 0) {
                  console.warn(
                    `Phase difference detected for ${encounterName}! Adding missing phases.`
                  );
                  for (
                    let i = currentInitialPhases.length - phaseDifference;
                    i > 0;
                    i -= 1
                  ) {
                    maybeProperInput[encounterName][i] = defaultValue[i];
                  }
                }
              }
            }
          );

          state.writeToLocalStorage(maybeProperInput);
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

  selectedInterval: EncounterNames.Default,
  changeSelectedInterval: (fight) => {
    set({
      selectedInterval: fight,
    });
  },
  intervalToUse: EncounterNames.Default,
  changeIntervalToUse: (fight) => {
    set({
      selectedInterval: fight,
      intervalToUse: fight,
    });
  },

  autoGenWindowSettings: {
    "Window Length": 24,
    "Window Delay": 4,
    Threads: true,
  },
  setAutoGenSetting: (setting, value) => {
    set((state) => ({
      autoGenWindowSettings: {
        ...state.autoGenWindowSettings,
        [setting]: value,
      },
    }));
  },
}));

export default useIntervalParametersStore;
