import { Actor, CombatantInfo, PlayerDetails } from "../../wcl/gql/types";
import { Buff, getBuffHistory } from "./buffs";

export type BaseStats = {
  timestamp: number;
  playerId: number;
  MainStat: number;
  Mastery: number;
  Haste: number;
  Crit: number;
  Versatility: number;
};

export type Combatant = {
  id: number;
  name: string;
  pets: Pet[];
  buffHistory: Buff[];
  baseStats?: BaseStats;
  class: string;
  server?: string;
  icon: string;
  spec: string;
  role: string;
  combatantInfo: CombatantInfo | never[];
};

export type Combatants = Map<number, Combatant>;

export type Pet = {
  name: string;
  id: number;
  petOwner: number;
};

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
