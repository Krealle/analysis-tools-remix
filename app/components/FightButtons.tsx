import useFightParametersStore from "../zustand/fightParametersStore";
import useIntervalParametersStore from "../zustand/intervalParametersStore";

/* eslint-disable react/prop-types */
type FightButtonProps = {
  isFetching: boolean;
  handleButtonClick: (getCSV: boolean) => void;
};

const FightButtons: React.FC<FightButtonProps> = ({
  isFetching,
  handleButtonClick,
}) => {
  const parameterError = useFightParametersStore(
    (state) => state.parameterError
  );
  const { intervalToUse } = useIntervalParametersStore();

  return (
    <>
      <div className="flex column">
        <button
          onClick={() => handleButtonClick(false)}
          disabled={isFetching || Boolean(parameterError)}
        >
          <b>Get DPS</b>
        </button>
        <p>
          Currently using the{" "}
          <span style={{ fontWeight: "bold" }}>{intervalToUse}</span> intervals.
        </p>
      </div>
    </>
  );
};

export default FightButtons;
