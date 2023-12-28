import "../../styles/fightParameterStyling.css";
import useFightParametersStore from "../../zustand/fightParametersStore";

const TimePeriodFilter: React.FC = () => {
  const {
    timeSkipIntervals,
    removeTimeSkipInterval,
    changeTimeSkipInterval,
    addTimeSkipInterval,
  } = useFightParametersStore();

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
            onChange={(e) =>
              changeTimeSkipInterval({
                index: index,
                entry: "start",
                value: e.target.value,
              })
            }
          />{" "}
          -{" "}
          <input
            placeholder="1:05"
            value={interval.end}
            onChange={(e) =>
              changeTimeSkipInterval({
                index: index,
                entry: "end",
                value: e.target.value,
              })
            }
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
