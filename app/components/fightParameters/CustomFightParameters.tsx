import { useEffect } from "react";
import { formatTime } from "../../util/format";
import EnemyFilter from "./EnemyFilter";
import AbilityFilterSettings from "./AbilityFilterSettings";
import IntervalSettings from "./IntervalSettings";
import DeathFilter from "./DeathFilter";
import useFightParametersStore from "../../zustand/fightParametersStore";
import WeightsSettings from "./WeightsSettings";

/** In my eyes this is black magic but all
 * it does is check if blacklist format is correct:
 * eg. "23,25,25" / "24, 255, 23478" */
const isNumberListValid = (str: string): boolean => {
  const parts = str.split(",");
  return parts.every((part) => /^\s*\d{1,10}\s*$/.test(part));
};

const CustomFightParameters: React.FC = () => {
  const { abilityFilters, timeSkipIntervals, setParameterError } =
    useFightParametersStore();

  useEffect(() => {
    for (const interval of timeSkipIntervals) {
      const formattedStartTime = formatTime(interval.start);
      const formattedEndTime = formatTime(interval.end);
      if (
        !formattedStartTime ||
        !formattedEndTime ||
        formattedStartTime > formattedEndTime
      ) {
        setParameterError("Invalid time interval");
        return;
      }
    }

    const abilityFilterValid =
      Object.values(abilityFilters).every(isNumberListValid);
    if (!abilityFilterValid) {
      setParameterError("Invalid ability filter");
      return;
    }

    setParameterError(undefined);
  }, [abilityFilters, timeSkipIntervals, setParameterError]);

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
