import { EncounterMap, EnemyType } from "./types";
import { createEnemy } from "./enemyTables";

export const AmirdrassilEncounterNames = {
  Gnarlroot: "Gnarlroot",
  IgiraTheCruel: "Igira the Cruel",
  Volcoross: "Volcoross",
  CouncilOfDreams: "Council of Dreams",
  LarodarKeeperOfTheFlame: "Larodar, Keeper of the Flame",
  NymueWeaverOfTheCycle: "Nymue, Weaver of the Cycle",
  Smolderon: "Smolderon",
  TindralSageswiftSeerOfTheFlame: "Tindral Sageswift, Seer of the Flame",
  FyrakkTheBlazing: "Fyrakk the Blazing",
} as const;

export const Amirdrassil: EncounterMap = new Map([
  [
    AmirdrassilEncounterNames.Gnarlroot,
    {
      name: AmirdrassilEncounterNames.Gnarlroot,
      id: 2820,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-gnarlroot.png",
      enemies: [
        createEnemy(209333, "Gnarlroot", EnemyType.Boss),
        createEnemy(210231, "Tainted Lasher", EnemyType.Add),
        createEnemy(211904, "Tainted Treant", EnemyType.Add),
      ],
    },
  ],
  [
    AmirdrassilEncounterNames.IgiraTheCruel,
    {
      name: AmirdrassilEncounterNames.IgiraTheCruel,
      id: 2709,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-igira-the-cruel.png",
      enemies: [
        createEnemy(200926, "Igira the Cruel", EnemyType.Boss),
        createEnemy(207341, "Blistering Spear", EnemyType.Add),
      ],
    },
  ],
  [
    AmirdrassilEncounterNames.Volcoross,
    {
      name: AmirdrassilEncounterNames.Volcoross,
      id: 2737,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-volcoross.png",
      enemies: [createEnemy(208478, "Volcoross", EnemyType.Boss)],
    },
  ],
  [
    AmirdrassilEncounterNames.CouncilOfDreams,
    {
      name: AmirdrassilEncounterNames.CouncilOfDreams,
      id: 2728,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-council-of-dreams.png",
      enemies: [
        createEnemy(208365, "Aerwynn", EnemyType.Boss),
        createEnemy(208367, "Pip", EnemyType.Boss),
        createEnemy(208363, "Urctos", EnemyType.Boss),
      ],
    },
  ],
  [
    AmirdrassilEncounterNames.LarodarKeeperOfTheFlame,
    {
      name: AmirdrassilEncounterNames.LarodarKeeperOfTheFlame,
      id: 2731,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-larodar-keeper-of-the-flame.png",
      enemies: [
        createEnemy(208445, "Larodar, Keeper of the Flame", EnemyType.Boss),
        createEnemy(208459, "Fiery Treant", EnemyType.Add),
        createEnemy(208461, "Scorching Roots", EnemyType.Add),
      ],
      wclPhases: {
        P1: "The Cycle of Flame",
        I1: "Unreborn Again",
        P2: "Avatar of Ash",
      },
    },
  ],
  [
    AmirdrassilEncounterNames.NymueWeaverOfTheCycle,
    {
      name: AmirdrassilEncounterNames.NymueWeaverOfTheCycle,
      id: 2708,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-nymue-weaver-of-the-cycle.png",
      enemies: [
        createEnemy(206172, "Nymue", EnemyType.Boss),
        createEnemy(209800, "Cycle Warden", EnemyType.Add),
        createEnemy(213143, "Manifested Dream", EnemyType.Add),
      ],
    },
  ],
  [
    AmirdrassilEncounterNames.Smolderon,
    {
      name: AmirdrassilEncounterNames.Smolderon,
      id: 2824,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-smolderon.png",
      enemies: [createEnemy(200927, "Smolderon", EnemyType.Boss)],
    },
  ],
  [
    AmirdrassilEncounterNames.TindralSageswiftSeerOfTheFlame,
    {
      name: AmirdrassilEncounterNames.TindralSageswiftSeerOfTheFlame,
      id: 2786,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-tindral-sageswift-seer-of-flame.png",
      enemies: [
        createEnemy(209090, "Tindral Sageswift", EnemyType.Boss),
        createEnemy(211306, "Fiery Vines", EnemyType.Add),
        createEnemy(214441, "Scorched Treant", EnemyType.Add),
      ],
      wclPhases: {
        P1: "Moonkin of the Flame",
        I1: "Burning Pursuit",
        P2: "Tree of the Flame",
        I2: "Path of Flame",
        P3: "Seer of the Flame",
      },
      intervalPhases: ["Phase 1", "Phase 2", "Phase 3"],
    },
  ],
  [
    AmirdrassilEncounterNames.FyrakkTheBlazing,
    {
      name: AmirdrassilEncounterNames.FyrakkTheBlazing,
      id: 2677,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-fyrakk-the-burning.png",
      enemies: [
        createEnemy(204931, "Fyrakk", EnemyType.Boss),
        createEnemy(207796, "Burning Colossus", EnemyType.Add),
        createEnemy(214012, "Dark Colossus", EnemyType.Add),
        createEnemy(214608, "Screaming Soul", EnemyType.Add),
      ],
      wclPhases: {
        P1: "The Dream Render",
        I1: "Amirdrassil in Peril",
        P2: "Children of the Stars",
        P3: "Shadowflame Incarnate",
      },
      intervalPhases: [
        "Phase 1",
        "Intermission 1",
        "Phase 2",
        "Colossus set 1",
        "Colossus set 2",
        "Phase 3",
      ],
    },
  ],
]);