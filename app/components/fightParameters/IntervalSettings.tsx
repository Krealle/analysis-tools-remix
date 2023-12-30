import PopupContent from "../generic/PopupContent";
import "../../styles/fightParameterStyling.css";
import useStatusStore from "../../zustand/statusStore";
import useFightParametersStore from "../../zustand/fightParametersStore";
import TimePeriodFilter from "./TimePeriodFilter";
import { ChangeEvent } from "react";

const intervals = Array.from({ length: 60 }, (_, index) => index + 1);
const weights = Array.from({ length: 101 }, (_, index) => index / 100);

const IntervalSettings: React.FC = () => {
  const {
    intervalTimer,
    intervalEbonMightWeight,
    setIntervalTimer,
    setIntervalEbonMightWeight,
  } = useFightParametersStore();
  const isFetching = useStatusStore((state) => state.isFetching);

  const handleIntervalChange = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    setIntervalTimer(parseInt(event.target.value, 10));
  };
  const handleWeightChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setIntervalEbonMightWeight(parseFloat(event.target.value));
  };

  const content = (
    <div className="flex">
      <div className="flex container">
        <div className="flex title">
          <big>Interval Timer</big>
        </div>
        <div className="flex abilities">
          <select
            onChange={(e) => handleIntervalChange(e)}
            value={intervalTimer}
          >
            {intervals.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex container">
        <div className="flex title">
          <big>Ebon Might Weight</big>
        </div>
        <div className="flex abilities">
          <select
            onChange={(e) => handleWeightChange(e)}
            value={intervalEbonMightWeight}
          >
            {weights.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>
      </div>
      <TimePeriodFilter />
    </div>
  );

  return (
    <PopupContent
      content={content}
      name={"Interval Settings"}
      disabled={isFetching}
    />
  );
};

export default IntervalSettings;
