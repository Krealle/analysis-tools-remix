import { EncounterMap, EnemyType } from "./types";
import { createEnemy } from "./encounters";
import { PhaseEventTrigger } from "../../analysis/util/generatePhaseEvents";
import { EventType } from "../../wcl/types/events/eventEnums";

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
        createEnemy(184972, VOTIEncounterNames.Eranog, EnemyType.Boss),
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
        createEnemy(188026, "Frost Tomb", EnemyType.Add),
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
        createEnemy(189234, "Frostbreath Arachnid", EnemyType.Add),
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

export const VaultOfTheIncarnatePhaseTriggers: PhaseEventTrigger[] = [
  //region ERANOG
  {
    triggerEventType: [EventType.CastEvent],
    triggerEventId: [370307],
    previousPhase: "Phase 1",
    nextPhase: "Phase 2",
    isDamageable: true,
    bossName: VOTIEncounterNames.Eranog,
    maximumPhases: 2,
  },
  {
    triggerEventType: [EventType.DeathEvent],
    triggerEventId: [],
    previousPhase: "Phase 2",
    nextPhase: "Phase 1",
    isDamageable: true,
    bossName: VOTIEncounterNames.Eranog,
    maximumPhases: 2,
    targetGuid: [187593],
  },
  //region SENNARTH
  {
    triggerEventType: [EventType.CastEvent, EventType.BeginCastEvent],
    triggerEventId: [372539],
    previousPhase: "Phase 1",
    nextPhase: "Phase 2",
    isDamageable: true,
    bossName: VOTIEncounterNames["Sennarth, The Cold Breath"],
    maximumPhases: 1,
  },
  //region KUROG
  {
    triggerEventType: [EventType.CastEvent],
    triggerEventId: [374779],
    previousPhase: "Phase",
    nextPhase: "Intermission",
    displayPhaseCount: 0,
    isDamageable: true,
    bossName: VOTIEncounterNames["Kurog Grimtotem"],
    maximumPhases: 2,
  },
  {
    triggerEventType: [EventType.RemoveBuffEvent],
    triggerEventId: [374779],
    previousPhase: "Intermission",
    nextPhase: "Phase",
    displayPhaseCount: 0,
    isDamageable: true,
    bossName: VOTIEncounterNames["Kurog Grimtotem"],
    maximumPhases: 2,
  },
  //region BROODKEEPER
  {
    triggerEventType: [EventType.RemoveBuffEvent],
    triggerEventId: [375809],
    previousPhase: "Phase 1",
    nextPhase: "Phase 2",
    isDamageable: true,
    bossName: VOTIEncounterNames["Broodkeeper Diurna"],
    maximumPhases: 1,
  },
  //region RASZAGETH
  {
    triggerEventType: [EventType.RemoveBuffEvent],
    triggerEventId: [381249],
    previousPhase: ["Phase 1", "Phase 2"],
    nextPhase: "Immune",
    isDamageable: false,
    bossName: VOTIEncounterNames["Raszageth the Storm-Eater"],
    maximumPhases: 2,
  },
  {
    triggerEventType: [EventType.CastEvent],
    triggerEventId: [382530],
    previousPhase: "Immune",
    nextPhase: "Intermission 1",
    isDamageable: true,
    bossName: VOTIEncounterNames["Raszageth the Storm-Eater"],
    maximumPhases: 1,
  },
  {
    /** Ideally this would be based on removal of Storm Shroud, but inconsistent push timings
     * means it can trigger well before Raz actually lands, so we trigger on Storm Scales cast
     * and make the phase change trigger 8s earlier, since this cast is consistent. */
    triggerEventType: [EventType.CastEvent],
    triggerEventId: [381249],
    previousPhase: "Intermission 1",
    nextPhase: "Phase 2",
    isDamageable: true,
    bossName: VOTIEncounterNames["Raszageth the Storm-Eater"],
    maximumPhases: 1,
    buffer: -8_000,
  },
  {
    triggerEventType: [EventType.ApplyBuffEvent],
    triggerEventId: [391281],
    previousPhase: "Immune",
    nextPhase: "Intermission 2",
    isDamageable: true,
    bossName: VOTIEncounterNames["Raszageth the Storm-Eater"],
    maximumPhases: 1,
  },
  {
    triggerEventType: [EventType.CastEvent],
    triggerEventId: [390463],
    previousPhase: "Intermission 2",
    nextPhase: "Knock Back",
    isDamageable: false,
    bossName: VOTIEncounterNames["Raszageth the Storm-Eater"],
    maximumPhases: 1,
  },
  {
    triggerEventType: [EventType.RemoveBuffEvent],
    triggerEventId: [396734],
    previousPhase: "Knock Back",
    nextPhase: "Phase 3",
    isDamageable: true,
    bossName: VOTIEncounterNames["Raszageth the Storm-Eater"],
    maximumPhases: 1,
  },
];
