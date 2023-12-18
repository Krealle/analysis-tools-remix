import {
  AmirdrassilEnemies,
  EncounterImages,
  EncounterNames,
} from "../../util/enemyTables";
import { ButtonCheckbox } from "../generic/ButtonCheckbox";
import PopupContent from "../generic/PopupContent";
import "../../styles/fightParameterStyling.css";
import useStatusStore from "../../zustand/statusStore";
import useFightParametersStore from "../../zustand/fightParametersStore";

const EnemyFilter: React.FC = () => {
  const { enemyBlacklist, modifyEnemyBlacklist } = useFightParametersStore();
  const isFetching = useStatusStore((state) => state.isFetching);

  const content = Object.entries(AmirdrassilEnemies).map(
    ([encounter, enemies]) => {
      return (
        <div key={encounter} className="flex container">
          <div className="flex title">
            <img src={EncounterImages[encounter]} alt="" />
            <p>{EncounterNames[encounter]}</p>
          </div>
          <div className="flex enemies">
            {enemies.map((enemy) => {
              return (
                <ButtonCheckbox
                  key={enemy.id}
                  id="enemy"
                  title={enemy.name}
                  onClick={() =>
                    modifyEnemyBlacklist({
                      value: enemy.id,
                      add: !enemyBlacklist.includes(enemy.id),
                    })
                  }
                  selected={enemyBlacklist.includes(enemy.id)}
                />
              );
            })}
          </div>
        </div>
      );
    }
  );
  return (
    <PopupContent
      content={content}
      name={"Enemy Filter"}
      disabled={isFetching}
    />
  );
};

export default EnemyFilter;
