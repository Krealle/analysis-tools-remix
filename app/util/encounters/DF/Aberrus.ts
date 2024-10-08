import { EncounterMap, EnemyType } from "../types";
import { createEnemy } from "../encounters";
import { PhaseEventTrigger } from "../../../analysis/util/generatePhaseEvents";
import { EventType } from "../../../wcl/types/events/eventEnums";

export const AberrusEncounterNames = {
  "Kazzara, the Hellforged": "Kazzara, the Hellforged",
  "Assault of the Zaqali": "Assault of the Zaqali",
  "Rashok, the Elder": "Rashok, the Elder",
  "The Amalgamation Chamber": "The Amalgamation Chamber",
  "The Forgotten Experiments": "The Forgotten Experiments",
  "The Vigilant Steward, Zskarn": "The Vigilant Steward, Zskarn",
  Magmorax: "Magmorax",
  "Echo of Neltharion": "Echo of Neltharion",
  "Scalecommander Sarkareth": "Scalecommander Sarkareth",
} as const;

export const Aberrus: EncounterMap = new Map([
  [
    AberrusEncounterNames["Kazzara, the Hellforged"],
    {
      name: AberrusEncounterNames["Kazzara, the Hellforged"],
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-kazzara-the-hellforged.png",
      enemies: [createEnemy(201261, "Kazzara, the Hellforged", EnemyType.Boss)],
    },
  ],
  [
    AberrusEncounterNames["Assault of the Zaqali"],
    {
      name: AberrusEncounterNames["Assault of the Zaqali"],
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-assault-of-the-zaqali.png",
      enemies: [
        createEnemy(199659, "Warlord Kagni", EnemyType.Boss),
        createEnemy(200840, "Flamebound Huntsman", EnemyType.Add),
        createEnemy(199703, "Magma Mystic", EnemyType.Add),
        createEnemy(200836, "Obsidian Guard", EnemyType.Add),
        createEnemy(199812, "Zaqali Wallclimber", EnemyType.Add),
      ],
    },
  ],
  [
    AberrusEncounterNames["Rashok, the Elder"],
    {
      name: AberrusEncounterNames["Rashok, the Elder"],
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-rashok-the-elder.png",
      enemies: [createEnemy(201320, "Rashok", EnemyType.Boss)],
    },
  ],
  [
    AberrusEncounterNames["The Amalgamation Chamber"],
    {
      name: AberrusEncounterNames["The Amalgamation Chamber"],
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-the-amalgamation-chamber.png",
      enemies: [
        createEnemy(201774, "Essence of Shadow", EnemyType.Boss),
        createEnemy(201773, "Eternal Blaze", EnemyType.Boss),
        createEnemy(201934, "Shadowflame Amalgamation", EnemyType.Boss),
      ],
    },
  ],
  [
    AberrusEncounterNames["The Forgotten Experiments"],
    {
      name: AberrusEncounterNames["The Forgotten Experiments"],
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-the-forgotten-experiments.png",
      enemies: [
        createEnemy(200912, "Neldris", EnemyType.Boss),
        createEnemy(200918, "Rionthus", EnemyType.Boss),
        createEnemy(200913, "Thadrion", EnemyType.Boss),
        createEnemy(202824, "Erratic Remnant", EnemyType.Add),
      ],
    },
  ],
  [
    AberrusEncounterNames["The Vigilant Steward, Zskarn"],
    {
      name: AberrusEncounterNames["The Vigilant Steward, Zskarn"],
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-the-vigilant-steward-zskarn.png",
      enemies: [
        createEnemy(202375, "Zskarn", EnemyType.Boss),
        createEnemy(203230, "Dragonfire Golem", EnemyType.Add),
      ],
    },
  ],
  [
    AberrusEncounterNames.Magmorax,
    {
      name: AberrusEncounterNames.Magmorax,
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-magmorax.png",
      enemies: [createEnemy(201579, "Magmorax", EnemyType.Boss)],
    },
  ],
  [
    AberrusEncounterNames["Echo of Neltharion"],
    {
      name: AberrusEncounterNames["Echo of Neltharion"],
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-echo-of-neltharion.png",
      enemies: [
        createEnemy(201668, "Neltharion", EnemyType.Boss),
        createEnemy(202814, "Twisted Aberration", EnemyType.Add),
        createEnemy(203812, "Voice From Beyond", EnemyType.Add),
      ],
    },
  ],
  [
    AberrusEncounterNames["Scalecommander Sarkareth"],
    {
      name: AberrusEncounterNames["Scalecommander Sarkareth"],
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-scalecommander-sarkareth.png",
      enemies: [
        createEnemy(201754, "Sarkareth", EnemyType.Boss),
        createEnemy(202969, "Empty Recollection", EnemyType.Add),
        createEnemy(202971, "Null Glimmer", EnemyType.Add),
      ],
    },
  ],
]);

export const AberrusPhaseTriggers: PhaseEventTrigger[] = [
  //region AMALGAMATION
  {
    triggerEventType: [EventType.ApplyBuffEvent],
    triggerEventId: [406730],
    previousPhase: "Phase 1",
    nextPhase: "Immune",
    isDamageable: false,
    bossName: AberrusEncounterNames["The Amalgamation Chamber"],
    maximumPhases: 1,
  },
  {
    triggerEventType: [EventType.RemoveBuffEvent],
    triggerEventId: [406730],
    previousPhase: "Immune",
    nextPhase: "Phase 2",
    isDamageable: true,
    bossName: AberrusEncounterNames["The Amalgamation Chamber"],
    maximumPhases: 1,
  },
  //region ASSAULT
  {
    triggerEventType: [EventType.ApplyBuffEvent],
    triggerEventId: [409359],
    previousPhase: "Phase 1",
    nextPhase: "Phase 2",
    isDamageable: true,
    bossName: AberrusEncounterNames["Assault of the Zaqali"],
    maximumPhases: 1,
  },
  //region ECHO
  {
    triggerEventType: [EventType.CastEvent],
    triggerEventId: [409313],
    previousPhase: "Phase 1",
    nextPhase: "Phase 2",
    isDamageable: true,
    bossName: AberrusEncounterNames["Echo of Neltharion"],
    maximumPhases: 1,
  },
  {
    triggerEventType: [EventType.RemoveBuffEvent],
    triggerEventId: [404045],
    previousPhase: "Phase 2",
    nextPhase: "Phase 3",
    isDamageable: true,
    bossName: AberrusEncounterNames["Echo of Neltharion"],
    maximumPhases: 1,
  },
  //region SARKARETH
  {
    triggerEventType: [EventType.ApplyBuffEvent],
    triggerEventId: [403284],
    previousPhase: "Phase 1",
    nextPhase: "Under 1",
    isDamageable: false,
    bossName: AberrusEncounterNames["Scalecommander Sarkareth"],
    maximumPhases: 1,
  },
  {
    triggerEventType: [EventType.RemoveBuffEvent],
    triggerEventId: [410625],
    previousPhase: "Under 1",
    nextPhase: "Phase 2",
    isDamageable: true,
    bossName: AberrusEncounterNames["Scalecommander Sarkareth"],
    maximumPhases: 1,
  },
  {
    triggerEventType: [EventType.ApplyBuffEvent],
    triggerEventId: [410654],
    previousPhase: "Phase 2",
    nextPhase: "Under 2",
    isDamageable: false,
    bossName: AberrusEncounterNames["Scalecommander Sarkareth"],
    maximumPhases: 1,
  },
  {
    triggerEventType: [EventType.RemoveBuffEvent],
    triggerEventId: [410654],
    previousPhase: "Under 2",
    nextPhase: "Phase 3",
    isDamageable: true,
    bossName: AberrusEncounterNames["Scalecommander Sarkareth"],
    maximumPhases: 1,
  },
];
