import {
  EnemyTracker,
  FormattedTimeSkipIntervals,
  IntervalEntry,
  IntervalSet,
  TotInterval,
} from "../../util/types";
import { AbilityFilters } from "../../zustand/fightParametersStore";
import { Fight } from "../util/handleFightData";

export function getAverageIntervals(
  fights: Fight[],
  selectedFights: Set<number>,
  currentReportCode: string,
  timeSkipIntervals: FormattedTimeSkipIntervals[],
  enemyTracker: EnemyTracker,
  abilityFilters: AbilityFilters<number[]>,
  ebonWeight: number,
  intervalDuration: number,
  enemyBlacklist: Set<number>,
  deathCutOff: number,
  usePhases: boolean = true
): TotInterval[] {
  const sortedIntervals: TotInterval[] = [];

  for (const fight of fights) {
    if (
      !selectedFights.has(fight.fightId) ||
      fight.reportCode !== currentReportCode ||
      fight.difficulty === 10 // M+
    ) {
      continue;
    }
    let currentInterval = 1;

    const intervalDur = intervalDuration * 1_000;
    let intervalTimer = fight.startTime;
    const interval: IntervalSet = [];
    let latestTimestamp = 0;

    const deathCutOffTime =
      deathCutOff <= fight.deathEvents.length && deathCutOff !== 0
        ? fight.deathEvents[deathCutOff - 1].timestamp
        : undefined;

    const phaseEvents = [...fight.phaseEvents];
    let nextPhase = phaseEvents.shift();
    let currentPhase = 1;
    let isDamageablePhase = true;

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
        break;
      }

      // Time Skip check
      const overlapsWithTimeSkip = timeSkipIntervals.some((skipInterval) => {
        return (
          event.timestamp >= skipInterval.start + fight.startTime &&
          event.timestamp <= skipInterval.end + fight.startTime
        );
      });

      // Phase check
      const isPhaseChange = nextPhase
        ? event.timestamp >= nextPhase.timestamp && usePhases
        : false;

      if (
        event.timestamp > intervalTimer + intervalDur ||
        overlapsWithTimeSkip ||
        isPhaseChange
      ) {
        if (interval.length) {
          const sortedInterval = interval.splice(0, interval.length);
          sortedInterval.sort((a, b) => b.damage - a.damage);

          const existingEntry = sortedIntervals.find(
            (entry) =>
              entry.currentInterval === currentInterval &&
              entry.currentPhase === currentPhase
          );

          // Use timestamp from last event if possible
          const endTimestamp =
            (latestTimestamp > 0 ? latestTimestamp : event.timestamp) -
            fight.startTime;

          if (existingEntry) {
            // Update end timestamp if needed
            if (endTimestamp > existingEntry.end) {
              // Make sure we don't go over the interval duration
              // Creates all sort of issues if we do
              const newEndTimestamp =
                endTimestamp - existingEntry.start > intervalDur
                  ? existingEntry.start + intervalDur
                  : endTimestamp;
              existingEntry.end = newEndTimestamp;
            }

            existingEntry.intervalEntries.push(sortedInterval);
          } else {
            const startTimestamp = intervalTimer - fight.startTime;

            const newInterval = {
              currentInterval,
              intervalEntries: [sortedInterval],
              start: startTimestamp,
              end: endTimestamp,
              currentPhase: currentPhase,
              phaseChange: isPhaseChange
                ? {
                    phaseName: nextPhase!.name,
                  }
                : undefined,
              isDamageable: isDamageablePhase,
            };

            const earliestPhaseChange = usePhases
              ? sortedIntervals.findIndex(
                  (entry) =>
                    entry.phaseChange && entry.currentPhase === currentPhase
                )
              : -1;

            /**
             * So because the timings for when you enter a new phase isn't static
             * we might have phase changed in interval 5, but now we are in interval 6
             * we need to move the phase change to interval 6.
             */
            if (
              earliestPhaseChange !== -1 &&
              earliestPhaseChange < currentInterval - 1
            ) {
              if (!isPhaseChange) {
                newInterval.phaseChange =
                  sortedIntervals[earliestPhaseChange].phaseChange;
              }

              sortedIntervals[earliestPhaseChange].phaseChange = undefined;

              sortedIntervals.splice(earliestPhaseChange + 1, 0, newInterval);
            } else {
              sortedIntervals.push(newInterval);
            }
          }

          currentInterval += 1;
        }

        if (isPhaseChange) {
          isDamageablePhase = nextPhase!.isDamageable;
          nextPhase = phaseEvents.shift();
          currentPhase += 1;
          currentInterval = 1;
        }

        intervalTimer = event.timestamp;
        if (overlapsWithTimeSkip) {
          continue;
        }
      }
      latestTimestamp = event.timestamp;

      const multiplier = abilityFilters.noEbonMightScaling.includes(
        event.abilityGameID
      )
        ? ebonWeight
        : 0;

      const amount = event.normalizedAmount * (1 - multiplier);

      const intervalEntry = interval.find(
        (entry) => entry.id === event.source.id
      );

      if (intervalEntry) {
        intervalEntry.damage += amount;
      } else {
        interval.push({
          id: event.source.id,
          damage: amount,
        });
      }
    }
  }
  const averageIntervals = averageOutIntervals(sortedIntervals);

  return averageIntervals;
}

export function averageOutIntervals(
  totIntervals: TotInterval[]
): TotInterval[] {
  const avgIntervals: TotInterval[] = [];

  for (const entry of totIntervals) {
    const currentInterval = entry.currentInterval;
    const intervalRecord: Record<
      number,
      { totalDamage: number; count: number }
    > = {};

    for (const interval of entry.intervalEntries) {
      for (const { id, damage } of interval) {
        if (!intervalRecord[id]) {
          intervalRecord[id] = { totalDamage: damage, count: 1 };
        } else {
          intervalRecord[id].totalDamage += damage;
          intervalRecord[id].count += 1;
        }
      }
    }

    const intervalSet: IntervalEntry[] = Object.entries(intervalRecord).map(
      ([id, intervalData]) => ({
        id: Number(id),
        damage: intervalData.totalDamage / intervalData.count,
      })
    );

    const sortedIntervalSet = intervalSet.sort((a, b) => b.damage - a.damage);

    avgIntervals.push({
      currentInterval: currentInterval,
      intervalEntries: [sortedIntervalSet],
      start: entry.start,
      end: entry.end,
      currentPhase: entry.currentPhase,
      phaseChange: entry.phaseChange,
      isDamageable: entry.isDamageable,
    });
  }

  return avgIntervals;
}

export function getTop4Pumpers(topPumpersData: TotInterval[]): TotInterval[] {
  return topPumpersData.map((interval) => ({
    currentInterval: interval.currentInterval,
    intervalEntries: [interval.intervalEntries[0].slice(0, 4)],
    start: interval.start,
    end: interval.end,
    currentPhase: interval.currentPhase,
    phaseChange: interval.phaseChange,
    isDamageable: interval.isDamageable,
  }));
}
