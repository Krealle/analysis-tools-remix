import { formatDuration, formatUnixTime, toCamelCase } from "../util/format";
import ButtonCheckbox from "./generic/ButtonCheckbox";
import "../styles/FightBoxes.css";
import { EncounterImages } from "../util/enemyTables";
import useWCLUrlInputStore from "../zustand/WCLUrlInputStore";
import useStatusStore from "../zustand/statusStore";
import useFightBoxesStore from "../zustand/fightBoxesStore";
import { ReportFight } from "../wcl/gql/types";
import { useCallback, useMemo } from "react";

const getFightPercentageColor = (fight: ReportFight) => {
  if (fight.kill) return "kill";
  if (!fight.fightPercentage) return "";

  switch (true) {
    case fight.fightPercentage > 70:
      return "common";
    case fight.fightPercentage > 50:
      return "uncommon";
    case fight.fightPercentage > 30:
      return "rare";
    case fight.fightPercentage > 10:
      return "epic";
    case fight.fightPercentage > 1:
      return "legendary";
    default:
      return "unfort";
  }
};

const getFightPhase = (fight: ReportFight) => {
  switch (true) {
    case (fight.lastPhase ?? 0) > 0:
      return `${fight.lastPhaseIsIntermission ? "I" : "P"}${fight.lastPhase}`;
    case !!fight.keystoneLevel:
      return `M ${fight.keystoneLevel}`;
    default:
      return "";
  }
};

const FightBoxes = () => {
  const { selectedIds, removeId, addId, setSelectedIds } = useFightBoxesStore();

  const isFetching = useStatusStore((state) => state.isFetching);
  const report = useWCLUrlInputStore((state) => state.fightReport);

  const handleDivClick = useCallback(
    (id: number) => {
      const isSelected = selectedIds.has(id);
      if (isSelected) {
        removeId(id);
      } else {
        addId(id);
      }
    },
    [selectedIds, removeId, addId]
  );

  const handleSelectFights = useCallback(
    (ids: number[]) => setSelectedIds(ids),
    [setSelectedIds]
  );

  const fightsByName = useMemo(() => {
    return (report?.fights || []).reduce((acc, fight) => {
      if (fight.difficulty) {
        const groupName = fight.name ?? "Unknown";
        acc[groupName] = acc[groupName] || [];
        acc[groupName]?.push(fight);
      }
      return acc;
    }, {} as Record<string, ReportFight[]>);
  }, [report]);

  if (!report?.fights) {
    return;
  }

  return (
    <div>
      {Object.entries(fightsByName).map(([groupName, fights]) => {
        const normalizedGroupName = toCamelCase(groupName);
        const fightIds = fights!.flatMap((fight) => fight.id);

        return (
          <div key={groupName} className="flex column fightContainer">
            <div className="flex fightsName">
              <img src={EncounterImages[normalizedGroupName]} alt="" />
              {groupName}
              <button
                className="fightSelectAll"
                onClick={() => handleSelectFights(fightIds)}
              >
                Select All
              </button>
            </div>
            <div className="flex fights">
              {fights!.map((fight) => {
                const fightPercentageColor = getFightPercentageColor(fight);

                const content = (
                  <>
                    <div className="flex column">
                      <span
                        className={`fightPercentage ${fightPercentageColor}`}
                      >
                        {fight.kill ? "KILL" : `${fight.fightPercentage}%`}
                      </span>
                      <span className="phase">{getFightPhase(fight)}</span>
                    </div>
                    <div className="flex column">
                      <span className={fight.kill ? "kill" : "wipe"}>
                        {`${fight.id} - (${
                          fight.keystoneTime
                            ? formatDuration(fight.keystoneTime)
                            : formatDuration(fight.endTime - fight.startTime)
                        })`}
                        {}
                      </span>
                      <span>
                        {formatUnixTime(fight.startTime + report.startTime)}
                      </span>
                    </div>
                  </>
                );

                return (
                  <ButtonCheckbox
                    key={fight.id}
                    onClick={() => handleDivClick(fight.id)}
                    selected={selectedIds.has(fight.id)}
                    content={content}
                    id={"fightButton"}
                    disabled={isFetching}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FightBoxes;
