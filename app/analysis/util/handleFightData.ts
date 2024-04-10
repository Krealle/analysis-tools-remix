import { Buff, generateBuffHistories } from "../combatant/buffs";
import { Combatants, generateCombatants } from "../combatant/combatants";
import { eventLinkNormalizer } from "../normalizers/eventLinkNormalizer";
import { correctSupportEvents } from "../normalizers/supportEventCorrecter";
import { supportEventLinkNormalizer } from "../normalizers/supportEventLinkNormalizer";
import { FightDataSet } from "./fetchFightData";
import { AbilityFilters, Weights } from "../../zustand/fightParametersStore";
import { WCLReport } from "../../wcl/types/graphql/queryTypes";
import { NormalizedDamageEvent } from "../../wcl/types/events/customEventTypes";
import { EventType } from "../../wcl/types/events/eventEnums";
import {
  AnyBuffEvent,
  AnyDebuffEvent,
  AnyEvent,
  CastEvent,
  DamageEvent,
  DeathEvent,
  PhaseStartEvent,
} from "../../wcl/types/events/eventTypes";
import { generatePhaseEvents } from "./generatePhaseEvents";
import { EncounterPhaseTriggers } from "../../util/encounters/encounters";

export type Fight = {
  fightId: number;
  bossName: string;
  difficulty?: number | null;
  reportCode: string;
  startTime: number;
  endTime: number;
  events: AnyEvent[];
  normalizedDamageEvents: NormalizedDamageEvent[];
  deathEvents: DeathEvent[];
  buffHistory: Buff[];
  phaseEvents: PhaseStartEvent[];
  combatants: Combatants;
};

export function handleFightData(
  WCLReport: WCLReport,
  FightDataSets: FightDataSet[],
  abilityFilters: AbilityFilters<Set<number>>,
  weights: Weights,
  enemyTracker: Map<number, number>
): Fight[] {
  const newFights: Fight[] = [];

  for (const fightDataSet of FightDataSets) {
    const buffEvents: AnyBuffEvent[] = [];
    const eventsToLink: (DamageEvent | AnyDebuffEvent | CastEvent)[] = [];
    const deathEvents: DeathEvent[] = [];
    const unexpectedEvents: AnyEvent[] = [];

    for (const event of fightDataSet.events) {
      switch (event.type) {
        case EventType.ApplyBuffEvent:
        case EventType.RemoveBuffEvent:
        case EventType.ApplyBuffStackEvent:
        case EventType.RemoveBuffStackEvent:
          buffEvents.push(event);
          break;
        case EventType.DamageEvent:
        case EventType.RefreshDebuffEvent:
        case EventType.ApplyDebuffEvent:
        case EventType.RemoveDebuffEvent:
        case EventType.CastEvent:
          eventsToLink.push(event);
          break;
        case EventType.DeathEvent:
          deathEvents.push(event);
          break;
        default:
          unexpectedEvents.push(event);
          break;
      }
    }

    if (unexpectedEvents.length > 0) {
      console.error("Unexpected events!", unexpectedEvents);
    }

    const buffHistories: Buff[] = generateBuffHistories(
      buffEvents,
      fightDataSet.fight.startTime,
      fightDataSet.fight.endTime
    );

    const combatants: Combatants = generateCombatants(
      buffHistories,
      fightDataSet.summaryTable.playerDetails,
      WCLReport.masterData.actors
    );

    const linkedEvents = eventLinkNormalizer(eventsToLink);

    const linkedSupportEvent = supportEventLinkNormalizer(
      linkedEvents,
      combatants
    );

    const correctedEvents = correctSupportEvents(
      linkedSupportEvent,
      combatants,
      abilityFilters,
      weights
    );

    const phaseEvents: PhaseStartEvent[] = generatePhaseEvents(
      EncounterPhaseTriggers,
      fightDataSet.phaseEvents,
      fightDataSet.fight,
      enemyTracker
    );

    newFights.push({
      fightId: fightDataSet.fight.id,
      bossName: fightDataSet.fight.name ?? "Unknown Boss",
      difficulty: fightDataSet.fight.difficulty,
      reportCode: WCLReport.code,
      startTime: fightDataSet.fight.startTime,
      endTime: fightDataSet.fight.endTime,
      normalizedDamageEvents: correctedEvents,
      events: fightDataSet.events,
      deathEvents: deathEvents,
      buffHistory: buffHistories,
      phaseEvents: phaseEvents,
      combatants: combatants,
    });
  }

  return newFights;
}
