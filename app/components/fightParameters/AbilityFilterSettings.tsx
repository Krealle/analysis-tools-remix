import useFightParametersStore, {
  AbilityFilters,
} from "../../zustand/fightParametersStore";
import useStatusStore from "../../zustand/statusStore";
import PopupContent from "../generic/PopupContent";
import "../../styles/fightParameterStyling.css";
import { splitCamelCase, toCamelCase } from "../../util/format";
import OptionBox from "./generic/OptionBox";

const AbilityFilterSettings: React.FC = () => {
  const { abilityFilters, setAbilityFilter } = useFightParametersStore();
  const isFetching = useStatusStore((state) => state.isFetching);

  const content = (
    <div className="flex flex-wrap">
      {Object.entries(abilityFilters).map(([ability, value]) => {
        return (
          <OptionBox title={splitCamelCase(toCamelCase(ability))} key={ability}>
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
          </OptionBox>
        );
      })}
    </div>
  );

  return (
    <PopupContent
      content={content}
      name="Ability Filter"
      disabled={isFetching}
    />
  );
};

export default AbilityFilterSettings;
