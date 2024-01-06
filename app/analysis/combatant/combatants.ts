import { Static, Type } from "@sinclair/typebox";
import { Buff, getBuffHistory } from "./buffs";
import {
  CombatantInfo,
  PlayerDetails,
} from "../../wcl/types/report/playerDetails";
import { Actor } from "../../wcl/types/report/masterData";

export const BaseStats = Type.Object({
  timestamp: Type.Number(),
  playerId: Type.Number(),
  MainStat: Type.Number(),
  Mastery: Type.Number(),
  Haste: Type.Number(),
  Crit: Type.Number(),
  Versatility: Type.Number(),
});
export type BaseStats = Static<typeof BaseStats>;

export const Pet = Type.Object({
  name: Type.String(),
  id: Type.Number(),
  petOwner: Type.Number(),
});
export type Pet = Static<typeof Pet>;

export const Combatant = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  pets: Type.Array(Pet),
  buffHistory: Type.Array(Buff),
  baseStats: Type.Optional(BaseStats),
  class: Type.String(),
  server: Type.Optional(Type.String()),
  icon: Type.String(),
  spec: Type.String(),
  role: Type.String(),
  combatantInfo: Type.Union([CombatantInfo, Type.Array(Type.Never())]),
});
export type Combatant = Static<typeof Combatant>;

export type Combatants = Map<number, Combatant>;

export function generateCombatants(
  buffHistories: Buff[],
  playerDetails: PlayerDetails,
  actors: Actor[] | undefined
): Combatants {
  const combatants: Combatants = new Map();

  Object.keys(playerDetails).forEach((key) => {
    playerDetails[key as keyof PlayerDetails].forEach((player) => {
      const combatant = {
        id: player.id,
        name: player.name,
        pets: findPets(player.id, actors),
        buffHistory: getBuffHistory(player.id, buffHistories),
        //baseStats: getBaseStats(player),
        class: player.type,
        server: player.server,
        icon: player.icon,
        spec: player.specs[0],
        role: key,
        combatantInfo: player.combatantInfo,
      };
      combatants.set(player.id, combatant);
    });
  });

  return combatants;
}

function findPets(playerId: number, actors: Actor[] | undefined): Pet[] {
  if (!actors) {
    return [];
  }
  return actors.reduce<Pet[]>((acc, actor) => {
    if (actor.petOwner === playerId) {
      return acc.concat({
        name: actor.name ?? "Unknown pet",
        id: actor.id,
        petOwner: playerId,
      });
    }

    return acc;
  }, []);
}
