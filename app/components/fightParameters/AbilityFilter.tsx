import useFightParametersStore from "../../zustand/fightParametersStore";
import useStatusStore from "../../zustand/statusStore";
import PopupContent from "../generic/PopupContent";
import "../../styles/fightParameterStyling.css";

const AbilityFilter: React.FC = () => {
  const {
    abilityNoEMScaling,
    abilityNoScaling,
    abilityBlacklist,
    abilityNoShiftingScaling,
    setAbilityNoEMScaling,
    setAbilityNoShiftingScaling,
    setAbilityNoScaling,
    setAbilityBlacklist,
  } = useFightParametersStore();
  const isFetching = useStatusStore((state) => state.isFetching);

  const content = (
    <div className="flex flex-wrap">
      <div className="flex container">
        <div className="flex title">
          <big>No EM Scaling</big>
        </div>
        <div className="flex abilities">
          <textarea
            onChange={(e) => setAbilityNoEMScaling(e.target.value)}
            value={abilityNoEMScaling}
            className="mrtNoteTextbox"
          />
        </div>
      </div>
      {/* <div className="flex container">
        <div className="flex title">
          <big>No BoE Scaling (-10%)</big>
        </div>
        <div className="flex abilities">
          <textarea
            onChange={(e) => (setAbilityNoBoEScaling(e.target.value))}
            value={abilityNoBoEScaling}
            className="mrtNoteTextbox"
          />
        </div>
      </div> */}
      <div className="flex container">
        <div className="flex title">
          <big>No Shifting Sands Scaling</big>
        </div>
        <div className="flex abilities">
          <textarea
            onChange={(e) => setAbilityNoShiftingScaling(e.target.value)}
            value={abilityNoShiftingScaling}
            className="mrtNoteTextbox"
          />
        </div>
      </div>
      <div className="flex container">
        <div className="flex title">
          <big>No Scaling</big>
        </div>
        <div className="flex abilities">
          <textarea
            onChange={(e) => setAbilityNoScaling(e.target.value)}
            value={abilityNoScaling}
            className="mrtNoteTextbox"
          />
        </div>
      </div>
      <div className="flex container">
        <div className="flex title">
          <big>Blacklist</big>
        </div>
        <div className="flex abilities">
          <textarea
            onChange={(e) => setAbilityBlacklist(e.target.value)}
            value={abilityBlacklist}
            className="mrtNoteTextbox"
          />
        </div>
      </div>
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

export default AbilityFilter;
