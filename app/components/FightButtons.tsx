import useFightParametersStore from "../zustand/fightParametersStore";

/* eslint-disable react/prop-types */
type FightButtonProps = {
  isFetching: boolean;
  handleButtonClick: (getCSV: boolean) => Promise<void>;
};

const FightButtons: React.FC<FightButtonProps> = ({
  isFetching,
  handleButtonClick,
}) => {
  const parameterError = useFightParametersStore(
    (state) => state.parameterError
  );

  return (
    <div className="flex gap">
      <button
        onClick={() => handleButtonClick(false)}
        disabled={isFetching || Boolean(parameterError)}
      >
        <b>Get DPS</b>
      </button>
    </div>
  );
};

export default FightButtons;
