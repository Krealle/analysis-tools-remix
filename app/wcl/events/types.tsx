import { Buff } from "../../analysis/combatant/buffs";
import { Pet } from "../../analysis/combatant/combatants";

export type BaseEvent<T extends Record<string, unknown>> = T & {
  type?: EventType;
  timestamp: number;
  sourceID: number;
  targetID: number;
  sourceInstance?: number;
  targetInstance?: number;
  sourceMarker?: number;
  targetMarker?: number;
  abilityGameID: number;
  // pin: "0" but irrelevant
};

type EncounterStartEvent = Omit<
  BaseEvent<{
    type: EventType.EncounterStartEvent;
    encounterID: number;
    name: string;
    difficulty: number;
    size: number;
    level: number;
    affixes: number[];
  }>,
  | "sourceID"
  | "targetID"
  | "sourceInstance"
  | "targetInstance"
  | "abilityGameID"
>;

type CombatantInfoEvent = Omit<
  BaseEvent<{
    type: EventType.CombatantInfoEvent;
    gear: [];
    auras: {
      source: number;
      ability: number;
      stacks: number;
      icon: string;
      name?: string;
    }[];
    expansion: string;
    faction: number;
    specID: number;
    covenantID: number;
    soulbindID: number;
    strength: number;
    agility: number;
    stamina: number;
    intellect: number;
    dodge: number;
    parry: number;
    block: number;
    armor: number;
    critMelee: number;
    critRanged: number;
    critSpell: number;
    speed: number;
    leech: number;
    hasteMelee: number;
    hasteRanged: number;
    hasteSpell: number;
    avoidance: number;
    mastery: number;
    versatilityDamageDone: number;
    versatilityHealingDone: number;
    versatilityDamageReduction: number;
    talents: { id: number; icon: string }[];
    pvpTalents: { id: number; icon: string }[];
    artifact: {
      traitID: number;
      rank: number;
      spellID: number;
      icon: string;
    }[];
    heartOfAzeroth: {
      traitID: number;
      rank: number;
      spellID: number;
      icon: string;
    }[];
  }>,
  "targetID" | "sourceInstance" | "targetInstance" | "abilityGameID"
>;

export type ApplyDebuffEvent = BaseEvent<{
  type: EventType.ApplyDebuffEvent;
}>;

export type ApplyDebuffStackEvent = BaseEvent<{
  type: EventType.ApplyDebuffStackEvent;
  stack: number;
}>;

export type ApplyBuffEvent = BaseEvent<{
  type: EventType.ApplyBuffEvent;
}>;

export type RemoveBuffEvent = BaseEvent<{
  type: EventType.RemoveBuffEvent;
}>;

export type CastEvent = BaseEvent<{
  type: EventType.CastEvent;
}>;

export type DungeonEncounterEnd = {
  timestamp: number;
  type: EventType.DungeonEncounterEnd;
  kill: boolean;
  encounterID: number;
  size: number;
  difficulty: number;
  name: string;
};

export type DungeonEnd = {
  /**
   * time
   */
  completion: number;
  difficulty: number;
  /**
   * dungeonID prefixed with 1
   */
  encounterID: number;
  kill: boolean;
  loggerTotalRating: number;
  /**
   * key level
   */
  medal: number;
  name: "";
  rating: number;
  size: number;
  timestamp: number;
  type: EventType.DungeonEnd;
};

export type BeginCastEvent = BaseEvent<{
  type: EventType.BeginCastEvent;
}>;

export type RemoveDebuffEvent = BaseEvent<{
  type: EventType.RemoveDebuffEvent;
}>;

type SummonEvent = BaseEvent<{
  type: EventType.SummonEvent;
}>;

export type PhaseStartEvent = Omit<
  BaseEvent<{
    type: EventType.PhaseStartEvent;
    encounterID: number;
    name: string;
    difficulty: number;
    size: number;
  }>,
  | "sourceID"
  | "targetID"
  | "targetInstance"
  | "sourceInstance"
  | "abilityGameID"
>;

export type HealEvent = BaseEvent<{
  type: "heal";
  hitType: HitType;
  amount: number;
  tick?: boolean;
  overheal?: number;
  absorbed?: number;
}>;

type ResourceChangeEvent = BaseEvent<{
  type: EventType.ResourceChangeEvent;
  resourceChange: number;
  resourceChangeType: number;
  otherResourceChange: number;
  waste: number;
}>;

export type ApplyBuffStackEvent = BaseEvent<{
  type: EventType.ApplyBuffStackEvent;
  stack: number;
}>;

export type RemoveBuffStackEvent = BaseEvent<{
  type: EventType.RemoveBuffStackEvent;
  stack: number;
}>;

export type InterruptEvent = BaseEvent<{
  type: EventType.InterruptEvent;
  extraAbilityGameID: number;
}>;

export type AbsorbEvent = BaseEvent<{
  type: EventType.AbsorbEvent;
  attackerID: number;
  amount: number;
  extraAbilityGameID: number;
}>;

export type RefreshDebuffEvent = BaseEvent<{
  type: EventType.RefreshDebuffEvent;
}>;

type DispelEvent = BaseEvent<{
  type: EventType.DispelEvent;
  extraAbilityGameID: number;
  isBuff: boolean;
}>;

export type DeathEvent = BaseEvent<{
  type: EventType.DeathEvent;
  // only present if NPC kills player
  killerID?: number;
  killerInstance?: number;
  killingAbilityGameID?: number;
}>;

export type DamageEvent = BaseEvent<{
  timestamp: number;
  type: EventType.DamageEvent;
  sourceID: number;
  targetID: number;
  abilityGameID: number;
  fight: number;
  hitType: HitType;
  amount: number;
  unmitigatedAmount?: number;
  supportID?: number;
  subtractsFromSupportedActor?: boolean;
  mitigated?: number;
  tick?: boolean;
  sourceInstance?: number;
  absorbed?: number;
  supportInstance?: number;
  targetInstance?: number;
  overkill?: number;
  /** used for dots, the event that applied/refreshed the dot */
  parentDotEvent?: ApplyDebuffEvent | RefreshDebuffEvent;
  castEvent?: CastEvent;
}>;

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

export type AnyEvent =
  | DeathEvent
  | DispelEvent
  | RefreshDebuffEvent
  | AbsorbEvent
  | InterruptEvent
  | ApplyBuffStackEvent
  | ResourceChangeEvent
  | HealEvent
  | PhaseStartEvent
  | SummonEvent
  | RemoveDebuffEvent
  | BeginCastEvent
  | DamageEvent
  | CastEvent
  | RemoveBuffEvent
  | ApplyBuffEvent
  | ApplyDebuffStackEvent
  | ApplyDebuffEvent
  | CombatantInfoEvent
  | EncounterStartEvent
  | DungeonEncounterEnd
  | DungeonEnd
  | RemoveBuffStackEvent;
export type AllTrackedEventTypes =
  | CastEvent
  | ApplyDebuffStackEvent
  | ApplyDebuffEvent
  | ApplyBuffEvent
  | RemoveBuffEvent
  | DamageEvent
  | BeginCastEvent
  | HealEvent
  | ApplyBuffStackEvent
  | RemoveBuffStackEvent
  | InterruptEvent
  | DeathEvent
  | RemoveDebuffEvent;
export type AnyBuffEvent =
  | ApplyBuffEvent
  | RemoveBuffEvent
  | ApplyBuffStackEvent
  | RemoveBuffStackEvent;
export type AnyDebuffEvent =
  | ApplyDebuffEvent
  | RemoveDebuffEvent
  | RefreshDebuffEvent;

export enum EventType {
  DeathEvent = "death",
  DispelEvent = "dispel",
  RefreshDebuffEvent = "refreshdebuff",
  AbsorbEvent = "absorbed",
  InterruptEvent = "interrupt",
  ApplyBuffStackEvent = "applybuffstack",
  RemoveBuffStackEvent = "removebuffstack",
  ResourceChangeEvent = "resourcechange",
  HealEvent = "heal",
  PhaseStartEvent = "phasestart",
  SummonEvent = "summon",
  RemoveDebuffEvent = "removedebuff",
  BeginCastEvent = "begincast",
  DamageEvent = "damage",
  CastEvent = "cast",
  RemoveBuffEvent = "removebuff",
  ApplyBuffEvent = "applybuff",
  ApplyDebuffStackEvent = "applydebuffstack",
  ApplyDebuffEvent = "applydebuff",
  CombatantInfoEvent = "combatantinfo",
  EncounterStartEvent = "encounterstart",
  DungeonEncounterEnd = "dungeonencounterend",
  DungeonEnd = "dungeonend",
}

/** This list in incomplete - will add values as they becomes needed
 * For now we only really care about crits */
export enum HitType {
  Crit = 2,
}
