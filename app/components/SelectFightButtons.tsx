import { useCallback } from "react";
import useWCLUrlInputStore from "../zustand/WCLUrlInputStore";
import useFightBoxesStore from "../zustand/fightBoxesStore";

const SelectFightButtons: React.FC = () => {
  const fightReport = useWCLUrlInputStore((state) => state.fightReport);
  const { setSelectedIds, collapseFight, collapsedFights } =
    useFightBoxesStore();

  const handleSelectFights = useCallback(
    (selectKills?: boolean) => {
      if (fightReport && fightReport.fights) {
        const allFightIds = fightReport.fights
          .filter((fight) => {
            if (fight.difficulty === null) {
              return false;
            }
            if (selectKills === undefined) {
              return true;
            }
            return selectKills ? fight.kill : !fight.kill;
          })
          .map((fight) => fight.id);
        setSelectedIds(allFightIds);
      }
    },
    [fightReport, setSelectedIds]
  );

  const handleCollapseFights = useCallback(
    (collapse: boolean) => {
      collapsedFights.forEach((_isCollapsed, fightName) => {
        collapseFight(fightName, collapse);
      });
    },
    [collapsedFights, collapseFight]
  );

  return (
    <div className="flex gap">
      <button onClick={() => handleSelectFights()}>Select All Fights</button>
      <button onClick={() => handleSelectFights(true)}>Select All Kills</button>
      <button onClick={() => handleSelectFights(false)}>
        Select All Wipes
      </button>
      <button onClick={() => handleCollapseFights(true)}>
        Collapse All Fights
      </button>
      <button onClick={() => handleCollapseFights(false)}>
        Expand All Fights
      </button>
    </div>
  );
};

export default SelectFightButtons;
