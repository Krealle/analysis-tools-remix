import { z } from "zod";
import { PlayerDetailsSchema } from "./playerDetails";

export const SpecSchema = z.object({
  spec: z.string(),
  count: z.number().optional(),
});
export type Spec = z.infer<typeof SpecSchema>;

export const CompositionTableSchema = z.object({
  name: z.string(),
  id: z.number(),
  guid: z.number(),
  type: z.string(),
  specs: z.array(SpecSchema),
});
export type CompositionTable = z.infer<typeof CompositionTableSchema>;

export const DamageDoneTableSchema = z.object({
  name: z.string(),
  id: z.number(),
  guid: z.number(),
  type: z.string(),
  icon: z.string(),
  total: z.number(),
});
export type DamageDoneTable = z.infer<typeof DamageDoneTableSchema>;

export const HealingDoneTableSchema = z.object({
  name: z.string(),
  id: z.number(),
  guid: z.number(),
  type: z.string(),
  icon: z.string(),
  total: z.number(),
});
export type HealingDoneTable = z.infer<typeof HealingDoneTableSchema>;

export const DamageTakenTakenSchema = z.object({
  name: z.string(),
  guid: z.number(),
  type: z.number(),
  abilityIcon: z.string(),
  total: z.number(),
  composite: z.boolean().optional(),
});
export type DamageTakenTable = z.infer<typeof DamageTakenTakenSchema>;

export const DeathEventTableSchema = z.object({
  name: z.string(),
  id: z.number(),
  guid: z.number(),
  type: z.string(),
  icon: z.string(),
  deathTime: z.number(),
  ability: z
    .object({
      name: z.string(),
      guid: z.number(),
      type: z.number(),
      abilityIcon: z.string(),
    })
    .optional(),
});

export const SummaryTableSchema = z.object({
  totalTime: z.number(),
  itemLevel: z.number(),
  composition: z.array(CompositionTableSchema),
  damageDone: z.array(DamageDoneTableSchema),
  healingDone: z.array(HealingDoneTableSchema),
  damageTaken: z.array(DamageTakenTakenSchema),
  deathEvents: z.array(DeathEventTableSchema),
  playerDetails: PlayerDetailsSchema,
  logVersion: z.number(),
  gameVersion: z.number(),
});
export type SummaryTable = z.infer<typeof SummaryTableSchema>;
