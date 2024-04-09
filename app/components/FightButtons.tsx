import useFightParametersStore from "../zustand/fightParametersStore";
import useIntervalParametersStore from "../zustand/intervalParametersStore";

/* eslint-disable react/prop-types */
type FightButtonProps = {
  isFetching: boolean;
  handleButtonClick: (() => void) | (() => Promise<void>);
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
          onClick={() => {
            const res = handleButtonClick();

            if (res instanceof Promise) {
              res.catch((err) => console.error(err));
            }
          }}
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
