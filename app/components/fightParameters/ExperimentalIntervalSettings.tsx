import PopupContent from "../generic/PopupContent";
import "../../styles/fightParameterStyling.css";
import useStatusStore from "../../zustand/statusStore";
import OptionBox from "./generic/OptionBox";
import useIntervalParametersStore from "../../zustand/intervalParametersStore";
import {
  EncounterNames,
  EncounterIntervalPhaseNames,
} from "../../util/enemyTables";
import ExperimentalIntervalImport from "./ExperimentalIntervalImport";

const ExperimentalIntervalSettings: React.FC = () => {
  const isFetching = useStatusStore((state) => state.isFetching);
  const {
    setEbonMightWindow,
    addEbonMightWindow,
    removeEbonMightWindow,
    selectedFight,
    changeFight,
    encounterEbonMightWindows,
    autoGenWindowSettings,
    setAutoGenSetting,
  } = useIntervalParametersStore();

  const handleFightChange = (input: string): void => {
    changeFight(input);
  };

  const intervalExport = (): string =>
    JSON.stringify(encounterEbonMightWindows);

  const content = (
    <div className="flex">
      <OptionBox title="Intervals">
        <div>
          <PopupContent
            content={
              <div>
                {" "}
                <textarea
                  readOnly
                  value={intervalExport()}
                  className="mrtNoteTextbox"
                />
              </div>
            }
            name="Export"
          />
          <ExperimentalIntervalImport />
          <OptionBox title="Fight">
            <select
              onChange={(e) => handleFightChange(e.target.value)}
              value={selectedFight}
            >
              {Object.entries(EncounterNames).map((encounter) => (
                <option key={encounter[1]} value={encounter[1]}>
                  {encounter[1]}
                </option>
              ))}
            </select>
          </OptionBox>
          <div className="flex experimental-interval-options">
            AutoGen window settings:
            <OptionBox title="Window Length">
              <input
                type="number"
                value={autoGenWindowSettings["Window Length"]}
                onChange={(e) =>
                  setAutoGenSetting("Window Length", Number(e.target.value))
                }
                min="1"
              />
            </OptionBox>
            <OptionBox title="Window Delay">
              <input
                type="number"
                value={autoGenWindowSettings["Window Delay"]}
                onChange={(e) =>
                  setAutoGenSetting("Window Delay", Number(e.target.value))
                }
                min="0"
              />
            </OptionBox>
            <OptionBox title="Threads">
              <input
                type="checkbox"
                checked={autoGenWindowSettings.Threads}
                onChange={(e) => setAutoGenSetting("Threads", e.target.checked)}
              />
            </OptionBox>
          </div>
          * indicates fabricated windows. These wont save until you make a
          change.
          {/** Interval render below */}
          {Object.entries(encounterEbonMightWindows[selectedFight]).map(
            ([phase, windows], index) => {
              const phaseNumber = Number(phase);
              const phaseName =
                EncounterIntervalPhaseNames?.[selectedFight]?.[phaseNumber] ??
                `Phase ${phaseNumber + 1}`;

              return (
                <div
                  key={index}
                  className="experimental-time-intervals-container"
                >
                  <p className="title">{phaseName}</p>

                  {windows.map((window, i) => (
                    <div
                      key={i}
                      className="experimental-time-intervals-content"
                    >
                      {window.fabricated && "*"}
                      <label>
                        Start:{" "}
                        <input
                          type="number"
                          value={window.start}
                          onChange={(e) =>
                            setEbonMightWindow(phaseNumber, i, {
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
                            setEbonMightWindow(phaseNumber, i, {
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
                            setEbonMightWindow(phaseNumber, i, {
                              ...window,
                              useBreath: e.target.checked,
                            })
                          }
                        />
                      </label>
                      <button
                        onClick={() => removeEbonMightWindow(phaseNumber, i)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addEbonMightWindow(phaseNumber)}>
                    Add Window
                  </button>
                </div>
              );
            }
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
