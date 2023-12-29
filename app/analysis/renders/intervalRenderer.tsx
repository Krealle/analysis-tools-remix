import { formatDuration, formatNumber } from "../../util/format";
import { Combatant } from "../combatant/combatants";
import { getTop4Pumpers } from "../interval/intervals";
import "../../styles/intervalRenderer.css";
import { getMRTNote } from "../interval/mrtNote";
import { TotInterval } from "../../util/types";

const intervalRenderer = (
  intervals: TotInterval[],
  combatants: Combatant[]
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

  for (const interval of top4Pumpers) {
    const formattedEntriesTable: JSX.Element[][] = interval.intervalEntries.map(
      (entries) =>
        entries.map((player) => (
          <td key={player.id}>
            <span
              className={
                combatants.find((combatant) => combatant.id === player.id)
                  ?.class ?? ""
              }
            >
              {combatants.find((combatant) => combatant.id === player.id)
                ?.name ?? ""}{" "}
              - {formatNumber(player.damage)}
            </span>
          </td>
        ))
    );

    tableRows.push(
      <tr key={interval.currentInterval}>
        <td>
          {formatDuration(interval.start)} - {formatDuration(interval.end)}
        </td>
        {formattedEntriesTable}
      </tr>
    );
  }

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
