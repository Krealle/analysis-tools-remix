import { Buff } from "../../../analysis/combatant/buffs";
import { Pet } from "../../../analysis/combatant/combatants";
import { DamageEvent } from "./eventTypes";

/** The two types below are circularly referencing themselves
 * therefore they are not made using zod, since it complains too much
 * about recursion, and I don't wanna spend time figuring out why rn
 * TODO: maybe fix? */
export type NormalizedDamageEvent = DamageEvent & {
  source: EventSource;
  originalEvent: DamageEvent;
  normalizedAmount: number;
  activeBuffs: Buff[];
  supportEvents: SupportEvent[];
  fabricated?: boolean;
  modified?: boolean;
};

export type SupportEvent = {
  event: NormalizedDamageEvent;
  delay: number;
  hookType: AttributionHook;
};

export type EventSource = {
  name: string;
  id: number;
  class: string;
  spec: string;
  petOwner?: Pet;
};

export enum AttributionStatus {
  NO_HOOK = "NO_HOOK",
  INCORRECT_HOOK_AMOUNT = "INCORRECT_HOOK_AMOUNT",
  HOOK_FOUND = "HOOK_FOUND",
}

export enum AttributionHook {
  GOOD_HOOK = "GOOD_HOOK",
  DELAYED_HOOK = "DELAYED_HOOK",
  UNEXPECTED_DAMAGE_RATIO = "UNEXPECTED_DAMAGE_RATIO",
  FABRICATED_HOOK = "FABRICATED_HOOK",
  EMPTY_HOOK = "EMPTY_HOOK",
}

export type AttributionTable = {
  events: AttributionEvent[];
};

export type AttributionEvent = {
  event: DamageEvent;
  supportEvent: SupportEvent[];
  attributionStatus: AttributionStatus;
  expectedHooks: number;
  url: string;
};
