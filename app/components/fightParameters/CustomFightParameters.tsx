import { useEffect } from "react";
import { formatTime } from "../../util/format";
import EnemyFilter from "./EnemyFilter";
import AbilityFilter from "./AbilityFilter";
import TimePeriodFilter from "./TimePeriodFilter";
import IntervalSettings from "./IntervalSettings";
import DeathFilter from "./DeathFilter";
import useFightParametersStore from "../../zustand/fightParametersStore";

const CustomFightParameters = () => {
  const {
    abilityBlacklist,
    abilityNoBoEScaling,
    abilityNoEMScaling,
    abilityNoScaling,
    abilityNoShiftingScaling,
    timeSkipIntervals,
    setParameterError,
    setParameterErrorMsg,
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
        setParameterErrorMsg("Invalid time interval");
        setParameterError(true);
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
      setParameterErrorMsg("Invalid ability filter");
      setParameterError(true);
      return;
    }

    setParameterErrorMsg("");
    setParameterError(false);
  }, [
    abilityBlacklist,
    abilityNoBoEScaling,
    abilityNoEMScaling,
    abilityNoScaling,
    timeSkipIntervals,
    abilityNoShiftingScaling,
    setParameterErrorMsg,
    setParameterError,
  ]);

  return (
    <div className={`flex gap`}>
      <TimePeriodFilter />
      <AbilityFilter />
      <EnemyFilter />
      <IntervalSettings />
      <DeathFilter />
    </div>
  );
};

export default CustomFightParameters;
