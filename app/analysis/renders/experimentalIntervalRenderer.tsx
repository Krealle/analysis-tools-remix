/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatDuration, formatNumber } from "../../util/format";
import { IntervalSet } from "../../util/types";
import { Combatants } from "../combatant/combatants";
import { PhaseMap, PlayerDamageInInterval } from "../interval/newIntervals";

const experimentalIntervalRenderer = (
  phaseMap: PhaseMap,
  combatants: Combatants,
  amountOfFights: number,
  amount: number = 6
): JSX.Element => {
  if (phaseMap.size === 0) {
    return <>No data found</>;
  }

  const tableRows: JSX.Element[] = [];
  const headerRow = (
    <tr>
      <th>Time</th>
      {Array.from({ length: amount }, (_, i) => (
        <th key={i}>Player - Damage</th>
      ))}
    </tr>
  );

  phaseMap.forEach((phase, phaseNum) => {
    const { avgStart, avgEnd } = getNormalizedTimes(
      phase.startTimes,
      phase.endTimes
    );

    let timeInformation =
      phaseNum === 0 ? `` : `- avgStart ${formatDuration(avgStart)}`;

    if (avgEnd) {
      timeInformation += ` - avgDur ${formatDuration(avgEnd - avgStart)}`;
    }

    tableRows.push(
      <tr key={phase.phaseName}>
        <td colSpan={amount + 1}>
          <b>{phase.phaseName}</b> {timeInformation}
        </td>
      </tr>
    );

    if (phase.isDamageablePhase) {
      phase.intervalsInPhase.forEach((interval, intervalNum) => {
        const normalizedDamage = normalizeInterval(
          interval.playerDamage,
          false,
          amount
        );

        const formattedEntries: JSX.Element[] = normalizedDamage.map(
          (player) => (
            <td key={player.id}>
              <span className={combatants.get(player.id)?.class ?? ""}>
                {combatants.get(player.id)?.name ?? ""} -{" "}
                {formatNumber(player.damage)}
              </span>
            </td>
          )
        );

        tableRows.push(
          <tr
            key={`${phaseNum}-${intervalNum}`}
            className={`${interval.isBreathWindow && "breath-window"}`}
          >
            <td>
              {formatDuration(Math.abs(interval.start))} -{" "}
              {formatDuration(Math.abs(interval.end))}
              <br />
              ~({formatDuration(Math.abs(interval.start + avgStart))} -{" "}
              {formatDuration(Math.abs(interval.end + avgStart))})
            </td>
            {formattedEntries}
          </tr>
        );
      });
    }
  });

  return (
    <>
      <div className="flex gap flex-wrap flex-top">
        <div>
          <h3>Experimental Intervals</h3>
          <table className="intervalTable">
            <tbody>
              {headerRow}
              {tableRows}
            </tbody>
          </table>
          {amountOfFights > 1 && (
            <em>
              <small>
                * Phase timers are relative due to varying push timings in
                individual pulls
              </small>
            </em>
          )}
        </div>
      </div>
    </>
  );
};

export function normalizeInterval(
  playerDamage: PlayerDamageInInterval,
  noSplice?: boolean,
  amount: number = 4
): IntervalSet {
  const intervalSet: IntervalSet = [];

  playerDamage.forEach((playerDam, id) => {
    const damage =
      playerDam.reduce((acc, cur) => acc + cur, 0) / playerDam.length;
    intervalSet.push({ id, damage });
  });

  intervalSet.sort((a, b) => b.damage - a.damage);

  return noSplice ? intervalSet : intervalSet.splice(0, amount);
}

type NormalizedTimes = {
  lowestStart: number;
  highestStart: number;
  avgStart: number;
  lowestEnd: number;
  highestEnd: number;
  avgEnd: number;
};
export function getNormalizedTimes(
  starts: number[],
  end: number[]
): NormalizedTimes {
  const lowestStart = Math.min(...starts);
  const highestStart = Math.max(...starts);
  const avgStart = starts.reduce((acc, cur) => acc + cur, 0) / starts.length;

  const lowestEnd = Math.min(...end);
  const highestEnd = Math.max(...end);
  const avgEnd = end.reduce((acc, cur) => acc + cur, 0) / end.length;

  return {
    lowestStart,
    highestStart,
    avgStart,
    lowestEnd,
    highestEnd,
    avgEnd,
  };
}

export default experimentalIntervalRenderer;
