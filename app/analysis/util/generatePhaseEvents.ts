import { EventType } from "../../wcl/types/events/eventEnums";
import { AnyEvent, PhaseStartEvent } from "../../wcl/types/events/eventTypes";

export const castEvents = {
  /** Fyrakk */
  incarnate: 412761,
  greaterFirestorm: 422518,
  eternalFirestorm: 422935,
  /** Tindral */
  typhoon: 421636,
};
export const damageEvents = {
  /** Fyrakk */
  incarnate: 421831,
  flameFall: 419123,
};
export const removeBuffEvents = {
  /** Fyrakk */
  corruptShield: 421922,
  /** Tindral */
  superNova: 424140,
  owlOfTheFlame: 421603,
};

export function generatePhaseEvents(events: AnyEvent[]): PhaseStartEvent[] {
  const phaseStartEvents: PhaseStartEvent[] = [];

  let fyrakkIncarnateCastCount = 0;
  let fyrakkHasEnteredI1 = false;
  let fyrakkHasEnteredP2 = false;
  let fyrakkP2IntermissionCount = 1;

  let tindralFlyoffs = 0;
  let tindralIsFlying = false;

  for (const event of events) {
    switch (event.type) {
      case EventType.CastEvent:
        switch (event.abilityGameID) {
          // Fyrakk Fly off 1 & 3
          case castEvents.incarnate:
            fyrakkIncarnateCastCount += 1;
            if (
              fyrakkIncarnateCastCount === 1 ||
              fyrakkIncarnateCastCount === 4
            ) {
              phaseStartEvents.push({
                type: EventType.PhaseStartEvent,
                timestamp: event.timestamp,
                name: `Fly off ${fyrakkIncarnateCastCount === 1 ? 1 : 3}`,
                isDamageable: false,
              });
            }

            break;
          // Fyrakk Phase 2 (intermission ish) - summon colossus
          case castEvents.greaterFirestorm:
            phaseStartEvents.push({
              type: EventType.PhaseStartEvent,
              timestamp: event.timestamp,
              name: `Colossus set ${fyrakkP2IntermissionCount}`,
              isDamageable: true,
            });
            fyrakkP2IntermissionCount += 1;
            break;
          // Fyrakk Phase 3
          case castEvents.eternalFirestorm:
            phaseStartEvents.push({
              type: EventType.PhaseStartEvent,
              timestamp: event.timestamp,
              name: "Phase 3",
              isDamageable: true,
            });
            break;

          // Tindral Fly off 1 & 2
          case castEvents.typhoon:
            phaseStartEvents.push({
              type: EventType.PhaseStartEvent,
              timestamp: event.timestamp,
              name: `Fly off ${tindralFlyoffs + 1}`,
              isDamageable: false,
            });
            tindralFlyoffs += 1;
            tindralIsFlying = true;
            break;
        }
        break;
      case EventType.RemoveBuffEvent:
        switch (event.abilityGameID) {
          // Fyrakk Fly off 2
          case removeBuffEvents.corruptShield:
            phaseStartEvents.push({
              type: EventType.PhaseStartEvent,
              timestamp: event.timestamp,
              name: "Fly off 2",
              isDamageable: false,
            });
            break;

          // Tindral P2 & P3
          case removeBuffEvents.owlOfTheFlame:
            if (!tindralIsFlying) {
              break;
            }
            phaseStartEvents.push({
              type: EventType.PhaseStartEvent,
              timestamp: event.timestamp,
              name: `Phase ${tindralFlyoffs + 1}`,
              isDamageable: true,
            });
            tindralIsFlying = false;
            break;
        }
        break;
      case EventType.DamageEvent:
        switch (event.abilityGameID) {
          // Fyrakk Intermission 1
          case damageEvents.incarnate:
            if (fyrakkHasEnteredI1) {
              break;
            }
            fyrakkHasEnteredI1 = true;

            phaseStartEvents.push({
              type: EventType.PhaseStartEvent,
              timestamp: event.timestamp,
              name: "Intermission 1",
              isDamageable: true,
            });
            break;
          // Fyrakk P2
          case damageEvents.flameFall:
            if (fyrakkHasEnteredP2) {
              break;
            }
            fyrakkHasEnteredP2 = true;

            phaseStartEvents.push({
              type: EventType.PhaseStartEvent,
              timestamp: event.timestamp,
              name: "Phase 2",
              isDamageable: true,
            });
            break;
        }
        break;
    }
  }

  return phaseStartEvents;
}
