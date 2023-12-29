import { useEffect } from "react";
import { formatTime } from "../../util/format";
import EnemyFilter from "./EnemyFilter";
import AbilityFilter from "./AbilityFilter";
import IntervalSettings from "./IntervalSettings";
import DeathFilter from "./DeathFilter";
import useFightParametersStore from "../../zustand/fightParametersStore";
import Weights from "./Weights";

const CustomFightParameters = () => {
  const {
    abilityBlacklist,
    abilityNoBoEScaling,
    abilityNoEMScaling,
    abilityNoScaling,
    abilityNoShiftingScaling,
    timeSkipIntervals,
    setParameterError,
  } = useFightParametersStore();

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

    /** In my eyes this is black magic but all
     * it does is check if blacklist format is correct:
     * eg. "23,25,25" / "24, 255, 23478" */
    const isNumberListValid = (str: string) => {
      const parts = str.split(",");
      return parts.every((part) => /^\s*\d{1,10}\s*$/.test(part));
    };
    const abilityFilterValid =
      isNumberListValid(abilityBlacklist) &&
      isNumberListValid(abilityNoBoEScaling) &&
      isNumberListValid(abilityNoEMScaling) &&
      isNumberListValid(abilityNoScaling) &&
      isNumberListValid(abilityNoShiftingScaling);
    if (!abilityFilterValid) {
      setParameterError("Invalid ability filter");
      return;
    }

    setParameterError(undefined);
  }, [
    abilityBlacklist,
    abilityNoBoEScaling,
    abilityNoEMScaling,
    abilityNoScaling,
    timeSkipIntervals,
    abilityNoShiftingScaling,
    setParameterError,
  ]);

  return (
    <div className="container">
      <b>Options</b>
      <div className="flex gap">
        <Weights />
        <AbilityFilter />
        <EnemyFilter />
        <IntervalSettings />
        <DeathFilter />
      </div>
    </div>
  );
};

export default CustomFightParameters;
