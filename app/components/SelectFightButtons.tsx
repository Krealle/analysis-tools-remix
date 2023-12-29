import { useCallback } from "react";
import useWCLUrlInputStore from "../zustand/WCLUrlInputStore";
import useFightBoxesStore from "../zustand/fightBoxesStore";

const SelectFightButtons = () => {
  const fightReport = useWCLUrlInputStore((state) => state.fightReport);
  const { setSelectedIds } = useFightBoxesStore();

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

  return (
    <div className="flex gap">
      <button onClick={() => handleSelectFights()}>Select All Fights</button>
      <button onClick={() => handleSelectFights(true)}>Select All Kills</button>
      <button onClick={() => handleSelectFights(false)}>
        Select All Wipes
      </button>
    </div>
  );
};

export default SelectFightButtons;
