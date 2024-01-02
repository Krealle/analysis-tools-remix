import {
  AnyBuffEvent,
  AnyDebuffEvent,
  AnyEvent,
  CastEvent,
  DamageEvent,
  DeathEvent,
  EventType,
  NormalizedDamageEvent,
  PhaseStartEvent,
} from "../../wcl/events/types";
import { Buff, generateBuffHistories } from "../combatant/buffs";
import { Combatants, generateCombatants } from "../combatant/combatants";
import { eventLinkNormalizer } from "../normalizers/eventLinkNormalizer";
import { correctSupportEvents } from "../normalizers/supportEventCorrecter";
import { supportEventLinkNormalizer } from "../normalizers/supportEventLinkNormalizer";
import { FightDataSet } from "./fetchFightData";
import { AbilityFilters, Weights } from "../../zustand/fightParametersStore";
import { WCLReport } from "../../wcl/gql/reportTypes";

export type Fight = {
  fightId: number;
  difficulty?: number | null;
  reportCode: string;
  startTime: number;
  endTime: number;
  events: AnyEvent[];
  normalizedDamageEvents: NormalizedDamageEvent[];
  deathEvents: DeathEvent[];
  buffHistory: Buff[];
  combatants: Combatants;
  phaseHistory?: PhaseStartEvent[];
};

export function handleFightData(
  WCLReport: WCLReport,
  FightDataSets: FightDataSet[],
  abilityFilters: AbilityFilters<number[]>,
  weights: Weights
): Fight[] {
  const newFights: Fight[] = [];
  console.log("Handling fight data", WCLReport, FightDataSets);

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
    console.log("sorted events");

    if (unexpectedEvents.length > 0) {
      console.error("Unexpected events!", unexpectedEvents);
    }

    const buffHistories: Buff[] = generateBuffHistories(
      buffEvents,
      fightDataSet.fight.startTime,
      fightDataSet.fight.endTime
    );
    console.log("generated buff histories", buffHistories);

    const combatants: Combatants = generateCombatants(
      buffHistories,
      fightDataSet.summaryTable.playerDetails,
      WCLReport.masterData.actors
    );
    console.log("generated combatants", combatants);

    const linkedEvents = eventLinkNormalizer(eventsToLink);
    console.log("linked events", linkedEvents);

    const linkedSupportEvent = supportEventLinkNormalizer(
      linkedEvents,
      combatants
    );
    console.log("linked support events", linkedSupportEvent);

    const correctedEvents = correctSupportEvents(
      linkedSupportEvent,
      combatants,
      abilityFilters,
      weights
    );
    console.log("corrected events", correctedEvents);

    newFights.push({
      fightId: fightDataSet.fight.id,
      difficulty: fightDataSet.fight.difficulty,
      reportCode: WCLReport.code,
      startTime: fightDataSet.fight.startTime,
      endTime: fightDataSet.fight.endTime,
      normalizedDamageEvents: correctedEvents,
      events: fightDataSet.events,
      deathEvents: deathEvents,
      buffHistory: buffHistories,
      combatants: combatants,
    });
  }

  return newFights;
}
