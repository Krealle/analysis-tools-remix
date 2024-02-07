import { EncounterNames } from "../../util/enemyTables";
import { EncounterEbonMightWindows } from "../intervalParametersStore";

export const initialEncounterEbonMightWindows: EncounterEbonMightWindows = {
  [EncounterNames.Kazzara]: {
    0: [],
  },
  [EncounterNames.AssaultOfTheZaqali]: {
    0: [],
  },
  [EncounterNames.RashokTheElder]: {
    0: [],
  },
  [EncounterNames.TheAmalgamationChamber]: {
    0: [],
  },
  [EncounterNames.TheForgottenExperiments]: {
    0: [],
  },
  [EncounterNames.TheVigilantStewardZskarn]: {
    0: [],
  },
  [EncounterNames.Magmorax]: {
    0: [],
  },
  [EncounterNames.EchoOfNeltharion]: {
    0: [],
  },
  [EncounterNames.ScalecommanderSarkareth]: {
    0: [],
  },
  [EncounterNames.Gnarlroot]: {
    0: [],
  },
  [EncounterNames.IgiraTheCruel]: {
    0: [],
  },
  [EncounterNames.Volcoross]: {
    0: [],
  },
  [EncounterNames.CouncilOfDreams]: {
    0: [],
  },
  [EncounterNames.LarodarKeeperOfTheFlame]: {
    0: [],
  },
  [EncounterNames.NymueWeaverOfTheCycle]: {
    0: [],
  },
  [EncounterNames.Smolderon]: {
    0: [],
  },
  [EncounterNames.TindralSageswiftSeerOfTheFlame]: {
    0: [],
    1: [],
    2: [],
  },
  [EncounterNames.FyrakkTheBlazing]: {
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
};
