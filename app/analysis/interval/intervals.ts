import { EnemyTracker } from "../../util/types";
import { AbilityFilters } from "../../zustand/fightParametersStore";
import {
  EbonMightWindowsMap,
  EbonMightWindow,
  AutoGenWindowSettings,
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

export function getIntervals(
  fights: Fight[],
  selectedFights: Set<number>,
  currentReportCode: string,
  enemyTracker: EnemyTracker,
  abilityFilters: AbilityFilters<Set<number>>,
  enemyBlacklist: Set<number>,
  deathCutOff: number,
  /** Mainly used to turn off phase usage when comparing lots of different fights at once */
  usePhases: boolean = true,
  ebonMightWindows: EbonMightWindowsMap,
  autoGenSettings: AutoGenWindowSettings
): PhaseMap {
  const phaseMap: PhaseMap = new Map();
  if (!fights.length) return phaseMap;

  /** Here we try to resolve if we should inject extra windows - base it on the longest fight */
  if (ebonMightWindows) {
    ebonMightWindows = addExtraWindows();
  }

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
        abilityFilters.blacklist.has(event.abilityGameID) ||
        abilityFilters.noScaling.has(event.abilityGameID) ||
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
      const multiplier = abilityFilters.noEbonMightScaling.has(
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

  /**
   * Checks to see if we can fit in extra windows between the pre-selected ones.
   * And adds them to the ebonMightWindows, the new windows are based on the longest fight selected.
   */
  function addExtraWindows(): EbonMightWindowsMap {
    const longestFight = fights.reduce((maxFight, currentFight) => {
      return currentFight.endTime - currentFight.startTime >
        maxFight.endTime - maxFight.startTime
        ? currentFight
        : maxFight;
    }, fights[0]);

    const newEbonMightWindows = ebonMightWindows;
    const phaseEvents = [...longestFight.phaseEvents];

    const amountOfPhases =
      Object.keys(newEbonMightWindows).length > 0 && usePhases
        ? Object.keys(newEbonMightWindows).length
        : 1;

    /** Settings for window gen */
    const ebonMightCooldown = autoGenSettings.Threads ? 27 : 30;
    const defaultWindowLength = autoGenSettings["Window Length"];
    const windowDelay = autoGenSettings["Window Delay"];

    let curStartTime = longestFight.startTime;
    for (let phase = 0; amountOfPhases > phase; phase += 1) {
      let nextPhase = phaseEvents.shift();

      const phaseEndTime =
        nextPhase && usePhases ? nextPhase.timestamp : longestFight.endTime;
      const phaseLength = (phaseEndTime - curStartTime) / 1000; // in seconds

      /* console.log("phase", phase);
      console.log("nextPhase", nextPhase);
      console.log("curStartTime", curStartTime);
      console.log("phaseEndTime", phaseEndTime);
      console.log("phaseLength", phaseLength); */

      /** Loop over our current windows and see if we can fit in more between them
       * At the end check if we can fit in more windows before phase change / fight end
       * Initialize array with an entry if it's empty */
      if (!newEbonMightWindows[phase].length) {
        newEbonMightWindows[phase] = [
          {
            fabricated: true,
            start: windowDelay,
            end: windowDelay + defaultWindowLength,
            useBreath: false,
          },
        ];
      }
      const reducedNewEbonMightWindows = newEbonMightWindows[phase].reduce<
        EbonMightWindow[]
      >((acc, curWindow, idx) => {
        let prevWindow = idx > 0 ? acc[acc.length - 1] : undefined;

        /** Check to see if we can squeeze in windows between previous and upcoming */
        let generateWindow = true;
        while (generateWindow) {
          const prevWindowLength = prevWindow
            ? prevWindow.end - prevWindow.start
            : 0;

          const windowBuffer = prevWindow
            ? getWindowBuffer(ebonMightCooldown, prevWindowLength, windowDelay)
            : windowDelay;
          const windowSpaceNeeded = defaultWindowLength + windowBuffer * 2;

          generateWindow = canFitExtraWindow(
            curWindow.start - (prevWindow?.end ?? 0),
            windowSpaceNeeded
          );

          if (generateWindow) {
            const newStart = (prevWindow?.end ?? 0) + windowBuffer;
            const newEnd = newStart + defaultWindowLength;

            const newWindow = {
              fabricated: true,
              start: newStart,
              end: newEnd,
              useBreath: false,
            };

            prevWindow = newWindow;
            acc.push(newWindow);
          } else {
            generateWindow = false;
          }
        }

        acc.push(curWindow);

        /** Check to see if we can fit in more windows before phase change / fight end */
        if (idx === newEbonMightWindows[phase].length - 1) {
          let lastWindow = curWindow;

          const lastWindowLength = lastWindow.end - lastWindow.start;
          const windowBuffer = getWindowBuffer(
            ebonMightCooldown,
            lastWindowLength,
            windowDelay
          );

          const windowSpaceNeeded = defaultWindowLength + windowBuffer * 2;

          let generateWindows = canFitExtraWindow(
            phaseLength - lastWindow.end,
            windowSpaceNeeded
          );

          while (generateWindows) {
            const lastWindowLength = lastWindow
              ? lastWindow.end - lastWindow.start
              : defaultWindowLength;

            const windowBuffer = lastWindow
              ? getWindowBuffer(
                  ebonMightCooldown,
                  lastWindowLength,
                  windowDelay
                )
              : windowDelay;

            const newStart = lastWindow.end + windowBuffer;
            const newEnd = newStart + defaultWindowLength;

            const newWindow = {
              fabricated: true,
              start: newStart,
              end: newEnd,
              useBreath: false,
            };

            acc.push(newWindow);
            lastWindow = newWindow;

            const newWindowBuffer = getWindowBuffer(
              ebonMightCooldown,
              lastWindowLength,
              windowDelay
            );
            const windowSpaceNeeded = defaultWindowLength + newWindowBuffer * 2;
            const timeTillPhaseEnd = phaseLength - newEnd;

            const keepGenerating = canFitExtraWindow(
              timeTillPhaseEnd,
              windowSpaceNeeded
            );
            if (!keepGenerating) {
              // Check to see if we can sneak in an extra window if upcoming phase is an intermission
              if (nextPhase && !nextPhase.isDamageable && phaseEvents.length) {
                const nextRealPhaseStart = phaseEvents[0].timestamp;
                const intermissionLength =
                  (nextRealPhaseStart - nextPhase.timestamp) / 1000;

                const keepGenerating = canFitExtraWindow(
                  timeTillPhaseEnd + intermissionLength,
                  windowSpaceNeeded
                );

                if (keepGenerating) {
                  continue;
                }
              }

              generateWindows = false;
            }
          }
        }

        return acc;
      }, []);
      /* console.log(reducedNewEbonMightWindows); */
      newEbonMightWindows[phase] = reducedNewEbonMightWindows;

      if (nextPhase) {
        /* console.group("Next phase setup"); */
        const potentiallyIntermission = nextPhase;

        if (!potentiallyIntermission.isDamageable) {
          nextPhase = phaseEvents.shift();
          if (!nextPhase) {
            // If we don't have any more real phases don't try to create any more windows.
            console.groupEnd();
            break;
          }
        }

        /* console.log("potentiallyIntermission", potentiallyIntermission);
        console.log("nextPhase", nextPhase); */

        const intermissionLength =
          (nextPhase.timestamp - potentiallyIntermission.timestamp) / 1000 ?? 0;

        /* console.log("intermissionLength", intermissionLength); */

        const lastEbonWindow =
          newEbonMightWindows?.[phase]?.[
            newEbonMightWindows?.[phase].length - 1
          ];

        const timeToNextPhase =
          (nextPhase.timestamp - curStartTime + intermissionLength) / 1000 -
            lastEbonWindow.end ?? 0;
        /* console.log("timeToNextPhase", timeToNextPhase); */

        const windowBuffer = getWindowBuffer(
          ebonMightCooldown,
          defaultWindowLength,
          windowDelay
        );

        const startTimeOffset =
          timeToNextPhase < windowBuffer ? windowBuffer - timeToNextPhase : 0;

        curStartTime = nextPhase.timestamp + startTimeOffset;

        /* console.groupEnd(); */
      } else {
        // If we don't have any more real phases don't try to create any more windows.
        break;
      }
    }

    return newEbonMightWindows;
  }

  return phaseMap;
}

function getWindowBuffer(
  ebonMightCooldown: number,
  windowLength: number,
  windowDelay: number
): number {
  const windowBuffer =
    Math.max(ebonMightCooldown - windowLength, 0) + windowDelay;
  return windowBuffer;
}

/** Check to see if we can fit in an extra window between two windows or before an intermission. */
function canFitExtraWindow(gap: number, requiredGapLength: number): boolean {
  return gap >= requiredGapLength;
}
