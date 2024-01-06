import { Static, Type } from "@sinclair/typebox";
import { PlayerDetails } from "./playerDetails";

export const Spec = Type.Object({
  spec: Type.String(),
  count: Type.Optional(Type.Number()),
});

export const CompositionTable = Type.Object({
  name: Type.String(),
  id: Type.Number(),
  guid: Type.Number(),
  type: Type.String(),
  specs: Type.Array(Spec),
});

export const DamageDoneTable = Type.Object({
  name: Type.String(),
  id: Type.Number(),
  guid: Type.Number(),
  type: Type.String(),
  icon: Type.String(),
  total: Type.Number(),
});

export const HealingDoneTable = Type.Object({
  name: Type.String(),
  id: Type.Number(),
  guid: Type.Number(),
  type: Type.String(),
  icon: Type.String(),
  total: Type.Number(),
});

export const DamageTakenTaken = Type.Object({
  name: Type.String(),
  guid: Type.Number(),
  type: Type.Number(),
  abilityIcon: Type.String(),
  total: Type.Number(),
  composite: Type.Optional(Type.Boolean()),
});

export const DeathEventTable = Type.Object({
  name: Type.String(),
  id: Type.Number(),
  guid: Type.Number(),
  type: Type.String(),
  icon: Type.String(),
  deathTime: Type.Number(),
  ability: Type.Optional(
    Type.Object({
      name: Type.String(),
      guid: Type.Number(),
      type: Type.Number(),
      abilityIcon: Type.String(),
    })
  ),
});

export const SummaryTable = Type.Object({
  totalTime: Type.Number(),
  itemLevel: Type.Number(),
  composition: Type.Array(CompositionTable),
  damageDone: Type.Array(DamageDoneTable),
  healingDone: Type.Array(HealingDoneTable),
  damageTaken: Type.Array(DamageTakenTaken),
  deathEvents: Type.Array(DeathEventTable),
  playerDetails: PlayerDetails,
  logVersion: Type.Number(),
  gameVersion: Type.Number(),
});
export type SummaryTable = Static<typeof SummaryTable>;
