import { formatDuration, formatUnixTime } from "../util/format";
import ButtonCheckbox from "./generic/ButtonCheckbox";
import "../styles/FightBoxes.css";
import { EncounterNames, getEncounter } from "../util/encounters/encounters";
import useWCLUrlInputStore from "../zustand/WCLUrlInputStore";
import useStatusStore from "../zustand/statusStore";
import useFightBoxesStore from "../zustand/fightBoxesStore";
import React, { useCallback, useEffect, useMemo } from "react";
import { ReportFight } from "../wcl/types/report/report";
import useIntervalParametersStore from "../zustand/intervalParametersStore";
import { IsKnownEncounter } from "../util/encounters/types";
import Collapse from "./generic/Collapse";

type FightPercentageColor =
  | "kill"
  | ""
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "unfort";

const getFightPercentageColor = (fight: ReportFight): FightPercentageColor => {
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

const getFightPhase = (fight: ReportFight): string => {
  switch (true) {
    case (fight.lastPhase ?? 0) > 0:
      return `${fight.lastPhaseIsIntermission ? "I" : "P"}${fight.lastPhase}`;
    case Boolean(fight.keystoneLevel):
      return `M ${fight.keystoneLevel}`;
    default:
      return "";
  }
};

const fightsToInitialize = new Set<string>();

const FightBoxes = (): JSX.Element => {
  const {
    selectedIds,
    removeId,
    addId,
    setSelectedIds,
    collapsedFights,
    collapseFight,
  } = useFightBoxesStore();

  const isFetching = useStatusStore((state) => state.isFetching);
  const report = useWCLUrlInputStore((state) => state.fightReport);
  const changeIntervalToUse = useIntervalParametersStore(
    (state) => state.changeIntervalToUse
  );

  useEffect(() => {
    /** Fallback */
    if (selectedIds.size === 0 || !report?.fights) {
      changeIntervalToUse(EncounterNames.Default);
      return;
    }

    const selectedFights = report.fights.filter((fight) =>
      selectedIds.has(fight.id)
    );

    const isSameBoss = selectedFights.every(
      (fight, i, arr) =>
        fight.name && (i === 0 || fight.name === arr[i - 1].name)
    );

    const encounterName = selectedFights[0].name;

    if (isSameBoss && IsKnownEncounter(encounterName)) {
      changeIntervalToUse(encounterName);
    } else {
      changeIntervalToUse(EncounterNames.Default);
    }
  }, [changeIntervalToUse, report?.fights, selectedIds]);

  const handleToggleFight = useCallback(
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

  const handleSelectAllFights = useCallback(
    (ids: number[]) => setSelectedIds(ids),
    [setSelectedIds]
  );

  /** Initialize collapse store after page render */
  useEffect(() => {
    fightsToInitialize.forEach((fightName) => {
      collapseFight(fightName, false);
    });
    fightsToInitialize.clear();
  }, [collapseFight]);

  const handleCollapseClick = useCallback(
    (fightName: string, collapsed?: boolean) => {
      collapseFight(fightName, collapsed);
    },
    [collapseFight]
  );

  type IndexedReportFight = ReportFight & { index: number };
  type PhaseMap = Map<string, IndexedReportFight[]>;

  /** Sort fights by Encounter and phases if relevant
   * Only change it when report updates */
  const fightsByName = useMemo(() => {
    // Create our own fightIndex to mimic WCL fight index for each encounter
    const fightIndexMap = new Map<string, number>();

    return (report?.fights || []).reduce((acc, fight) => {
      if (!fight.difficulty) return acc;

      const groupName = fight.name ?? "Unknown";
      const fightIndex = fightIndexMap.get(groupName) ?? 1;

      let groupFights =
        acc.get(groupName) || new Map<string, IndexedReportFight[]>();

      const usePhases = Boolean(getEncounter(groupName)?.wclPhases);

      const phase = fight.lastPhase ?? 0;
      const phaseType = fight.lastPhaseIsIntermission ? "I" : "P";
      const phaseName = usePhases ? `${phaseType}${phase}` : "All Phases";

      const phaseFights = groupFights.get(phaseName) || [];
      phaseFights.push({ ...fight, index: fightIndex });
      fightIndexMap.set(groupName, fightIndex + 1);

      // Sort so we have earlier phases first
      if (!groupFights.has(phaseName) && groupFights.size > 0 && usePhases) {
        const entries = Array.from(groupFights.entries());
        entries.push([phaseName, phaseFights]);
        entries.sort(([a], [b]) => {
          const [phaseTypeA, phaseNumberA] = a.split("");
          const [phaseTypeB, phaseNumberB] = b.split("");

          let aValue = 0;
          let bValue = 0;

          if (parseInt(phaseNumberA) > parseInt(phaseNumberB)) {
            aValue += 1;
          } else if (parseInt(phaseNumberA) < parseInt(phaseNumberB)) {
            bValue += 1;
          }

          if (phaseTypeA === "I") {
            aValue += 0.5;
          }
          if (phaseTypeB === "I") {
            bValue += 0.5;
          }

          return aValue - bValue;
        });

        groupFights = new Map(entries);
      } else {
        groupFights.set(phaseName, phaseFights);
      }

      acc.set(groupName, groupFights);

      return acc;
    }, new Map<string, PhaseMap>());
  }, [report]);

  if (!report?.fights) {
    return <></>;
  }

  const fightBoxesElement: JSX.Element = (
    <div>
      {Array.from(fightsByName).map(([groupName, phases], groupIndex) => {
        const fightIds = Array.from(phases).flatMap(([, fights]) =>
          fights.map((fight) => fight.id)
        );

        const encounter = getEncounter(groupName);
        const fightIsCollapsed = collapsedFights.get(groupName);
        if (fightIsCollapsed === undefined) {
          fightsToInitialize.add(groupName);
        }

        return (
          <div key={groupName} className="flex column fightContainer">
            <div className="flex fightsName">
              <img src={encounter.image} alt="" />
              {groupName}
              <button
                className="fightSelectAll"
                onClick={() => {
                  handleSelectAllFights(fightIds);
                  if (fightIsCollapsed) handleCollapseClick(groupName);
                }}
              >
                Select All
              </button>

              <button
                className="fightSelectAll"
                onClick={() => handleCollapseClick(groupName)}
              >
                {fightIsCollapsed ? "Expand" : "Collapse"}
              </button>
            </div>

            <Collapse isExpanded={!fightIsCollapsed}>
              {Array.from(phases).map(([phaseName, fights], phaseIndex) => {
                const phaseIds = fights.map((fight) => fight.id);
                const formattedPhaseName =
                  encounter.wclPhases?.[phaseName] ?? "Unknown Phase Name";

                return (
                  <React.Fragment key={`${groupIndex}-${phaseIndex}`}>
                    {/** If the encounter uses phases make sure we divide them up */}
                    {phases.size > 1 && (
                      <div className="phaseDivider" key={formattedPhaseName}>
                        {phaseName}:{"     "}
                        {formattedPhaseName}
                        <button
                          className="fightSelectAll"
                          onClick={() => handleSelectAllFights(phaseIds)}
                        >
                          Select Phase
                        </button>
                      </div>
                    )}

                    <div className="flex wrap" key={phaseName}>
                      {Array.from(fights).map((fight) => {
                        const fightPercentageColor =
                          getFightPercentageColor(fight);

                        const content = (
                          <>
                            <div className="flex column">
                              <span
                                className={`fightPercentage ${fightPercentageColor}`}
                              >
                                {fight.kill
                                  ? "KILL"
                                  : `${fight.fightPercentage}%`}
                              </span>
                              <span className="phase">
                                {getFightPhase(fight)}
                              </span>
                            </div>
                            <div className="flex column">
                              <span className={fight.kill ? "kill" : "wipe"}>
                                {`${fight.index} - (${
                                  fight.keystoneTime
                                    ? formatDuration(fight.keystoneTime)
                                    : formatDuration(
                                        fight.endTime - fight.startTime
                                      )
                                })`}
                              </span>
                              <span>
                                {formatUnixTime(
                                  fight.startTime + report.startTime
                                )}
                              </span>
                            </div>
                          </>
                        );

                        return (
                          <ButtonCheckbox
                            key={fight.id}
                            onClick={() => handleToggleFight(fight.id)}
                            selected={selectedIds.has(fight.id)}
                            content={content}
                            id="fightButton"
                            disabled={isFetching}
                          />
                        );
                      })}
                    </div>
                  </React.Fragment>
                );
              })}
            </Collapse>
          </div>
        );
      })}
    </div>
  );

  return fightBoxesElement;
};

export default FightBoxes;
