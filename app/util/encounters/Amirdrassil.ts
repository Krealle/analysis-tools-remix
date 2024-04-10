import { EncounterMap, EnemyType } from "./types";
import { createEnemy } from "./encounters";
import { PhaseEventTrigger } from "../../analysis/util/generatePhaseEvents";
import { EventType } from "../../wcl/types/events/eventEnums";

export const AmirdrassilEncounterNames = {
  Gnarlroot: "Gnarlroot",
  "Igira the Cruel": "Igira the Cruel",
  Volcoross: "Volcoross",
  "Council of Dreams": "Council of Dreams",
  "Larodar, Keeper of the Flame": "Larodar, Keeper of the Flame",
  "Nymue, Weaver of the Cycle": "Nymue, Weaver of the Cycle",
  Smolderon: "Smolderon",
  "Tindral Sageswift, Seer of the Flame":
    "Tindral Sageswift, Seer of the Flame",
  "Fyrakk the Blazing": "Fyrakk the Blazing",
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
    AmirdrassilEncounterNames["Igira the Cruel"],
    {
      name: AmirdrassilEncounterNames["Igira the Cruel"],
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
    AmirdrassilEncounterNames["Council of Dreams"],
    {
      name: AmirdrassilEncounterNames["Council of Dreams"],
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
    AmirdrassilEncounterNames["Larodar, Keeper of the Flame"],
    {
      name: AmirdrassilEncounterNames["Larodar, Keeper of the Flame"],
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
    AmirdrassilEncounterNames["Nymue, Weaver of the Cycle"],
    {
      name: AmirdrassilEncounterNames["Nymue, Weaver of the Cycle"],
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
    AmirdrassilEncounterNames["Tindral Sageswift, Seer of the Flame"],
    {
      name: AmirdrassilEncounterNames["Tindral Sageswift, Seer of the Flame"],
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
    AmirdrassilEncounterNames["Fyrakk the Blazing"],
    {
      name: AmirdrassilEncounterNames["Fyrakk the Blazing"],
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

export const AmirdrassilPhaseTriggers: PhaseEventTrigger[] = [
  //region TINDRAL
  {
    triggerEventType: [EventType.CastEvent],
    triggerEventId: [421636],
    previousPhase: "Phase",
    nextPhase: "Fly off",
    isDamageable: false,
    bossName: AmirdrassilEncounterNames["Tindral Sageswift, Seer of the Flame"],
    displayPhaseCount: 0,
    maximumPhases: 2,
  },
  {
    triggerEventType: [EventType.RemoveBuffEvent],
    triggerEventId: [421603],
    previousPhase: "Fly off",
    nextPhase: "Phase",
    isDamageable: true,
    bossName: AmirdrassilEncounterNames["Tindral Sageswift, Seer of the Flame"],
    displayPhaseCount: 1,
    maximumPhases: 2,
  },
  //region FYRAKK
  {
    triggerEventType: [EventType.CastEvent],
    triggerEventId: [412761],
    previousPhase: ["Phase 1", "Colossus set 2"],
    nextPhase: ["Fly off 1", "Fly off 3"],
    isDamageable: false,
    bossName: AmirdrassilEncounterNames["Fyrakk the Blazing"],
    maximumPhases: 2,
    customCondition: {
      cnd: (event, _eventTargetGuid, _eventSourceGuid, prevPhase): boolean => {
        // Fyrakk casts two Incarnate between summoning the 2nd colossus and transitioning into Fly Off 3
        // So we ignore the first one
        return !prevPhase || event.timestamp - prevPhase.timestamp > 20_000;
      },
    },
  },
  {
    triggerEventType: [EventType.DamageEvent],
    triggerEventId: [421831],
    previousPhase: "Fly off 1",
    nextPhase: "Intermission",
    isDamageable: true,
    bossName: AmirdrassilEncounterNames["Fyrakk the Blazing"],
    maximumPhases: 1,
    filter: `target.disposition = "friendly"
    AND target.type = "player"
    AND source.disposition != "friendly"`,
  },
  {
    triggerEventType: [EventType.RemoveBuffEvent],
    triggerEventId: [421922],
    previousPhase: "Intermission",
    nextPhase: "Fly off 2",
    isDamageable: false,
    bossName: AmirdrassilEncounterNames["Fyrakk the Blazing"],
    maximumPhases: 1,
  },
  {
    triggerEventType: [EventType.DamageEvent],
    triggerEventId: [419123],
    previousPhase: "Fly off 2",
    nextPhase: "Phase 2",
    isDamageable: true,
    bossName: AmirdrassilEncounterNames["Fyrakk the Blazing"],
    maximumPhases: 1,
    filter: `target.disposition = "friendly"
    AND target.type = "player"
    AND source.disposition != "friendly"`,
  },
  {
    triggerEventType: [EventType.CastEvent],
    triggerEventId: [422518],
    previousPhase: ["Phase 2", "Colossus set 1"],
    nextPhase: ["Colossus set 1", "Colossus set 2"],
    isDamageable: true,
    bossName: AmirdrassilEncounterNames["Fyrakk the Blazing"],
    maximumPhases: 2,
  },
  {
    triggerEventType: [EventType.CastEvent],
    triggerEventId: [422935],
    previousPhase: "Fly off 3",
    nextPhase: "Phase 3",
    isDamageable: true,
    bossName: AmirdrassilEncounterNames["Fyrakk the Blazing"],
    maximumPhases: 1,
  },
];
