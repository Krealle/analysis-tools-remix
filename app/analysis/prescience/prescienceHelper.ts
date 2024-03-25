/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Combatant,
  Combatants,
  getCombatantByName,
  hasTalent,
} from "../combatant/combatants";
import { PhaseMap } from "../interval/newIntervals";
import {
  getNormalizedTimes,
  normalizeInterval,
} from "../renders/experimentalIntervalRenderer";

type PrescienceUsage = {
  isLong: boolean;
  start: number;
  end: number;
};
type PrescienceMap = Map<number, PrescienceUsage[]>;

type Prescience = {
  first: number;
  second: number;
};

export function buildPrescienceMap(
  phaseMap: PhaseMap,
  combatants: Combatants,
  playerName: string
) {
  const selectedCombatant = getCombatantByName(playerName, combatants);
  if (!selectedCombatant) {
    console.error("Selected combatant not found");
    return;
  }
  const prescienceMap: PrescienceMap = new Map();

  const hasInterwovenThreads = hasTalent(338793, selectedCombatant);
  const presDuration = 22_000; // Estimation
  const presCooldown = 12_000 * (hasInterwovenThreads ? 0.9 : 1);

  let prescienceCount = 3;
  let curTime = 0;
  const prescience: Prescience = {
    first: 0,
    second: 0,
  };

  phaseMap.forEach((phase, phaseNum) => {
    const { avgStart, avgEnd } = getNormalizedTimes(
      phase.startTimes,
      phase.endTimes
    );
    const nextPhase = phaseMap.get(phaseNum + 1);

    phase.intervalsInPhase.forEach((interval, intervalNum) => {
      const firstWindow = normalizeInterval(interval.playerDamage, true);
      const secondInterval = phase.intervalsInPhase.get(intervalNum + 1);
      const thirdInterval = phase.intervalsInPhase.get(intervalNum + 2);

      // Pull
      if (phaseNum === 0 && intervalNum === 0) {
        if (secondInterval) {
          const secondWindow = normalizeInterval(
            secondInterval.playerDamage,
            true
          );
        }
      }
    });
  });
}

/** Returns how many Prescience are ready */
function getAmountAvailable(
  prescience: Prescience,
  time: number,
  cooldown: number
): number {
  let amount = time > prescience.first + cooldown ? 1 : 0;
  amount += time > prescience.second + cooldown ? 1 : 0;
  return amount;
}

/** Set first available Prescience on CD */
function setCooldown(
  prescience: Prescience,
  time: number,
  cooldown: number
): Prescience {
  if (time > prescience.first + cooldown) {
    prescience.first = time;
  } else if (time > prescience.second + cooldown) {
    prescience.second = time;
  }
  return prescience;
}

/** Get CD left on first available Prescience */
function getPrescienceCD(
  prescience: Prescience,
  time: number,
  cooldown: number
): number {
  const hasPres = getAmountAvailable(prescience, time, cooldown);
  if (hasPres > 0) {
    return 0;
  }

  const prescienceToCheck =
    prescience.first > prescience.second ? prescience.second : prescience.first;

  if (time > prescienceToCheck + cooldown) {
    return prescienceToCheck + cooldown - time;
  }
  return 0;
}
