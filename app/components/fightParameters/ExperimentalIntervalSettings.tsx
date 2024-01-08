import PopupContent from "../generic/PopupContent";
import "../../styles/fightParameterStyling.css";
import useStatusStore from "../../zustand/statusStore";
import OptionBox from "./generic/OptionBox";
import useIntervalParametersStore from "../../zustand/intervalParametersStore";

const ExperimentalIntervalSettings: React.FC = () => {
  const isFetching = useStatusStore((state) => state.isFetching);
  const {
    ebonMightWindows,
    setEbonMightWindow,
    addEbonMightWindow,
    removeEbonMightWindow,
    removePhase,
    addPhase,
  } = useIntervalParametersStore();

  const content = (
    <div className="flex">
      <OptionBox title="Intervals">
        <div>
          <button onClick={addPhase}>Add Phase</button>
          {Array.from(ebonMightWindows.entries()).map(
            ([phase, windows], index) => (
              <div
                key={index}
                className="experimental-time-intervals-container"
              >
                <p className="title">
                  Phase {phase + 1}{" "}
                  <button onClick={() => removePhase(phase)}>
                    Remove Phase
                  </button>
                </p>

                {windows.map((window, i) => (
                  <div key={i} className="experimental-time-intervals-content">
                    <label>
                      Start:{" "}
                      <input
                        type="number"
                        value={window.start}
                        onChange={(e) =>
                          setEbonMightWindow(phase, i, {
                            ...window,
                            start: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label>
                      End:{" "}
                      <input
                        type="number"
                        value={window.end}
                        onChange={(e) =>
                          setEbonMightWindow(phase, i, {
                            ...window,
                            end: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label>
                      Use Breath:
                      <input
                        type="checkbox"
                        checked={window.useBreath}
                        onChange={(e) =>
                          setEbonMightWindow(phase, i, {
                            ...window,
                            useBreath: e.target.checked,
                          })
                        }
                      />
                    </label>
                    <button onClick={() => removeEbonMightWindow(phase, i)}>
                      X
                    </button>
                  </div>
                ))}
                <button onClick={() => addEbonMightWindow(phase)}>
                  Add Window
                </button>
              </div>
            )
          )}
        </div>
      </OptionBox>
    </div>
  );

  return (
    <PopupContent
      content={content}
      name="Experimental Interval Settings"
      disabled={isFetching}
    />
  );
};

export default ExperimentalIntervalSettings;
