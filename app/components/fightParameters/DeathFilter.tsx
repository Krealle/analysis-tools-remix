import "../../styles/fightParameterStyling.css";
import useFightParametersStore from "../../zustand/fightParametersStore";
import useStatusStore from "../../zustand/statusStore";

const DeathFilter: React.FC = () => {
  const { deathCountFilter, setDeathCountFilter } = useFightParametersStore();
  const isFetching = useStatusStore((state) => state.isFetching);

  const content = (
    <div className="flex">
      <div className="flex container" id="death-filter">
        <div className="flex">
          Ignore Events After Player Deaths:
          <input
            onChange={(e) => setDeathCountFilter(e.target.value)}
            value={deathCountFilter}
            disabled={isFetching}
            className="deathFilterInput"
          />
        </div>
      </div>
    </div>
  );

  return content;
};

export default DeathFilter;
