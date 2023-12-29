import useFightParametersStore, {
  AbilityFilters,
} from "../../zustand/fightParametersStore";
import useStatusStore from "../../zustand/statusStore";
import PopupContent from "../generic/PopupContent";
import "../../styles/fightParameterStyling.css";

const AbilityFilterSettings: React.FC = () => {
  const { abilityFilters, setAbilityFilter } = useFightParametersStore();
  const isFetching = useStatusStore((state) => state.isFetching);

  const content = (
    <div className="flex flex-wrap">
      {Object.entries(abilityFilters).map(([ability, value]) => {
        return (
          <div className="flex container" key={ability}>
            <div className="flex title">
              <big>{ability}</big>
            </div>
            <div className="flex abilities">
              <textarea
                onChange={(e) =>
                  setAbilityFilter({
                    ability: ability as keyof AbilityFilters<string>,
                    value: e.target.value,
                  })
                }
                value={value}
                className="mrtNoteTextbox"
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <PopupContent
      content={content}
      name={"Ability Filter"}
      disabled={isFetching}
    />
  );
};

export default AbilityFilterSettings;
