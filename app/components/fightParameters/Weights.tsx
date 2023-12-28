import PopupContent from "../generic/PopupContent";
import "../../styles/fightParameterStyling.css";
import useStatusStore from "../../zustand/statusStore";
import useFightParametersStore from "../../zustand/fightParametersStore";

const Weights: React.FC = () => {
  const {
    setEbonMightWeight,
    ebonMightWeight,
    setShiftingSandsWeight,
    shiftingSandsWeight,
    setPrescienceWeight,
    prescienceWeight,
  } = useFightParametersStore();
  const isFetching = useStatusStore((state) => state.isFetching);

  const weights: number[] = Array.from(
    { length: 1001 },
    (_, index) => index / 1000
  );

  const content = (
    <div className="flex">
      <div className="flex container">
        <div className="flex title">
          <big>Ebon Might</big>
        </div>
        <div className="flex abilities">
          <select
            onChange={(e) => setEbonMightWeight(parseInt(e.target.value, 10))}
            value={ebonMightWeight}
          >
            {weights.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex container">
        <div className="flex title">
          <big>Shifting Sands</big>
        </div>
        <div className="flex abilities">
          <select
            onChange={(e) =>
              setShiftingSandsWeight(parseInt(e.target.value, 10))
            }
            value={shiftingSandsWeight}
          >
            {weights.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex container">
        <div className="flex title">
          <big>Prescience</big>
        </div>
        <div className="flex abilities">
          <select
            onChange={(e) => setPrescienceWeight(parseInt(e.target.value, 10))}
            value={prescienceWeight}
          >
            {weights.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <PopupContent content={content} name={"Weights"} disabled={isFetching} />
  );
};

export default Weights;
