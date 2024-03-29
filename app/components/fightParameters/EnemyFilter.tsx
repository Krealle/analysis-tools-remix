import {
  getEncounter,
  getEncountersInReport,
} from "../../util/encounters/enemyTables";
import ButtonCheckbox from "../generic/ButtonCheckbox";
import PopupContent from "../generic/PopupContent";
import "../../styles/fightParameterStyling.css";
import useStatusStore from "../../zustand/statusStore";
import useFightParametersStore from "../../zustand/fightParametersStore";
import useWCLUrlInputStore from "../../zustand/WCLUrlInputStore";
import { useMemo } from "react";

const EnemyFilter: React.FC = () => {
  const { enemyBlacklist, modifyEnemyBlacklist } = useFightParametersStore();
  const fightReport = useWCLUrlInputStore((state) => state.fightReport);
  const isFetching = useStatusStore((state) => state.isFetching);

  const encountersInReport = useMemo(() => {
    return getEncountersInReport(fightReport?.fights);
  }, [fightReport?.fights]);

  const content = useMemo(() => {
    return encountersInReport.length ? (
      encountersInReport.map((fightName) => {
        const encounter = getEncounter(fightName);
        return (
          <div key={fightName} className="flex container">
            <div className="flex title">
              <img src={encounter.image} alt="" />
              <p>{fightName}</p>
            </div>
            <div className="flex enemies">
              {encounter.enemies.map((enemy) => {
                const isSelected = enemyBlacklist.has(enemy.id);
                return (
                  <ButtonCheckbox
                    key={enemy.id}
                    id="enemy"
                    title={enemy.name}
                    onClick={() =>
                      modifyEnemyBlacklist({
                        value: enemy.id,
                        add: !isSelected,
                      })
                    }
                    selected={isSelected}
                  />
                );
              })}
            </div>
          </div>
        );
      })
    ) : (
      <div className="flex title">
        <p>No known enemies in report.</p>
      </div>
    );
  }, [encountersInReport, enemyBlacklist, modifyEnemyBlacklist]);

  return (
    <PopupContent content={content} name="Enemy Filter" disabled={isFetching} />
  );
};

export default EnemyFilter;
