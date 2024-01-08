import { Static, Type } from "@sinclair/typebox";
import { EventType, HitType } from "./eventEnums";

export const BaseEvent = Type.Object({
  type: Type.String(),
  timestamp: Type.Number(),
});

export const BaseAbility = Type.Object({
  sourceID: Type.Number(),
  targetID: Type.Number(),
  abilityGameID: Type.Number(),
  sourceInstance: Type.Optional(Type.Number()),
  targetInstance: Type.Optional(Type.Number()),
  sourceMarker: Type.Optional(Type.Number()),
  targetMarker: Type.Optional(Type.Number()),
});

const DeathEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.DeathEvent),
    // only present if NPC kills player
    killerID: Type.Optional(Type.Number()),
    killerInstance: Type.Optional(Type.Number()),
    killingAbilityGameID: Type.Optional(Type.Number()),
  }),
]);
export type DeathEvent = Static<typeof DeathEvent>;

const EncounterStartEvent = Type.Intersect([
  BaseEvent,
  Type.Object({
    type: Type.Literal(EventType.EncounterStartEvent),
    encounterID: Type.Number(),
    name: Type.String(),
    difficulty: Type.Number(),
    size: Type.Number(),
    level: Type.Number(),
    affixes: Type.Array(Type.Number()),
  }),
]);
export type EncounterStartEvent = Static<typeof EncounterStartEvent>;

const Aura = Type.Object({
  source: Type.Number(),
  ability: Type.Number(),
  stacks: Type.Number(),
  icon: Type.String(),
  name: Type.Optional(Type.String()),
});

const Talent = Type.Object({
  id: Type.Number(),
  icon: Type.String(),
});

const Artifact = Type.Object({
  traitID: Type.Number(),
  rank: Type.Number(),
  spellID: Type.Number(),
  icon: Type.String(),
});

const CombatantInfoEvent = Type.Intersect([
  BaseEvent,
  Type.Object({
    sourceID: Type.Number(),
    type: Type.Literal(EventType.CombatantInfoEvent),
    gear: Type.Array(Type.Unknown()),
    auras: Type.Array(Aura),
    expansion: Type.String(),
    faction: Type.Number(),
    specID: Type.Number(),
    covenantID: Type.Number(),
    soulbindID: Type.Number(),
    strength: Type.Number(),
    agility: Type.Number(),
    stamina: Type.Number(),
    intellect: Type.Number(),
    dodge: Type.Number(),
    parry: Type.Number(),
    block: Type.Number(),
    armor: Type.Number(),
    critMelee: Type.Number(),
    critRanged: Type.Number(),
    critSpell: Type.Number(),
    speed: Type.Number(),
    leech: Type.Number(),
    hasteMelee: Type.Number(),
    hasteRanged: Type.Number(),
    hasteSpell: Type.Number(),
    avoidance: Type.Number(),
    mastery: Type.Number(),
    versatilityDamageDone: Type.Number(),
    versatilityHealingDone: Type.Number(),
    versatilityDamageReduction: Type.Number(),
    talents: Type.Array(Talent),
    pvpTalents: Type.Array(Talent),
    artifact: Type.Array(Artifact),
    heartOfAzeroth: Type.Array(Artifact),
  }),
]);
export type CombatantInfoEvent = Static<typeof CombatantInfoEvent>;

const ApplyDebuffEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.ApplyDebuffEvent),
  }),
]);
export type ApplyDebuffEvent = Static<typeof ApplyDebuffEvent>;

const ApplyDebuffStackEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.ApplyDebuffStackEvent),
    stack: Type.Number(),
  }),
]);
export type ApplyDebuffStackEvent = Static<typeof ApplyDebuffStackEvent>;

const ApplyBuffEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.ApplyBuffEvent),
  }),
]);
export type ApplyBuffEvent = Static<typeof ApplyBuffEvent>;

const RemoveBuffEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.RemoveBuffEvent),
  }),
]);
export type RemoveBuffEvent = Static<typeof RemoveBuffEvent>;

const RemoveDebuffEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.RemoveDebuffEvent),
  }),
]);
export type RemoveDebuffEvent = Static<typeof RemoveDebuffEvent>;

const RemoveDebuffStackEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.RemoveDebuffStackEvent),
    stack: Type.Number(),
  }),
]);
export type RemoveDebuffStackEvent = Static<typeof RemoveDebuffStackEvent>;

const BeginCastEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.BeginCastEvent),
  }),
]);
export type BeginCastEvent = Static<typeof BeginCastEvent>;

const CastEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.CastEvent),
  }),
]);
export type CastEvent = Static<typeof CastEvent>;

const DungeonEncounterEnd = Type.Object({
  timestamp: Type.Number(),
  type: Type.Literal(EventType.DungeonEncounterEnd),
  kill: Type.Boolean(),
  encounterID: Type.Number(),
  size: Type.Number(),
  difficulty: Type.Number(),
  name: Type.String(),
});

export type DungeonEncounterEnd = Static<typeof DungeonEncounterEnd>;

const DungeonEnd = Type.Object({
  /**
   * time
   */
  completion: Type.Number(),
  difficulty: Type.Number(),
  /**
   * dungeonID prefixed with 1
   */
  encounterID: Type.Number(),
  kill: Type.Boolean(),
  loggerTotalRating: Type.Number(),
  /**
   * key level
   */
  medal: Type.Number(),
  name: Type.String(),
  rating: Type.Number(),
  size: Type.Number(),
  timestamp: Type.Number(),
  type: Type.Literal(EventType.DungeonEnd),
});
export type DungeonEnd = Static<typeof DungeonEnd>;

const SummonEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.SummonEvent),
  }),
]);
export type SummonEvent = Static<typeof SummonEvent>;

const PhaseStartEvent = Type.Intersect([
  BaseEvent,
  Type.Object({
    type: Type.Literal(EventType.PhaseStartEvent),
    name: Type.String(),
    isDamageable: Type.Boolean(),
    encounterID: Type.Optional(Type.Number()),
    difficulty: Type.Optional(Type.Number()),
    size: Type.Optional(Type.Number()),
  }),
]);
export type PhaseStartEvent = Static<typeof PhaseStartEvent>;

const HealEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal("heal"),
    hitType: Type.Number(),
    amount: Type.Number(),
    tick: Type.Optional(Type.Boolean()),
    overheal: Type.Optional(Type.Number()),
    absorbed: Type.Optional(Type.Number()),
  }),
]);
export type HealEvent = Static<typeof HealEvent>;

const ResourceChangeEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.ResourceChangeEvent),
    resourceChange: Type.Number(),
    resourceChangeType: Type.Number(),
    otherResourceChange: Type.Number(),
    waste: Type.Number(),
  }),
]);
export type ResourceChangeEvent = Static<typeof ResourceChangeEvent>;

const ApplyBuffStackEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.ApplyBuffStackEvent),
    stack: Type.Number(),
  }),
]);
export type ApplyBuffStackEvent = Static<typeof ApplyBuffStackEvent>;

const RemoveBuffStackEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.RemoveBuffStackEvent),
    stack: Type.Number(),
  }),
]);
export type RemoveBuffStackEvent = Static<typeof RemoveBuffStackEvent>;

const InterruptEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.InterruptEvent),
    extraAbilityGameID: Type.Number(),
  }),
]);
export type InterruptEvent = Static<typeof InterruptEvent>;

const AbsorbEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.AbsorbEvent),
    attackerID: Type.Number(),
    amount: Type.Number(),
    extraAbilityGameID: Type.Number(),
  }),
]);
export type AbsorbEvent = Static<typeof AbsorbEvent>;

const RefreshDebuffEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.RefreshDebuffEvent),
  }),
]);
export type RefreshDebuffEvent = Static<typeof RefreshDebuffEvent>;

const DispelEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.DispelEvent),
    extraAbilityGameID: Type.Number(),
    isBuff: Type.Boolean(),
  }),
]);
export type DispelEvent = Static<typeof DispelEvent>;

const DamageEvent = Type.Intersect([
  BaseEvent,
  BaseAbility,
  Type.Object({
    type: Type.Literal(EventType.DamageEvent),
    hitType: Type.Enum(HitType),
    amount: Type.Number(),
    fight: Type.Number(),
    unmitigatedAmount: Type.Optional(Type.Number()),
    supportID: Type.Optional(Type.Number()),
    supportInstance: Type.Optional(Type.Number()),
    subtractsFromSupportedActor: Type.Optional(Type.Boolean()),
    mitigated: Type.Optional(Type.Number()),
    tick: Type.Optional(Type.Boolean()),
    absorbed: Type.Optional(Type.Number()),
    overkill: Type.Optional(Type.Number()),
    // Fake property
    parentDotEvent: Type.Optional(
      Type.Union([ApplyDebuffEvent, RefreshDebuffEvent])
    ),
    // Fake property
    castEvent: Type.Optional(CastEvent),
  }),
]);
export type DamageEvent = Static<typeof DamageEvent>;

const AnyEvent = Type.Union([
  DamageEvent,
  ApplyBuffEvent,
  RemoveBuffEvent,
  ApplyDebuffEvent,
  ApplyBuffStackEvent,
  RemoveBuffStackEvent,
  RemoveDebuffEvent,
  RefreshDebuffEvent,
  CastEvent,
  DeathEvent,
  BeginCastEvent,
  EncounterStartEvent,
  CombatantInfoEvent,
  ApplyDebuffStackEvent,
  DungeonEncounterEnd,
  DungeonEnd,
  SummonEvent,
  PhaseStartEvent,
  HealEvent,
  ResourceChangeEvent,
  InterruptEvent,
  AbsorbEvent,
  DispelEvent,
]);
export type AnyEvent = Static<typeof AnyEvent>;

const AllTrackedEvents = Type.Union([
  CastEvent,
  BeginCastEvent,
  ApplyDebuffEvent,
  RemoveDebuffEvent,
  ApplyDebuffStackEvent,
  RemoveDebuffStackEvent,
  ApplyBuffEvent,
  RemoveBuffEvent,
  ApplyBuffStackEvent,
  RemoveBuffStackEvent,
  HealEvent,
  InterruptEvent,
  DamageEvent,
  DeathEvent,
]);
export type AllTrackedEvents = Static<typeof AllTrackedEvents>;

export const AnyBuffEvent = Type.Union([
  ApplyBuffEvent,
  RemoveBuffEvent,
  ApplyBuffStackEvent,
  RemoveBuffStackEvent,
]);
export type AnyBuffEvent = Static<typeof AnyBuffEvent>;

const AnyDebuffEvent = Type.Union([
  ApplyDebuffEvent,
  RemoveDebuffEvent,
  ApplyDebuffStackEvent,
  RemoveDebuffStackEvent,
  RefreshDebuffEvent,
]);
export type AnyDebuffEvent = Static<typeof AnyDebuffEvent>;
