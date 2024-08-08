import { EncounterMap, EnemyType } from "../types";
import { createEnemy } from "../encounters";
import { PhaseEventTrigger } from "../../../analysis/util/generatePhaseEvents";
import { EventType } from "../../../wcl/types/events/eventEnums";
import { EncounterEbonMightWindows } from "../../../zustand/intervalParametersStore";

export const NerubarPalaceEncounterNames = {
  "Ulgrax the Devourer": "Ulgrax the Devourer",
  "The Bloodbound Horror": "The Bloodbound Horror",
  "Sikran, Captain of the Sureki": "Sikran, Captain of the Sureki",
  "Rasha'nan": "Rasha'nan",
  "Broodtwister Ovi'nax": "Broodtwister Ovi'nax",
  "Nexus-Princess Ky'veza": "Nexus-Princess Ky'veza",
  "The Silken Court": "The Silken Court",
  "Queen Ansurek": "Queen Ansurek",
} as const;

export const NerubarPalace: EncounterMap = new Map([
  [
    NerubarPalaceEncounterNames["Ulgrax the Devourer"],
    {
      name: NerubarPalaceEncounterNames["Ulgrax the Devourer"],
      id: 2902,
      image: "",
      enemies: [
        createEnemy(215657, "Ulgrax the Devourer", EnemyType.Boss),
        createEnemy(216205, "Ravenous Spawn", EnemyType.Add),
        createEnemy(227300, "Bile-Soaked Spawn", EnemyType.Add),
      ],
    },
  ],
  [
    NerubarPalaceEncounterNames["The Bloodbound Horror"],
    {
      name: NerubarPalaceEncounterNames["The Bloodbound Horror"],
      id: 2917,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-the-bloodbound-horror.png",
      enemies: [
        createEnemy(214502, "Bloodbound Horror", EnemyType.Boss),
        createEnemy(221945, "Forgotten Harbinger", EnemyType.Add),
        createEnemy(221667, "Lost Watcher", EnemyType.Add),
        createEnemy(221986, "Blood Horror", EnemyType.Add),
      ],
    },
  ],
  [
    NerubarPalaceEncounterNames["Sikran, Captain of the Sureki"],
    {
      name: NerubarPalaceEncounterNames["Sikran, Captain of the Sureki"],
      id: 2898,
      image: "",
      enemies: [createEnemy(214503, "Sikran", EnemyType.Boss)],
    },
  ],
  [
    NerubarPalaceEncounterNames["Rasha'nan"],
    {
      name: NerubarPalaceEncounterNames["Rasha'nan"],
      id: 2918,
      image: "",
      enemies: [
        createEnemy(214504, "Rasha'nan", EnemyType.Boss),
        createEnemy(219739, "Infested Spawn", EnemyType.Add),
        createEnemy(226103, "Webbed Victim", EnemyType.Add),
      ],
    },
  ],
  [
    NerubarPalaceEncounterNames["Broodtwister Ovi'nax"],
    {
      name: NerubarPalaceEncounterNames["Broodtwister Ovi'nax"],
      id: 2919,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-broodtwister-ovinax.png",
      enemies: [
        createEnemy(214506, "Broodtwister Ovi'nax", EnemyType.Boss),
        createEnemy(219045, "Colossal Spider", EnemyType.Add),
        createEnemy(219046, "Voracious Worm", EnemyType.Add),
        createEnemy(220626, "Blood Parasite", EnemyType.Add),
      ],
    },
  ],
  [
    NerubarPalaceEncounterNames["Nexus-Princess Ky'veza"],
    {
      name: NerubarPalaceEncounterNames["Nexus-Princess Ky'veza"],
      id: 2920,
      image: "",
      enemies: [createEnemy(217748, "Nexus-Princess Ky'veza", EnemyType.Boss)],
    },
  ],
  [
    NerubarPalaceEncounterNames["The Silken Court"],
    {
      name: NerubarPalaceEncounterNames["The Silken Court"],
      id: 2921,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-the-silken-court.png",
      enemies: [
        createEnemy(217489, "Anub'arash", EnemyType.Boss),
        createEnemy(217491, "Skeinspinner Takazj", EnemyType.Boss),
        createEnemy(218884, "Shattershell Scarab", EnemyType.Add),
      ],
    },
  ],
  [
    NerubarPalaceEncounterNames["Queen Ansurek"],
    {
      name: NerubarPalaceEncounterNames["Queen Ansurek"],
      id: 2922,
      image: "",
      enemies: [createEnemy(219778, "Queen Ansurek", EnemyType.Boss)],
    },
  ],
]);

export const NerubarPalacePhaseTriggers: PhaseEventTrigger[] = [];

export const initialNerubarPalace: EncounterEbonMightWindows = {
  [NerubarPalaceEncounterNames["Broodtwister Ovi'nax"]]: {
    0: [], // p1
  },
  [NerubarPalaceEncounterNames["Nexus-Princess Ky'veza"]]: {
    0: [],
  },
  [NerubarPalaceEncounterNames["Queen Ansurek"]]: {
    0: [],
  },
  [NerubarPalaceEncounterNames["Rasha'nan"]]: {
    0: [], // p1
  },
  [NerubarPalaceEncounterNames["Sikran, Captain of the Sureki"]]: {
    0: [],
  },
  [NerubarPalaceEncounterNames["The Bloodbound Horror"]]: {
    0: [], // p1
  },
  [NerubarPalaceEncounterNames["The Silken Court"]]: {
    0: [], // p1
  },
  [NerubarPalaceEncounterNames["Ulgrax the Devourer"]]: {
    0: [], // p1
  },
};
