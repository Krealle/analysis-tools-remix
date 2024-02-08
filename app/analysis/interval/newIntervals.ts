import { EnemyTracker } from "../../util/types";
import { AbilityFilters } from "../../zustand/fightParametersStore";
import {
  EbonMightWindowsMap,
  EbonMightWindow,
} from "../../zustand/intervalParametersStore";
import { Fight } from "../util/handleFightData";

/**
 * Evaluate the damage of a player by a certain factors:
 * - If the interval uses Breath either devalue non Breathable damage,
 *   or overvalue buffable damage.
 *
 * - Devalue non EM buffable damage.
 */

/** PlayerId, Damage Array */
export type PlayerDamageInInterval = Map<number, number[]>;

/** IntervalNum, Interval */
export type IntervalsInPhase = Map<number, Interval>;
export type Interval = {
  start: number;
  end: number;
  playerDamage: PlayerDamageInInterval;
  /** Whether or not this window was predefined - false for potential extra window */
  isAssignedWindow: boolean;
  isBreathWindow: boolean;
};

/** PhaseNum, Phase */
export type PhaseMap = Map<number, Phase>;
export type Phase = {
  phaseName: string;
  intervalsInPhase: IntervalsInPhase;
  /** Whether or not the current phase is actually one you can do damage in */
  isDamageablePhase: boolean;
  /** Used for non damageable phases */
  startTimes: number[];
  endTimes: number[];
};

export function getExperimentalIntervals(
  fights: Fight[],
  selectedFights: Set<number>,
  currentReportCode: string,
  enemyTracker: EnemyTracker,
  abilityFilters: AbilityFilters<number[]>,
  enemyBlacklist: Set<number>,
  deathCutOff: number,
  usePhases: boolean = true,
  ebonMightWindows: EbonMightWindowsMap
): PhaseMap {
  const phaseMap: PhaseMap = new Map();
  if (!fights.length) return phaseMap;

  for (const fight of fights) {
    if (
      !selectedFights.has(fight.fightId) ||
      fight.reportCode !== currentReportCode ||
      fight.difficulty === 10 // M+
    ) {
      continue;
    }
    let currInterval = 0;
    let currPhase = 0;
    /** Use this to offset */
    let currIntermissionCount = 0;

    const phaseEvents = [...fight.phaseEvents];
    let nextPhase = phaseEvents.shift();
    let phaseStart = fight.startTime;
    let phaseName = "Phase 1";

    // Initialize the first phase
    if (!phaseMap.get(currPhase)) {
      initializePhase(currPhase, phaseName, true, 0);
    }

    const deathCutOffTime =
      deathCutOff <= fight.deathEvents.length && deathCutOff !== 0
        ? fight.deathEvents[deathCutOff - 1].timestamp
        : undefined;

    let currEbonWindow = ebonMightWindows[currPhase]?.[currInterval];
    // TODO: make proper fallback
    // Could also just assume that people choose atleast 1 window madge
    if (!currEbonWindow) {
      console.warn(
        `No Ebon Might window found for phase ${currPhase} interval ${currInterval}`
      );
      continue; // Break out of fight loop
    }

    /** The temp map we will use to gather player damage into
     * This map will then be merged with main one if the interval is valid */
    const tempPlayerDamage: PlayerDamageInInterval = new Map();
    for (const event of fight.normalizedDamageEvents) {
      // Events to ignore
      if (
        event.source.spec === "Augmentation" ||
        event.normalizedAmount === 0 ||
        enemyBlacklist.has(enemyTracker.get(event.targetID) ?? -1) ||
        abilityFilters.blacklist.includes(event.abilityGameID) ||
        abilityFilters.noScaling.includes(event.abilityGameID) ||
        event.source.id === -1
      ) {
        continue;
      }

      // Death Cutoff
      if (deathCutOffTime && event.timestamp >= deathCutOffTime) {
        break; // Break out of event loop
      }

      // Phase check
      if (nextPhase && event.timestamp >= nextPhase.timestamp && usePhases) {
        /* console.info(
          `New phase ${nextPhase.name} at ${nextPhase.timestamp - phaseStart}`
        ); */

        // Resolve the current interval
        if (currEbonWindow && tempPlayerDamage.size > 0) {
          /* console.warn(
            `Resolving interval ${currInterval} in phase ${currPhase} - ${phaseName}`
          ); */
          resolveInterval(
            currPhase,
            currInterval,
            tempPlayerDamage,
            currEbonWindow
          );
        }

        currPhase += 1;
        currInterval = 0;
        phaseStart = nextPhase.timestamp;
        phaseName = nextPhase.name;

        // Do some logic to determine if this interval could have fit in before next window
        // TODO:
        tempPlayerDamage.clear();
        const upcomingPhase = { ...nextPhase };
        nextPhase = phaseEvents.shift();

        initializePhase(
          currPhase,
          phaseName,
          upcomingPhase.isDamageable,
          phaseStart - fight.startTime
        );

        if (!upcomingPhase.isDamageable) {
          currIntermissionCount += 1;
        }
        // We make one assumption, that we only have one non-damageable intermission per phase
        if (!upcomingPhase.isDamageable && nextPhase) {
          /* console.log(
            `Phase ${upcomingPhase.name} is intermission, adding intermission`
          ); */
          continue;
        }
        // We have no more phases and the upcoming one is not damageable so just break out of event loop
        if (!upcomingPhase.isDamageable && !nextPhase) {
          /* console.log(
            `Phase ${upcomingPhase.name} is intermission, and no more phases`
          ); */
          break;
        }

        currEbonWindow =
          ebonMightWindows[currPhase - currIntermissionCount]?.[currInterval];
        if (
          !currEbonWindow &&
          event.timestamp + 27_000 < upcomingPhase.timestamp
        ) {
          console.warn(
            `No Ebon Might window found for phase ${currPhase} interval ${currInterval} - ${phaseName}`
          );
        }
      }

      if (!currEbonWindow) {
        continue;
      }

      // Overlap Check
      const isInsideWindow =
        event.timestamp >= currEbonWindow.start * 1000 + phaseStart &&
        event.timestamp <= currEbonWindow.end * 1000 + phaseStart;
      if (!isInsideWindow) {
        // Event is before the current window so we need to skip it
        if (event.timestamp < currEbonWindow.start * 1000 + phaseStart) {
          continue;
        }
        // Event is after the current window so we need to go to the next one
        /* console.info(
          `Resolving interval ${currInterval} in phase ${currPhase} - ${phaseName} ${tempPlayerDamage.size}`
        ); */
        // Resolve the current interval
        resolveInterval(
          currPhase,
          currInterval,
          tempPlayerDamage,
          currEbonWindow
        );
        tempPlayerDamage.clear();

        // Go next logic
        currInterval += 1;
        // Check if we have a next interval
        currEbonWindow =
          ebonMightWindows[currPhase - currIntermissionCount]?.[currInterval];
        if (!currEbonWindow) {
          /* console.warn(
            `No Ebon Might window found for phase ${currPhase} interval ${currInterval} - ${phaseName}`
          ); */
          // If we don't have a next interval check if we could have fit in another interval
          // TODO: this currently does nothing
          if (nextPhase && nextPhase.isDamageable) {
            if (event.timestamp + 27_000 < nextPhase.timestamp) {
              console.warn(
                `Could have fit in another interval for phase ${currPhase} 
                after interval ${currInterval} - ${phaseName}`
              );
            }
          }
        }
        continue;
      }

      // Evaluate the event
      const multiplier = abilityFilters.noEbonMightScaling.includes(
        event.abilityGameID
      )
        ? currEbonWindow.useBreath
          ? 1
          : 0.5
        : 0;

      const amount = event.normalizedAmount * (1 - multiplier);

      const playerDamage = tempPlayerDamage.get(event.source.id) ?? [0];
      playerDamage[0] += amount;
      tempPlayerDamage.set(event.source.id, playerDamage);
    }
  }

  function resolveInterval(
    phaseNum: number,
    intervalNum: number,
    newPlayerDamage: PlayerDamageInInterval,
    currEbonWindow: EbonMightWindow
  ): void {
    /** It should not be possible for this to be undefined */
    const curPhase = phaseMap.get(phaseNum)!;
    if (!curPhase) {
      console.error(
        `Phase ${phaseNum} is undefined - this should be impossible`
      );
      return;
    }
    const curInterval = curPhase.intervalsInPhase.get(intervalNum) || {
      start: currEbonWindow.start * 1000,
      end: currEbonWindow.end * 1000,
      isAssignedWindow: !currEbonWindow.fabricated,
      playerDamage: new Map<number, number[]>(),
      isBreathWindow: currEbonWindow.useBreath,
    };

    // Add the new damage to the current interval
    const curPlayerDamage =
      curInterval.playerDamage || new Map<number, number[]>();
    newPlayerDamage.forEach((damage, playerId) => {
      const currDamage = curPlayerDamage.get(playerId) ?? [];
      currDamage.push(damage[0]);
      curPlayerDamage.set(playerId, currDamage);
    });

    // Update the interval
    curInterval.playerDamage = curPlayerDamage;
    // Update the phase
    curPhase.intervalsInPhase.set(intervalNum, curInterval);
    // Update the phase map
    phaseMap.set(phaseNum, curPhase);
  }

  function initializePhase(
    phaseNum: number,
    phaseName: string,
    isDamageable: boolean,
    start: number
  ): void {
    const curPhase = phaseMap.get(phaseNum) ?? {
      phaseName: phaseName,
      intervalsInPhase: new Map<number, Interval>(),
      isDamageablePhase: isDamageable,
      startTimes: [],
      endTimes: [],
    };
    curPhase.startTimes.push(start);

    const lastPhase = phaseMap.get(phaseNum - 1);
    if (lastPhase) {
      lastPhase.endTimes.push(start);
      phaseMap.set(phaseNum - 1, lastPhase);
    }

    phaseMap.set(phaseNum, curPhase);
  }

  return phaseMap;
}
