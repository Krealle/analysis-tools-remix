import "../../styles/fightParameterStyling.css";
import useFightParametersStore from "../../zustand/fightParametersStore";

const TimePeriodFilter: React.FC = () => {
  const {
    timeSkipIntervals,
    removeTimeSkipInterval,
    changeTimeSkipInterval,
    addTimeSkipInterval,
  } = useFightParametersStore();

  const handleInputChange =
    (index: number, entry: "start" | "end") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      changeTimeSkipInterval({
        index: index,
        entry: entry,
        value: e.target.value,
      });
    };

  return (
    <div className="time-intervals-container">
      <p>Time intervals to skip</p>
      {timeSkipIntervals.map((interval, index) => (
        <div className="time-intervals-content" key={index}>
          <button key={index} onClick={() => removeTimeSkipInterval(index)}>
            X
          </button>
          <input
            placeholder="0:45"
            value={interval.start}
            onChange={handleInputChange(index, "start")}
          />{" "}
          -{" "}
          <input
            placeholder="1:05"
            value={interval.end}
            onChange={handleInputChange(index, "end")}
          />
        </div>
      ))}
      <button onClick={() => addTimeSkipInterval({ start: "", end: "" })}>
        Add period
      </button>
    </div>
  );
};

export default TimePeriodFilter;
