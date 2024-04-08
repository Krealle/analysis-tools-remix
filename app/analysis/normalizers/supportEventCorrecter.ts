import {
  COMBUSTION_BUFF,
  EBON_MIGHT,
  PRESCIENCE,
  SHIFTING_SANDS,
} from "../../util/constants";
import { Buff } from "../combatant/buffs";
import { Combatants } from "../combatant/combatants";
import { AbilityFilters, Weights } from "../../zustand/fightParametersStore";
import {
  AttributionHook,
  NormalizedDamageEvent,
} from "../../wcl/types/events/customEventTypes";
import { EventType, HitType } from "../../wcl/types/events/eventEnums";

export function correctSupportEvents(
  events: NormalizedDamageEvent[],
  combatants: Combatants,
  abilityFilters: AbilityFilters<Set<number>>,
  weights: Weights
): NormalizedDamageEvent[] {
  const correctedEvents = events.reduce<NormalizedDamageEvent[]>(
    (corEvents, event) => {
      if (!event.supportEvents.length && !event.activeBuffs.length) {
        corEvents.push(event);
        return corEvents;
      }

      const playerBuffs: Buff[] = getRelevantPlayerBuffs(event, abilityFilters);
      const supEvents: NormalizedDamageEvent[] = [];

      let supportDamage = 0;
      event.supportEvents.forEach((e) => {
        const supEvent = e.event;

        const trueSupportDamage = getSupportDamage(event, supEvent, weights);

        if (supEvent.normalizedAmount === 0 && trueSupportDamage !== 0) {
          supEvent.modified = true;
        }

        supEvent.normalizedAmount = trueSupportDamage;
        supportDamage += trueSupportDamage;

        const buffIndex = playerBuffs.findIndex(
          (b) =>
            b.sourceID === supEvent.sourceID &&
            b.abilityGameID === supEvent.abilityGameID
        );

        if (buffIndex !== -1) {
          playerBuffs.splice(buffIndex, 1);
        }

        supEvents.push(supEvent);
      });

      playerBuffs.forEach((buff) => {
        const fabricatedSupportEvent = fabricateEvent(
          event,
          buff,
          combatants,
          weights
        );

        if (fabricatedSupportEvent) {
          supEvents.push(fabricatedSupportEvent);
          event.supportEvents.push({
            event: fabricatedSupportEvent,
            delay: 0,
            hookType: AttributionHook.FABRICATED_HOOK,
          });
          supportDamage += fabricatedSupportEvent.normalizedAmount;
        }
      });

      event.normalizedAmount -= supportDamage;

      corEvents.push(event, ...supEvents);

      return corEvents;
    },
    []
  );
  return correctedEvents;
}

function fabricateEvent(
  event: NormalizedDamageEvent,
  buff: Buff,
  combatants: Combatants,
  weights: Weights
): NormalizedDamageEvent | undefined {
  /** whenever EM drops/applies on the same tick weird stuff happens, so lets just ignore these edge cases */
  if (buff.end === event.timestamp || buff.start === event.timestamp) {
    return;
  }

  const player = combatants.get(buff.sourceID);

  const attributedAmount =
    event.normalizedAmount * getAbilityMultiplier(buff.abilityGameID, weights);

  const fabricatedSupportEvent: NormalizedDamageEvent = {
    abilityGameID: buff.abilityGameID,
    amount: attributedAmount,
    fight: event.fight,
    hitType: event.hitType,
    source: {
      name: player?.name ?? "Unknown",
      id: player?.id ?? -1,
      class: player?.class ?? "Unknown",
      spec: player?.spec ?? "Unknown",
    },
    timestamp: event.timestamp,
    normalizedAmount: attributedAmount,
    subtractsFromSupportedActor: true,
    sourceID: buff.sourceID,
    sourceInstance: buff.sourceInstance,
    supportID: event.sourceID,
    supportInstance: event.sourceInstance,
    targetID: event.targetID,
    targetInstance: event.targetInstance,
    type: EventType.DamageEvent,
    originalEvent: event, // This can *potentially* be misleading, but also the opposite, since this leaves a trace from fabrication to source event
    fabricated: true,
    activeBuffs: [],
    supportEvents: [],
  };

  return fabricatedSupportEvent;
}

function getRelevantPlayerBuffs(
  event: NormalizedDamageEvent,
  abilityFilters: AbilityFilters<Set<number>>
): Buff[] {
  const hasCombustion = event.activeBuffs.find(
    (buff) => buff.abilityGameID === COMBUSTION_BUFF
  );

  let playerBuffs: Buff[] =
    abilityFilters.noScaling.has(event.abilityGameID) ||
    abilityFilters.blacklist.has(event.abilityGameID)
      ? []
      : event.activeBuffs.filter(
          (buff) =>
            buff.abilityGameID === EBON_MIGHT ||
            buff.abilityGameID === SHIFTING_SANDS ||
            buff.abilityGameID === PRESCIENCE
        );
  if (
    (event.hitType !== HitType.Crit ||
      hasCombustion ||
      event.abilityGameID === 427908 ||
      event.abilityGameID === 258922 ||
      event.abilityGameID === 258921) &&
    event.abilityGameID !== 269576
  ) {
    playerBuffs = playerBuffs.filter(
      (buff) => buff.abilityGameID !== PRESCIENCE
    );
  }

  if (abilityFilters.noEbonMightScaling.has(event.abilityGameID)) {
    playerBuffs = playerBuffs.filter(
      (buff) => buff.abilityGameID !== EBON_MIGHT
    );
  }

  if (abilityFilters.noShiftingSandsScaling.has(event.abilityGameID)) {
    playerBuffs = playerBuffs.filter(
      (buff) => buff.abilityGameID !== SHIFTING_SANDS
    );
  }

  return playerBuffs;
}

function getSupportDamage(
  event: NormalizedDamageEvent,
  supEvent: NormalizedDamageEvent,
  weights: Weights
): number {
  let attributedAmount = supEvent.normalizedAmount;

  if (attributedAmount === 0 && event.normalizedAmount !== 0) {
    attributedAmount =
      event.normalizedAmount *
      getAbilityMultiplier(supEvent.abilityGameID, weights);
  }
  return attributedAmount;
}

function getAbilityMultiplier(abilityId: number, weights: Weights): number {
  const multiplier =
    abilityId === EBON_MIGHT
      ? weights.ebonMightWeight
      : abilityId === SHIFTING_SANDS
      ? weights.shiftingSandsWeight
      : weights.prescienceWeight;

  return multiplier;
}
