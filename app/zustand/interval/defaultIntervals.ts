import { EncounterNames } from "../../util/encounters/encounters";
import { EncounterEbonMightWindows } from "../intervalParametersStore";

const initialVOTI: EncounterEbonMightWindows = {
  [EncounterNames.Eranog]: {
    0: [], // p1
    1: [], // i1
    2: [], // p2
    3: [], // i2
    4: [], // p3
  },
  [EncounterNames.Terros]: {
    0: [],
  },
  [EncounterNames["The Primal Council"]]: {
    0: [],
  },
  [EncounterNames["Sennarth, The Cold Breath"]]: {
    0: [], // p1
    1: [], // p2
  },
  [EncounterNames["Dathea, Ascended"]]: {
    0: [],
  },
  [EncounterNames["Kurog Grimtotem"]]: {
    0: [], // p1
    1: [], // i1
    2: [], // p2
    3: [], // i2
    4: [], // p3
  },
  [EncounterNames["Broodkeeper Diurna"]]: {
    0: [], // p1
    1: [], // p2
  },
  [EncounterNames["Raszageth the Storm-Eater"]]: {
    0: [], // p1
    1: [], // i1
    2: [], // p2
    3: [], // i2
    4: [], // p3
  },
};

export const initialEncounterEbonMightWindows: EncounterEbonMightWindows = {
  [EncounterNames.Default]: {
    0: [],
  },
  [EncounterNames.Kazzara]: {
    0: [],
  },
  [EncounterNames["Assault of the Zaqali"]]: {
    0: [],
  },
  [EncounterNames["Rashok, the Elder"]]: {
    0: [],
  },
  [EncounterNames["The Amalgamation Chamber"]]: {
    0: [],
  },
  [EncounterNames["The Forgotten Experiments"]]: {
    0: [],
  },
  [EncounterNames["The Vigilant Steward, Zskarn"]]: {
    0: [],
  },
  [EncounterNames.Magmorax]: {
    0: [],
  },
  [EncounterNames["Echo of Neltharion"]]: {
    0: [],
  },
  [EncounterNames["Scalecommander Sarkareth"]]: {
    0: [],
  },
  [EncounterNames.Gnarlroot]: {
    0: [],
  },
  [EncounterNames["Igira the Cruel"]]: {
    0: [],
  },
  [EncounterNames.Volcoross]: {
    0: [],
  },
  [EncounterNames["Council of Dreams"]]: {
    0: [],
  },
  [EncounterNames["Larodar, Keeper of the Flame"]]: {
    0: [],
  },
  [EncounterNames["Nymue, Weaver of the Cycle"]]: {
    0: [],
  },
  [EncounterNames.Smolderon]: {
    0: [],
  },
  [EncounterNames["Tindral Sageswift, Seer of the Flame"]]: {
    0: [],
    1: [],
    2: [],
  },
  [EncounterNames["Fyrakk the Blazing"]]: {
    0: [
      // p1
      { start: 4, end: 34, useBreath: true },
      { start: 38, end: 65, useBreath: false },
      { start: 68, end: 94, useBreath: false },
    ],
    1: [{ start: 2, end: 33, useBreath: true }], // i1
    2: [
      // p2
      { start: 1, end: 27, useBreath: false },
    ],
    3: [
      // colossus 1
      { start: 1, end: 26, useBreath: false },
      { start: 30, end: 55, useBreath: false },
    ],
    4: [
      // colossus 2
      { start: 1, end: 34, useBreath: true },
      { start: 35, end: 60, useBreath: false },
      { start: 64, end: 90, useBreath: false },
    ],
    5: [
      // p3
      { start: 0, end: 27, useBreath: false },
      { start: 39, end: 72, useBreath: true },
      { start: 68, end: 95, useBreath: false },
      { start: 97, end: 124, useBreath: false },
      { start: 130, end: 157, useBreath: false },
      { start: 164, end: 190, useBreath: true },
      { start: 197, end: 224, useBreath: false },
      { start: 226, end: 253, useBreath: false },
    ],
  },
  ...initialVOTI,
};
