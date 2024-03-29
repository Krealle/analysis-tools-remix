import { ReportFight } from "../../wcl/types/report/report";
import { Abberus, AberrusEncounterNames } from "./Aberrus";
import { Amirdrassil, AmirdrassilEncounterNames } from "./Amirdrassil";
import { Encounter, EncounterMap, EnemyType, Enemy } from "./types";

/** Defaul encounter used as fallback for unknown encounters or multi fights */
const DefaultEncounter: EncounterMap = new Map([
  [
    "Default",
    {
      name: "Default",
      id: -1,
      enemies: [],
    },
  ],
]);

export const Encounters = {
  Default: DefaultEncounter,
  Abberus,
  Amirdrassil,
} as const;

export const EncounterNames = {
  Default: "Default",
  ...AberrusEncounterNames,
  ...AmirdrassilEncounterNames,
} as const;

export const CombinedEncounters: EncounterMap = new Map([
  ...Abberus.entries(),
  ...Amirdrassil.entries(),
]);

export function getEncounter(encounter: string): Encounter {
  const maybeEncounter = CombinedEncounters.get(encounter);

  /** Return fallback */
  if (!maybeEncounter) {
    return {
      name: "Unknown Encounter",
      id: -1,
      enemies: [],
    };
  }

  return maybeEncounter;
}

export function getEncounterInReport(
  fightsInReport: ReportFight[] | undefined,
  keepOrder: boolean = true
): string[] {
  if (!fightsInReport) {
    return [];
  }

  const fights = fightsInReport.reduce<string[]>((acc, fight) => {
    if (
      fight?.name &&
      CombinedEncounters.has(fight.name) &&
      !acc.includes(fight.name)
    ) {
      acc.push(fight.name);
    }

    return acc;
  }, []);

  if (keepOrder) {
    const fightOrder = Array.from(CombinedEncounters.keys());
    return fights.sort((a, b) => fightOrder.indexOf(a) - fightOrder.indexOf(b));
  }

  return fights;
}

export function createEnemy(id: number, name: string, type: EnemyType): Enemy {
  return { id, name, type };
}
