import { EncounterNames } from "../../util/enemyTables";
import { EncounterEbonMightWindows } from "../intervalParametersStore";

export const initialEncounterEbonMightWindows: EncounterEbonMightWindows = {
  [EncounterNames.Kazzara]: {
    0: [{ start: 4, end: 34, useBreath: true }],
  },
  [EncounterNames.AssaultOfTheZaqali]: {
    0: [{ start: 4, end: 34, useBreath: true }],
  },
  [EncounterNames.RashokTheElder]: {
    0: [{ start: 4, end: 34, useBreath: true }],
  },
  [EncounterNames.TheAmalgamationChamber]: {
    0: [{ start: 4, end: 34, useBreath: true }],
  },
  [EncounterNames.TheForgottenExperiments]: {
    0: [{ start: 4, end: 34, useBreath: true }],
  },
  [EncounterNames.TheVigilantStewardZskarn]: {
    0: [{ start: 4, end: 34, useBreath: true }],
  },
  [EncounterNames.Magmorax]: {
    0: [{ start: 4, end: 34, useBreath: true }],
  },
  [EncounterNames.EchoOfNeltharion]: {
    0: [{ start: 4, end: 34, useBreath: true }],
  },
  [EncounterNames.ScalecommanderSarkareth]: {
    0: [{ start: 4, end: 34, useBreath: true }],
  },
  [EncounterNames.Gnarlroot]: {
    0: [{ start: 4, end: 34, useBreath: true }],
  },
  [EncounterNames.IgiraTheCruel]: {
    0: [{ start: 4, end: 34, useBreath: true }],
  },
  [EncounterNames.Volcoross]: {
    0: [{ start: 4, end: 34, useBreath: true }],
  },
  [EncounterNames.CouncilOfDreams]: {
    0: [{ start: 4, end: 34, useBreath: true }],
  },
  [EncounterNames.LarodarKeeperOfTheFlame]: {
    0: [{ start: 4, end: 34, useBreath: true }],
  },
  [EncounterNames.NymueWeaverOfTheCycle]: {
    0: [{ start: 4, end: 34, useBreath: true }],
  },
  [EncounterNames.Smolderon]: {
    0: [{ start: 4, end: 34, useBreath: true }],
  },
  [EncounterNames.TindralSageswiftSeerOfTheFlame]: {
    0: [{ start: 4, end: 34, useBreath: true }],
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
