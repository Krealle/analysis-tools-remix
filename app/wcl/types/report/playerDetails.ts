import { z } from "zod";

export const StatSchema = z.object({
  min: z.number(),
  max: z.number(),
});
export type Stat = z.infer<typeof StatSchema>;

export const StatsSchema = z.object({
  Speed: StatSchema.optional(),
  Dodge: StatSchema.optional(),
  Mastery: StatSchema,
  Stamina: StatSchema.optional(),
  Haste: StatSchema,
  Leech: StatSchema.optional(),
  Armor: StatSchema.optional(),
  Agility: StatSchema.optional(),
  Crit: StatSchema,
  "Item Level": StatSchema.optional(),
  Parry: StatSchema.optional(),
  Avoidance: StatSchema.optional(),
  Versatility: StatSchema,
  Intellect: StatSchema.optional(),
  Strength: StatSchema.optional(),
});
export type Stats = z.infer<typeof StatsSchema>;

export const TalentSchema = z.object({
  name: z.string(),
  guid: z.number(),
  type: z.number(),
  abilityIcon: z.string(),
});
export type Talent = z.infer<typeof TalentSchema>;

export const CustomPowerSetSchema = z.object({
  name: z.string(),
  guid: z.number(),
  type: z.number(),
  abilityIcon: z.string(),
  total: z.number(),
});
export type CustomPowerSet = z.infer<typeof CustomPowerSetSchema>;

export const ItemQualitySchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
export enum ItemQuality {
  POOR = 1,
  COMMON = 2,
  RARE = 3,
  SUPERIOR = 4,
  LEGENDARY = 5,
}

export const GemSchema = z.object({
  id: z.number(),
  itemLevel: z.number(),
  icon: z.string(),
});
export type Gem = z.infer<typeof GemSchema>;

export const ItemSchema = z.object({
  id: z.number(),
  slot: z.number(),
  quality: ItemQualitySchema.optional(),
  icon: z.string(),
  name: z.string().nullable().optional(),
  itemLevel: z.number(),
  bonusIDs: z.array(z.number()).nullable().optional(),
  gems: z.array(GemSchema).nullable().optional(),
  permanentEnchant: z.number().nullable().optional(),
  permanentEnchantName: z.string().nullable().optional(),
  onUseEnchant: z.number().nullable().optional(),
  onUseEnchantName: z.string().nullable().optional(),
  effectID: z.number().nullable().optional(),
  effectIcon: z.string().nullable().optional(),
  effectName: z.string().nullable().optional(),
  temporaryEnchant: z.number().nullable().optional(),
  temporaryEnchantName: z.string().nullable().optional(),
});
export type Item = z.infer<typeof ItemSchema>;

export const SecondaryCustomPowerSetSchema = z.object({
  name: z.string(),
  guid: z.number(),
  type: z.number(),
  abilityIcon: z.string(),
  total: z.number(),
});
export type SecondaryCustomPowerSet = z.infer<
  typeof SecondaryCustomPowerSetSchema
>;

export const CombatantInfoSchema = z.object({
  stats: StatsSchema,
  talents: z.array(TalentSchema),
  gear: z.array(ItemSchema),
  customPowerSet: z.array(CustomPowerSetSchema).optional(),
  secondaryCustomPowerSet: z.array(SecondaryCustomPowerSetSchema).optional(),
  tertiaryCustomPowerSet: z.array(z.unknown()).optional(),
  specIDs: z.array(z.number()),
  factionID: z.number(),
  covenantID: z.number().nullable().optional(),
  soulbindID: z.number().nullable().optional(),
});
export type CombatantInfo = z.infer<typeof CombatantInfoSchema>;

export const PlayerSchema = z.object({
  name: z.string(),
  id: z.number(),
  guid: z.number(),
  type: z.string(),
  server: z.string().optional(),
  icon: z.string(),
  specs: z.array(z.string()),
  minItemLevel: z.number(),
  maxItemLevel: z.number(),
  potionUse: z.number(),
  healthstoneUse: z.number(),
  /**
   * in report K9Mfcb2CtjZ7pX6q fight 45, combatantInfo is an empty array
   * for a single player
   */
  combatantInfo: CombatantInfoSchema.or(z.array(z.never())),
});
export type Player = z.infer<typeof PlayerSchema>;

export const PlayerDetailsSchema = z.object({
  healers: z.array(PlayerSchema),
  tanks: z.array(PlayerSchema),
  dps: z.array(PlayerSchema),
});
export type PlayerDetails = z.infer<typeof PlayerDetailsSchema>;

export const PlayerDetailsRootSchema = z.object({
  data: z.object({
    playerDetails: PlayerDetailsSchema,
  }),
});
export type PlayerDetailsRoot = z.infer<typeof PlayerDetailsRootSchema>;
