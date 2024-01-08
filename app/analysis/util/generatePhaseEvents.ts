import { EventType } from "../../wcl/types/events/eventEnums";
import { AnyEvent, PhaseStartEvent } from "../../wcl/types/events/eventTypes";

/** Fyrakk */
export const incarnateCastId = 412761;
export const incarnateDamageTakenId = 421831;
export const corruptShieldBuffId = 421922;
export const eternalFirestormCastId = 422935;
export const flameFallDamageId = 419123;
export const greaterFirestormCast = 422518;

export function generatePhaseEvents(events: AnyEvent[]): PhaseStartEvent[] {
  const phaseStartEvents: PhaseStartEvent[] = [];

  let fyrakkIncarnateCastCount = 0;
  let fyrakkHasEnteredI1 = false;
  let fyrakkHasEnteredP2 = false;
  let fyrakkP2IntermissionCount = 1;

  for (const event of events) {
    switch (event.type) {
      case EventType.CastEvent:
        switch (event.abilityGameID) {
          // Fyrakk Fly off 1 & 3
          case incarnateCastId:
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
          case greaterFirestormCast:
            phaseStartEvents.push({
              type: EventType.PhaseStartEvent,
              timestamp: event.timestamp,
              name: `Phase 2 Colossus set ${fyrakkP2IntermissionCount}`,
              isDamageable: true,
            });
            fyrakkP2IntermissionCount += 1;
            break;
          // Fyrakk Phase 3
          case eternalFirestormCastId:
            phaseStartEvents.push({
              type: EventType.PhaseStartEvent,
              timestamp: event.timestamp,
              name: "Phase 3",
              isDamageable: true,
            });
            break;
        }
        break;
      case EventType.RemoveBuffEvent:
        switch (event.abilityGameID) {
          // Fyrakk Fly off 2
          case corruptShieldBuffId:
            phaseStartEvents.push({
              type: EventType.PhaseStartEvent,
              timestamp: event.timestamp,
              name: "Fly off 2",
              isDamageable: false,
            });
            break;
        }
        break;
      case EventType.DamageEvent:
        switch (event.abilityGameID) {
          // Fyrakk Intermission 1
          case incarnateDamageTakenId:
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
          case flameFallDamageId:
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
