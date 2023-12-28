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
    const regex = /^(\s*\d+\s*,\s*)*\s*\d*\s*$/;
    const abilityFilterValid =
      regex.test(abilityBlacklist) &&
      regex.test(abilityNoBoEScaling) &&
      regex.test(abilityNoEMScaling) &&
      regex.test(abilityNoScaling) &&
      regex.test(abilityNoShiftingScaling);
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
    <div className="flex gap">
      <Weights />
      <AbilityFilter />
      <EnemyFilter />
      <IntervalSettings />
      <DeathFilter />
    </div>
  );
};

export default CustomFightParameters;
