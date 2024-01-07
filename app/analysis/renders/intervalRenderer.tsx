import { formatDuration, formatNumber } from "../../util/format";
import { Combatants } from "../combatant/combatants";
import { getTop4Pumpers } from "../interval/intervals";
import "../../styles/intervalRenderer.css";
import { getMRTNote } from "../interval/mrtNote";
import { TotInterval } from "../../util/types";

const intervalRenderer = (
  intervals: TotInterval[],
  combatants: Combatants,
  amountOfFights: number
): JSX.Element => {
  if (intervals.length === 0) {
    return <>No data found</>;
  }
  const top4Pumpers: TotInterval[] = getTop4Pumpers(intervals);

  const tableRows: JSX.Element[] = [];
  const headerRow = (
    <tr>
      <th>Time</th>
      <th>Player - Damage</th>
      <th>Player - Damage</th>
      <th>Player - Damage</th>
      <th>Player - Damage</th>
    </tr>
  );

  let phaseCutoff = 0;
  top4Pumpers.forEach((interval, idx) => {
    const formattedEntriesTable: JSX.Element[][] = interval.intervalEntries.map(
      (entries) =>
        entries.map((player) => (
          <td key={player.id}>
            <span className={combatants.get(player.id)?.class ?? ""}>
              {combatants.get(player.id)?.name ?? ""} -{" "}
              {formatNumber(player.damage)}
            </span>
          </td>
        ))
    );

    tableRows.push(
      <tr key={`${interval.currentInterval}-${interval.currentPhase}`}>
        <td>
          {formatDuration(Math.abs(interval.start - phaseCutoff))} -{" "}
          {formatDuration(Math.abs(interval.end - phaseCutoff))}
        </td>
        {formattedEntriesTable}
      </tr>
    );

    if (interval.phaseChange) {
      if (amountOfFights > 1) {
        phaseCutoff = top4Pumpers[idx + 1]?.start ?? 0;
      }
      tableRows.push(
        <tr key={interval.phaseChange.phaseName}>
          <td colSpan={5}>
            <b>{interval.phaseChange.phaseName}</b>
          </td>
        </tr>
      );
    }
  });

  const mrtNote = getMRTNote(intervals, combatants);
  const noteTextbox = (
    <textarea readOnly value={mrtNote} className="mrtNoteTextbox" />
  );

  return (
    <>
      <div className="flex gap flex-wrap flex-top">
        <div>
          <h3>Intervals</h3>
          <table className="intervalTable">
            <tbody>
              {headerRow}
              {tableRows}
            </tbody>
          </table>
          {amountOfFights > 1 && (
            <em>
              <small>
                * In multi-fight analysis, phase timers are relative due to
                varying push timings in individual pulls
              </small>
            </em>
          )}
        </div>
        <div>
          <h3>MRT note</h3>
          <p className="small">
            This note is meant to be used with{" "}
            <a href="https://wago.io/yrmx6ZQSG">Prescience Helper</a> WA by{" "}
            <b>HenryG</b>.
            <br />
            It will also work with{" "}
            <a href="https://wago.io/KP-BlDV58">Frame Glows</a> WA by{" "}
            <b>Zephy</b>.
            <br />
            It is not meant for hyper-optimized play, but rather as a helping
            hand.
          </p>
          {noteTextbox}
        </div>
      </div>
    </>
  );
};

export default intervalRenderer;
