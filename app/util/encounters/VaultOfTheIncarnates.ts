import { EncounterMap, EnemyType } from "./types";
import { createEnemy } from "./enemyTables";

export const VOTIEncounterNames = {
  Eranog: "Eranog",
  Terros: "Terros",
  "The Primal Council": "The Primal Council",
  "Sennarth, The Cold Breath": "Sennarth, The Cold Breath",
  "Dathea, Ascended": "Dathea, Ascended",
  "Kurog Grimtotem": "Kurog Grimtotem",
  "Broodkeeper Diurna": "Broodkeeper Diurna",
  "Raszageth the Storm-Eater": "Raszageth the Storm-Eater",
} as const;

export const VaultOfTheIncarnate: EncounterMap = new Map([
  [
    VOTIEncounterNames.Eranog,
    {
      name: VOTIEncounterNames.Eranog,
      id: -1,
      image: "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-eranog.png",
      enemies: [
        createEnemy(201261, VOTIEncounterNames.Eranog, EnemyType.Boss),
        createEnemy(187638, "Flamescale Tarasek", EnemyType.Add),
        createEnemy(199233, "Flamescale Captain", EnemyType.Add),
        createEnemy(187593, "Primal Flame", EnemyType.Add),
      ],
      wclPhases: {
        P1: "Army of Talon",
        P2: "Army of Flame",
      },
      intervalPhases: [
        "Phase 1",
        "Intermission 1",
        "Phase 2",
        "Intermission 2",
        "Phase 3",
      ],
    },
  ],
  [
    VOTIEncounterNames.Terros,
    {
      name: VOTIEncounterNames.Terros,
      id: -1,
      image: "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-terros.png",
      enemies: [createEnemy(190496, VOTIEncounterNames.Terros, EnemyType.Boss)],
    },
  ],
  [
    VOTIEncounterNames["The Primal Council"],
    {
      name: VOTIEncounterNames["The Primal Council"],
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-theprimalcouncil.png",
      enemies: [
        createEnemy(187771, "Kadros Icewrath", EnemyType.Boss),
        createEnemy(187768, "Dathea Stormlash", EnemyType.Boss),
        createEnemy(187772, "Opalfang", EnemyType.Boss),
        createEnemy(187767, "Embar Firepath", EnemyType.Boss),
      ],
    },
  ],
  [
    VOTIEncounterNames["Sennarth, The Cold Breath"],
    {
      name: VOTIEncounterNames["Sennarth, The Cold Breath"],
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-sennarththecoldbreath.png",
      enemies: [
        createEnemy(
          187967,
          VOTIEncounterNames["Sennarth, The Cold Breath"],
          EnemyType.Boss
        ),
        createEnemy(199333, "Frostbreath Arachnid", EnemyType.Add),
        createEnemy(189233, "Caustic Spiderling", EnemyType.Add),
      ],
      wclPhases: {
        P1: "Ice Climbers",
        P2: "The Frozen Precipice",
      },
      intervalPhases: ["Phase 1", "Phase 2"],
    },
  ],
  [
    VOTIEncounterNames["Dathea, Ascended"],
    {
      name: VOTIEncounterNames["Dathea, Ascended"],
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-datheaascended.png",
      enemies: [
        createEnemy(
          189813,
          VOTIEncounterNames["Dathea, Ascended"],
          EnemyType.Boss
        ),
        createEnemy(194647, "Thunder Caller", EnemyType.Add),
        createEnemy(197671, "Volatile Infuser", EnemyType.Add),
        createEnemy(192934, "Volatile Infuser(Dormant)", EnemyType.Add),
      ],
      /** maybe add phases for platforms */
    },
  ],
  [
    VOTIEncounterNames["Kurog Grimtotem"],
    {
      name: VOTIEncounterNames["Kurog Grimtotem"],
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-kuroggrimtotem.png",
      enemies: [
        createEnemy(
          184986,
          VOTIEncounterNames["Kurog Grimtotem"],
          EnemyType.Boss
        ),
        createEnemy(190688, "Blazing Fiend", EnemyType.Add),
        createEnemy(190586, "Earth Breaker", EnemyType.Add),
        createEnemy(197595, "Earthwrought Smasher", EnemyType.Add),
        createEnemy(198311, "Flamewrought Eradicator", EnemyType.Add),
        createEnemy(190686, "Frozen Destroyer", EnemyType.Add),
        createEnemy(191510, "Smoldering Hellion", EnemyType.Add),
        createEnemy(190588, "Tectonic Crusher", EnemyType.Add),
        createEnemy(190690, "Thundering Ravager", EnemyType.Add),
      ],
      wclPhases: {
        P1: "Elemental Dominance",
        P2: "Elemental Creations",
        P3: "The Primal End",
      },
      intervalPhases: [
        "Phase 1",
        "Intermission 1",
        "Phase 2",
        "Intermission 2",
        "Phase 3",
      ],
    },
  ],
  [
    VOTIEncounterNames["Broodkeeper Diurna"],
    {
      name: VOTIEncounterNames["Broodkeeper Diurna"],
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-broodkeeperdiurna.png",
      enemies: [
        createEnemy(
          190245,
          VOTIEncounterNames["Broodkeeper Diurna"],
          EnemyType.Boss
        ),
        createEnemy(191230, "Dragonspawn Flamebender", EnemyType.Add),
        createEnemy(191232, "Drakonid Stormbringer", EnemyType.Add),
        createEnemy(196679, "Frozen Shroud", EnemyType.Add),
        createEnemy(191222, "Juvenile Frost Proto-Dragon", EnemyType.Add),
        createEnemy(201155, "Nascent Proto-Dragon", EnemyType.Add),
        createEnemy(191206, "Primalist Mage", EnemyType.Add),
        createEnemy(191225, "Tarasek Earthreaver", EnemyType.Add),
        createEnemy(191215, "Tarasek Legionnaire", EnemyType.Add),
      ],
      wclPhases: {
        P1: "The Primalist Clutch",
        P2: "A Broodkeeper Scorned",
      },
      intervalPhases: ["Phase 1", "Phase 2"],
    },
  ],
  [
    VOTIEncounterNames["Raszageth the Storm-Eater"],
    {
      name: VOTIEncounterNames["Raszageth the Storm-Eater"],
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-raszageththestorm-eater.png",
      enemies: [
        createEnemy(
          189492,
          VOTIEncounterNames["Raszageth the Storm-Eater"],
          EnemyType.Boss
        ),
        createEnemy(197145, "Colossal Stormfiend", EnemyType.Add),
        createEnemy(200943, "Electrified Colossal Stormfiend", EnemyType.Add),
        createEnemy(199549, "Flamesworn Herald", EnemyType.Add),
        createEnemy(199547, "Frostforged Zealot", EnemyType.Add),
        createEnemy(194991, "Oathsworn Vanguard", EnemyType.Add),
        createEnemy(191714, "Seeking Stormling", EnemyType.Add),
        createEnemy(194990, "Stormseeker Acolyte", EnemyType.Add),
        createEnemy(193760, "Surging Ruiner", EnemyType.Add),
        createEnemy(194999, "Volatile Spark", EnemyType.Add),
      ],
      wclPhases: {
        P1: "The Winds of Change",
        I1: "The Primalist Strike",
        P2: "Surging Power",
        I2: "The Vault Falters",
        P3: "Storm Incarnate",
      },
      /** Maybe add shields as phase, but they are kind short so idk */
      intervalPhases: [
        "Phase 1",
        "Intermission 1",
        "Phase 2",
        "Intermission 2",
        "Phase 3",
      ],
    },
  ],
]);
