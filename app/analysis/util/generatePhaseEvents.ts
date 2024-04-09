import { getEnemyGuid } from "../../util/encounters/encounters";
import { EventType } from "../../wcl/types/events/eventEnums";
import { AnyEvent, PhaseStartEvent } from "../../wcl/types/events/eventTypes";

const castEvents = {
  /** Fyrakk */
  incarnate: 412761,
  greaterFirestorm: 422518,
  eternalFirestorm: 422935,
  /** Tindral */
  typhoon: 421636,
  /** Eranog */
  armyOfFlame: 370307,
  /** Kurog */
  primalBarrier: 374779,
  /** Raszageth */
  electricScales: 381249,
  surge: 382530,
  stormNova: 390463,
} as const;
const damageEvents = {
  /** Fyrakk */
  incarnate: 421831,
  flameFall: 419123,
} as const;
const removeBuffEvents = {
  /** Fyrakk */
  corruptShield: 421922,
  /** Tindral */
  superNova: 424140,
  owlOfTheFlame: 421603,
  /** Broodkeeper */
  broodKeepersBond: 375809,
  /** Kurog */
  primalBarrier: castEvents.primalBarrier,
  /** Raszageth */
  electricScales: castEvents.electricScales,
  stormShroud: 396734,
} as const;
const applyBuffEvents = {
  // Raszageth
  cracklingEnergy: 391281,
} as const;

export const PhaseEventTriggers = {
  castEvents,
  damageEvents,
  removeBuffEvents,
  applyBuffEvents,
} as const;

const BossState = {
  Phase: "Phase",
  Intermission: "Intermission",
  Immune: "Immune",
} as const;
type BossState = keyof typeof BossState;
const RaszagethStates = {
  P1: "Phase 1",
  P2: "Phase 2",
  P3: "Phase 3",
  Immune: "Immune",
  I1: "Intermission 1",
  I2: "Intermission 2",
  Knock: "Knock back",
} as const;
type RaszagethStates = (typeof RaszagethStates)[keyof typeof RaszagethStates];

export function generatePhaseEvents(
  events: AnyEvent[],
  enemyTracker: Map<number, number>
): PhaseStartEvent[] {
  const phaseStartEvents: PhaseStartEvent[] = [];

  let fyrakkIncarnateCastCount = 0;
  let fyrakkHasEnteredI1 = false;
  let fyrakkHasEnteredP2 = false;
  let fyrakkP2IntermissionCount = 1;

  let tindralFlyoffs = 0;
  let tindralIsFlying = false;

  let eranogInIntermission = false;

  let kurogPrimalBarrierCount = 0;

  let raszagethState: RaszagethStates = RaszagethStates.P1;
  // Inconsistent push timings means this is the most accurate way to get consistent phase start
  const raszagethElectricScalesBuffer = 8_000;

  const primalFlameGuid = getEnemyGuid("Primal Flame");

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

          // Eranog intermission
          case castEvents.armyOfFlame:
            phaseStartEvents.push({
              type: EventType.PhaseStartEvent,
              timestamp: event.timestamp,
              name: "Intermission",
              isDamageable: true,
            });
            eranogInIntermission = true;
            break;

          // Kurog Intermission
          case castEvents.primalBarrier:
            kurogPrimalBarrierCount += 1;
            phaseStartEvents.push({
              type: EventType.PhaseStartEvent,
              timestamp: event.timestamp,
              name: `Intermission ${kurogPrimalBarrierCount}`,
              isDamageable: true,
            });
            break;

          // Raszageth phases
          // P2 push
          case castEvents.electricScales: {
            if (raszagethState === RaszagethStates.I1) {
              raszagethState = RaszagethStates.P2;

              phaseStartEvents.push({
                type: EventType.PhaseStartEvent,
                timestamp: event.timestamp - raszagethElectricScalesBuffer,
                name: RaszagethStates.P2,
                isDamageable: true,
              });
            }
            break;
          }
          // Raszageth Intermission 1
          case castEvents.surge:
            if (raszagethState === RaszagethStates.Immune) {
              raszagethState = RaszagethStates.I1;

              phaseStartEvents.push({
                type: EventType.PhaseStartEvent,
                timestamp: event.timestamp,
                name: RaszagethStates.I1,
                isDamageable: true,
              });
            }
            break;
          // Raszageth Knock I2->P3
          case castEvents.stormNova:
            raszagethState = RaszagethStates.Knock;
            phaseStartEvents.push({
              type: EventType.PhaseStartEvent,
              timestamp: event.timestamp,
              name: RaszagethStates.Knock,
              isDamageable: false,
            });
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

          // Broodkeeper P2
          case removeBuffEvents.broodKeepersBond:
            phaseStartEvents.push({
              type: EventType.PhaseStartEvent,
              timestamp: event.timestamp,
              name: "Phase 2",
              isDamageable: true,
            });
            break;

          // Kurog Phase
          case removeBuffEvents.primalBarrier:
            phaseStartEvents.push({
              type: EventType.PhaseStartEvent,
              timestamp: event.timestamp,
              name: `Phase ${kurogPrimalBarrierCount + 1}`,
              isDamageable: true,
            });
            break;

          // Raszageth - Immune (P1->I1 & P2->I2)
          case removeBuffEvents.electricScales:
            if (
              raszagethState === RaszagethStates.P1 ||
              raszagethState === RaszagethStates.P2
            ) {
              // It gets removed when boss deadge, so let's not add it at the end
              raszagethState = BossState.Immune;
              phaseStartEvents.push({
                type: EventType.PhaseStartEvent,
                timestamp: event.timestamp,
                name: "Immune",
                isDamageable: false,
              });
            }
            break;
          // Raszageth - Immune (Knock back->P3)
          case removeBuffEvents.stormShroud:
            if (raszagethState === RaszagethStates.Knock) {
              raszagethState = RaszagethStates.P3;
              phaseStartEvents.push({
                type: EventType.PhaseStartEvent,
                timestamp: event.timestamp,
                name: RaszagethStates.P3,
                isDamageable: true,
              });
            }
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
      case EventType.DeathEvent: {
        // Eranog P1
        if (eranogInIntermission) {
          if (primalFlameGuid === enemyTracker.get(event.targetID)) {
            phaseStartEvents.push({
              type: EventType.PhaseStartEvent,
              timestamp: event.timestamp,
              name: "Phase 1",
              isDamageable: true,
            });
            eranogInIntermission = false;
          }
        }
        break;
      }
      case EventType.ApplyBuffEvent:
        switch (event.abilityGameID) {
          // Raszageth Intermission 2
          case applyBuffEvents.cracklingEnergy:
            if (raszagethState === RaszagethStates.Immune) {
              raszagethState = RaszagethStates.I2;
              phaseStartEvents.push({
                type: EventType.PhaseStartEvent,
                timestamp: event.timestamp,
                name: "Intermission 2",
                isDamageable: true,
              });
            }
            break;
        }
        break;
    }
  }

  return phaseStartEvents;
}
