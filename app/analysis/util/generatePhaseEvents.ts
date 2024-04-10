import { EnemyTracker } from "../../util/types";
import { EventType } from "../../wcl/types/events/eventEnums";
import {
  AnyEvent,
  HasAbility,
  HasSource,
  HasTarget,
  PhaseStartEvent,
} from "../../wcl/types/events/eventTypes";
import { ReportFight } from "../../wcl/types/report/report";

const DEBUG = false;

//region TYPES
/** The specification for which a PhaseEvent should be generated */
export type PhaseEventTrigger<T extends AnyEvent = AnyEvent> = {
  /** REQUIRED The type or types of the event that triggers the PhaseEvent */
  triggerEventType: EventType[];
  /** REQUIRED The id of the event that triggers the PhaseEvent
   *
   * If an empty array is parsed the check against this ID will be skipped
   * useful for eg. DeathEvents where you want to find the source/target instead
   *
   * IMPORTANT This is used to create the filter that fetches the event, so for
   * above example if this wasn't left empty no death events would be fetched
   * since it would be searching for a DeathEvent with that ability ID in it (not possible) */
  triggerEventId: number[];
  /** REQUIRED The name of the Phase that we are transitioning from
   *
   * IMPORTANT the phase names must be consistent throughout all the triggers
   * for a given encounter */
  previousPhase: string | string[];
  /** REQUIRED The name of the Phase that we are transitioning to
   *
   * IMPORTANT the phase names must be consistent throughout all the triggers
   * for a given encounter */
  nextPhase: string | string[];
  /** Required Whether the new Phase is damageable */
  isDamageable: boolean;
  /** REQUIRED The name of the boss that is transitioning
   *
   * this will prolly become obsolete in the future when triggers
   * are added directly to the individual encounter */
  bossName: string;
  /** REQUIRED The maximum number of PhaseEvents to generate */
  maximumPhases: number;
  /** OPTIONAL Whether to display the phase count
   *
   * The number parsed will offset the counter
   *
   * so 0 would display 1->2->etc
   *
   * and 1 would display 2->3->etc */
  displayPhaseCount?: number;
  /** OPTIONAL The amount of time to offset the PhaseEvent */
  buffer?: number;
  /** OPTIONAL The source (GUID) of the event that triggers the PhaseEvent */
  sourceGuid?: number[];
  /** OPTIONAL The target (GUID) of the event that triggers the PhaseEvent */
  targetGuid?: number[];
  /** OPTIONAL Filter expression to add */
  filter?: string;
  /** OPTIONAL This predicate will be called to determine if the PhaseEvent should be made
   *
   * IMPORTANT: maximumPhases and EventType is checked before this gets executed
   * @cnd the predicate to use
   * @skipOtherChecks whether to strictly use this predicate or continue with other checks */
  customCondition?: {
    cnd: (
      event: T,
      eventTargetGuid: number,
      eventSourceGuid: number,
      previousPhaseEvent?: PhaseStartEvent
    ) => boolean;
    skipOtherChecks?: boolean;
  };
  /** OPTIONAL Whether the trigger should be active */
  isActive?: (fight: ReportFight) => boolean;
};

//region generatePhaseEvents
export function generatePhaseEvents(
  triggers: PhaseEventTrigger[],
  events: AnyEvent[],
  fight: ReportFight,
  enemyTracker: EnemyTracker
): PhaseStartEvent[] {
  const phaseStartEvents: PhaseStartEvent[] = [];

  if (!events.length) {
    DEBUG && console.warn("no events to generate phase events from");
    return phaseStartEvents;
  }

  const activeTriggers = triggers.filter(
    (trigger) =>
      (!trigger.isActive || trigger.isActive(fight)) &&
      trigger.bossName === fight.name
  );
  if (!activeTriggers.length) {
    DEBUG && console.warn("no triggers to generate phase events from");
    return phaseStartEvents;
  }

  // Start the phase at the first expected phase
  let currentPhase = getPhaseName(activeTriggers[0].previousPhase);
  const currentPhaseAmounts = new Map<string, number>();

  for (const event of events) {
    if (!activeTriggers.length) {
      DEBUG &&
        console.info(
          "no more triggers to generate phase events from - stopping",
          phaseStartEvents
        );
      break;
    }

    for (let idx = 0; idx < activeTriggers.length; idx += 1) {
      const trigger = activeTriggers[idx];

      if (!isSamePhase(trigger.previousPhase, currentPhase)) continue;

      const eventTargetGuid =
        (HasTarget(event) && enemyTracker.get(event.targetID)) || -1;
      const eventSourceGuid =
        (HasSource(event) && enemyTracker.get(event.sourceID)) || -1;

      const key = `${getPhaseName(trigger.previousPhase)}-${getPhaseName(
        trigger.nextPhase
      )}-${trigger.triggerEventType[0]}`;
      const currentAmount =
        currentPhaseAmounts.get(key) || trigger.displayPhaseCount || 0;

      if (
        !shouldTrigger(
          event,
          trigger,
          eventTargetGuid,
          eventSourceGuid,
          phaseStartEvents[phaseStartEvents.length - 1]
        )
      ) {
        continue;
      }

      const newCurrentAmount = currentAmount + 1;
      currentPhaseAmounts.set(key, newCurrentAmount);
      currentPhase = getPhaseName(trigger.nextPhase, currentAmount);

      const displayPhaseCount =
        trigger.displayPhaseCount !== undefined ? newCurrentAmount : "";
      const newPhaseName = `${currentPhase} ${displayPhaseCount}`.trim();

      phaseStartEvents.push({
        type: EventType.PhaseStartEvent,
        timestamp: event.timestamp + (trigger?.buffer || 0),
        name: newPhaseName,
        isDamageable: trigger.isDamageable,
      });

      if (
        trigger.maximumPhases !== undefined &&
        trigger.maximumPhases + (trigger.displayPhaseCount || 0) <=
          newCurrentAmount
      ) {
        DEBUG &&
          console.info(
            `Yeeting trigger ${getPhaseName(
              trigger.nextPhase
            )} because phase amount ${newCurrentAmount} is greater than or equal to ${
              trigger.maximumPhases
            }`
          );

        // remove the trigger so we don't trigger it again
        activeTriggers.splice(idx, 1);
      }

      break;
    }
  }

  return phaseStartEvents;
}

//region HELPERS
function isSamePhase(
  prevPhase: string | string[],
  currentPhase: string
): boolean {
  if (Array.isArray(prevPhase)) {
    return prevPhase.includes(currentPhase);
  }
  return prevPhase === currentPhase;
}

function getPhaseName(name: string | string[], index?: number): string {
  if (Array.isArray(name)) {
    return name[index || 0];
  }
  return name;
}

function shouldTrigger(
  event: AnyEvent,
  trigger: PhaseEventTrigger,
  eventTargetGuid: number,
  eventSourceGuid: number,
  previousPhaseEvent?: PhaseStartEvent
): boolean {
  if (!trigger.triggerEventType.includes(event.type)) {
    DEBUG &&
      console.info(
        `Skipping trigger ${getPhaseName(
          trigger.nextPhase
        )} because event type ${
          event.type
        } does not match ${trigger.triggerEventType.join(", ")}`
      );
    return false;
  }

  if (trigger.customCondition) {
    const cndTruthy = trigger.customCondition.cnd(
      event,
      eventTargetGuid,
      eventSourceGuid,
      previousPhaseEvent
    );
    DEBUG &&
      console.info(
        `Custom condition returned ${cndTruthy} - skipping:${trigger.customCondition.skipOtherChecks}`
      );
    if (!cndTruthy) return false;

    if (trigger.customCondition.skipOtherChecks) {
      return cndTruthy;
    }
  }

  if (
    trigger.triggerEventId.length &&
    HasAbility(event) &&
    !trigger.triggerEventId.includes(event.abilityGameID)
  ) {
    DEBUG &&
      console.info(
        `Skipping trigger ${getPhaseName(
          trigger.nextPhase
        )} because event ability ${
          event.abilityGameID
        } does not match ${trigger.triggerEventId.join(", ")}`
      );
    return false;
  }

  if (trigger.targetGuid && !trigger.targetGuid.includes(eventTargetGuid)) {
    DEBUG &&
      console.info(
        `Skipping trigger ${getPhaseName(
          trigger.nextPhase
        )} because event target ${eventTargetGuid} does not match ${trigger.targetGuid.join(
          ", "
        )}`
      );
    return false;
  }

  if (trigger.sourceGuid && !trigger.sourceGuid.includes(eventSourceGuid)) {
    DEBUG &&
      console.info(
        `Skipping trigger ${getPhaseName(
          trigger.nextPhase
        )} because event source ${eventSourceGuid} does not match ${trigger.sourceGuid.join(
          ", "
        )}`
      );
    return false;
  }

  DEBUG && console.info(`Trigger ${getPhaseName(trigger.nextPhase)}!`);
  return true;
}

//region FILTER
export function getEventTriggerFilter(triggers: PhaseEventTrigger[]): string {
  return triggers
    .map((trigger) => {
      const eventTypeFilter = `type in ("${trigger.triggerEventType.join(
        `","`
      )}")`;
      const abilityFilter = trigger.triggerEventId.length
        ? ` AND ability.id in (${trigger.triggerEventId.join()})`
        : "";
      const targetFilter = trigger.targetGuid
        ? ` AND target.id in (${trigger.targetGuid.join()})`
        : "";
      const sourceFilter = trigger.sourceGuid
        ? ` AND source.id in (${trigger.sourceGuid.join()})`
        : "";
      const customExpression = trigger.filter ? ` AND (${trigger.filter})` : "";

      return `(${eventTypeFilter}${abilityFilter}${targetFilter}${sourceFilter}${customExpression})`;
    })
    .join("\nOR ");
}
