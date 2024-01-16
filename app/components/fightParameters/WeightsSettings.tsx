import PopupContent from "../generic/PopupContent";
import "../../styles/fightParameterStyling.css";
import useStatusStore from "../../zustand/statusStore";
import useFightParametersStore, {
  Weights,
} from "../../zustand/fightParametersStore";
import OptionBox from "./generic/OptionBox";
import { splitCamelCase } from "../../util/format";

const weightsRange: number[] = Array.from(
  { length: 1001 },
  (_, index) => index / 1000
);

const WeightsSettings: React.FC = () => {
  const { weights, setWeights } = useFightParametersStore();
  const isFetching = useStatusStore((state) => state.isFetching);

  const content = (
    <div className="flex">
      {Object.entries(weights).map(([key, value]) => {
        return (
          <OptionBox title={splitCamelCase(key)} key={key}>
            <select
              onChange={(e) =>
                setWeights({
                  ability: key as keyof Weights,
                  value: e.target.value,
                })
              }
              value={value}
            >
              {weightsRange.map((number) => (
                <option key={`${key}-${number}`} value={number}>
                  {number}
                </option>
              ))}
            </select>
          </OptionBox>
        );
      })}
    </div>
  );

  return (
    <PopupContent content={content} name="Weights" disabled={isFetching} />
  );
};

export default WeightsSettings;
