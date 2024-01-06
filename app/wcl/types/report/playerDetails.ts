import { Static, Type } from "@sinclair/typebox";

export const Stat = Type.Object({
  min: Type.Number(),
  max: Type.Number(),
});

export const Stats = Type.Object({
  Speed: Type.Optional(Stat),
  Dodge: Type.Optional(Stat),
  Mastery: Stat,
  Stamina: Type.Optional(Stat),
  Haste: Stat,
  Leech: Type.Optional(Stat),
  Armor: Type.Optional(Stat),
  Agility: Type.Optional(Stat),
  Crit: Stat,
  "Item Level": Type.Optional(Stat),
  Parry: Type.Optional(Stat),
  Avoidance: Type.Optional(Stat),
  Versatility: Stat,
  Intellect: Type.Optional(Stat),
  Strength: Type.Optional(Stat),
});

export const Talent = Type.Object({
  name: Type.String(),
  guid: Type.Number(),
  type: Type.Number(),
  abilityIcon: Type.String(),
});

export const CustomPowerSet = Type.Object({
  name: Type.String(),
  guid: Type.Number(),
  type: Type.Number(),
  abilityIcon: Type.String(),
  total: Type.Number(),
});
type CustomPowerSet = Static<typeof CustomPowerSet>;

export const ItemQuality = Type.Union([
  Type.Literal(1),
  Type.Literal(2),
  Type.Literal(3),
  Type.Literal(4),
  Type.Literal(5),
]);

export const Gem = Type.Object({
  id: Type.Number(),
  itemLevel: Type.Number(),
  icon: Type.String(),
});

export const Item = Type.Object({
  id: Type.Number(),
  slot: Type.Number(),
  quality: Type.Optional(ItemQuality),
  icon: Type.String(),
  name: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  itemLevel: Type.Number(),
  bonusIDs: Type.Optional(Type.Union([Type.Array(Type.Number()), Type.Null()])),
  gems: Type.Optional(Type.Union([Type.Array(Gem), Type.Null()])),
  permanentEnchant: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  permanentEnchantName: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  onUseEnchant: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  onUseEnchantName: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  effectID: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  effectIcon: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  effectName: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  temporaryEnchant: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  temporaryEnchantName: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});
type Item = Static<typeof Item>;

export const SecondaryCustomPowerSet = Type.Object({
  name: Type.String(),
  guid: Type.Number(),
  type: Type.Number(),
  abilityIcon: Type.String(),
  total: Type.Number(),
});

export const CombatantInfo = Type.Object({
  stats: Stats,
  talents: Type.Array(Talent),
  gear: Type.Array(Item),
  customPowerSet: Type.Optional(Type.Array(CustomPowerSet)),
  secondaryCustomPowerSet: Type.Optional(Type.Array(SecondaryCustomPowerSet)),
  tertiaryCustomPowerSet: Type.Optional(Type.Array(Type.Unknown())),
  specIDs: Type.Array(Type.Number()),
  factionID: Type.Number(),
  covenantID: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  soulbindID: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
});

export const Player = Type.Object({
  name: Type.String(),
  id: Type.Number(),
  guid: Type.Number(),
  type: Type.String(),
  server: Type.Optional(Type.String()),
  icon: Type.String(),
  specs: Type.Array(Type.String()),
  minItemLevel: Type.Number(),
  maxItemLevel: Type.Number(),
  potionUse: Type.Number(),
  healthstoneUse: Type.Number(),
  /**
   * in report K9Mfcb2CtjZ7pX6q fight 45, combatantInfo is an empty array
   * for a single player
   */
  combatantInfo: Type.Union([CombatantInfo, Type.Array(Type.Never())]),
});

export const PlayerDetails = Type.Object({
  healers: Type.Array(Player),
  tanks: Type.Array(Player),
  dps: Type.Array(Player),
});
export type PlayerDetails = Static<typeof PlayerDetails>;

export const PlayerDetailsRoot = Type.Object({
  data: Type.Object({
    playerDetails: PlayerDetails,
  }),
});
