import { EncounterMap, EnemyType } from "./types";
import { createEnemy } from "./enemyTables";

export const AberrusEncounterNames = {
  Kazzara: "Kazzara",
  AssaultOfTheZaqali: "Assault of the Zaqali",
  RashokTheElder: "Rashok, the Elder",
  TheAmalgamationChamber: "The Amalgamation Chamber",
  TheForgottenExperiments: "The Forgotten Experiments",
  TheVigilantStewardZskarn: "The Vigilant Steward, Zskarn",
  Magmorax: "Magmorax",
  EchoOfNeltharion: "Echo of Neltharion",
  ScalecommanderSarkareth: "Scalecommander Sarkareth",
} as const;

export const Abberus: EncounterMap = new Map([
  [
    AberrusEncounterNames.Kazzara,
    {
      name: AberrusEncounterNames.Kazzara,
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-kazzara-the-hellforged.png",
      enemies: [createEnemy(201261, "Kazzara, the Hellforged", EnemyType.Boss)],
    },
  ],
  [
    AberrusEncounterNames.AssaultOfTheZaqali,
    {
      name: AberrusEncounterNames.AssaultOfTheZaqali,
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
    AberrusEncounterNames.RashokTheElder,
    {
      name: AberrusEncounterNames.RashokTheElder,
      id: -1,
      image:
        "https://wow.zamimg.com/images/wow/journal/ui-ej-boss-rashok-the-elder.png",
      enemies: [createEnemy(201320, "Rashok", EnemyType.Boss)],
    },
  ],
  [
    AberrusEncounterNames.TheAmalgamationChamber,
    {
      name: AberrusEncounterNames.TheAmalgamationChamber,
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
    AberrusEncounterNames.TheForgottenExperiments,
    {
      name: AberrusEncounterNames.TheForgottenExperiments,
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
    AberrusEncounterNames.TheVigilantStewardZskarn,
    {
      name: AberrusEncounterNames.TheVigilantStewardZskarn,
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
    AberrusEncounterNames.EchoOfNeltharion,
    {
      name: AberrusEncounterNames.EchoOfNeltharion,
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
    AberrusEncounterNames.ScalecommanderSarkareth,
    {
      name: AberrusEncounterNames.ScalecommanderSarkareth,
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
