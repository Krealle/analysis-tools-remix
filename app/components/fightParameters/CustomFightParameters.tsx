import { useEffect } from "react";
import EnemyFilter from "./EnemyFilter";
import AbilityFilterSettings from "./AbilityFilterSettings";
import DeathFilter from "./DeathFilter";
import useFightParametersStore from "../../zustand/fightParametersStore";
import WeightsSettings from "./WeightsSettings";
import IntervalSettings from "./IntervalSettings";

/** In my eyes this is black magic but all
 * it does is check if blacklist format is correct:
 * eg. "23,25,25" / "24, 255, 23478" */
const isNumberListValid = (str: string): boolean => {
  const parts = str.split(",");
  return parts.every((part) => /^\s*\d{1,10}\s*$/.test(part));
};

const CustomFightParameters: React.FC = () => {
  const { abilityFilters, setParameterError } = useFightParametersStore();

  useEffect(() => {
    const abilityFilterValid =
      Object.values(abilityFilters).every(isNumberListValid);
    if (!abilityFilterValid) {
      setParameterError("Invalid ability filter");
      return;
    }

    setParameterError(undefined);
  }, [abilityFilters, setParameterError]);

  return (
    <div className="container">
      <b>Options</b>
      <div className="flex gap">
        <WeightsSettings />
        <AbilityFilterSettings />
        <EnemyFilter />
        <IntervalSettings />
        <DeathFilter />
      </div>
    </div>
  );
};

export default CustomFightParameters;
