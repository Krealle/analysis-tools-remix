export const EventType = {
  DeathEvent: "death",
  DispelEvent: "dispel",
  RefreshDebuffEvent: "refreshdebuff",
  AbsorbEvent: "absorbed",
  InterruptEvent: "interrupt",
  ApplyBuffStackEvent: "applybuffstack",
  RemoveBuffStackEvent: "removebuffstack",
  ResourceChangeEvent: "resourcechange",
  HealEvent: "heal",
  PhaseStartEvent: "phasestart",
  SummonEvent: "summon",
  RemoveDebuffEvent: "removedebuff",
  BeginCastEvent: "begincast",
  DamageEvent: "damage",
  CastEvent: "cast",
  RemoveBuffEvent: "removebuff",
  ApplyBuffEvent: "applybuff",
  ApplyDebuffStackEvent: "applydebuffstack",
  ApplyDebuffEvent: "applydebuff",
  CombatantInfoEvent: "combatantinfo",
  EncounterStartEvent: "encounterstart",
  DungeonEncounterEnd: "dungeonencounterend",
  DungeonEnd: "dungeonend",
  RemoveDebuffStackEvent: "removedebuffstack",
} as const;
export type EventType = (typeof EventType)[keyof typeof EventType];

/** This list is incomplete - will add more as they become needed */
export enum HitType {
  Melee = 1,
  Crit = 2,
}
