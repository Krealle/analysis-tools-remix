import { EventType } from "../../wcl/types/events/eventEnums";
import { AnyEvent, PhaseStartEvent } from "../../wcl/types/events/eventTypes";

export function generatePhaseEvents(events: AnyEvent[]): PhaseStartEvent[] {
  const phaseStartEvents: PhaseStartEvent[] = [];

  // Different variables for different bosses
  // Denotes whether or not we've already found a specific phase
  let fyrakkIntermission1 = false;

  for (const event of events) {
    if (event.type === EventType.CastEvent) {
      // Fyrakk Intermission 1 - Incarnate
      if (event.abilityGameID === 412761 && !fyrakkIntermission1) {
        phaseStartEvents.push({
          type: EventType.PhaseStartEvent,
          timestamp: event.timestamp,
          name: "Intermission 1",
        });
        fyrakkIntermission1 = true;
      }
      // Fyrakk Phase 3 - Eternal Firestorm
      if (event.abilityGameID === 422935) {
        phaseStartEvents.push({
          type: EventType.PhaseStartEvent,
          timestamp: event.timestamp,
          name: "Phase 3",
        });
      }
    }

    if (event.type === EventType.RemoveBuffEvent) {
      // Fyrakk Phase 2 - Corrupt Shield
      if (event.abilityGameID === 421922) {
        phaseStartEvents.push({
          type: EventType.PhaseStartEvent,
          timestamp: event.timestamp,
          name: "Phase 2",
        });
      }
    }
  }

  return phaseStartEvents;
}
