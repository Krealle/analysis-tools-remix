import { useEffect, useState } from "react";
import tableRenderer from "./renders/tableRenderer";
import { formatTime } from "../../util/format";
import { getAverageIntervals } from "./interval/intervals";
import intervalRenderer from "./renders/intervalRenderer";
import { Combatant } from "./combatant/combatants";
import ErrorBear from "../generic/ErrorBear";
import { ReportParseError } from "../../wcl/util/parseWCLUrl";
import { FightDataSet, fetchFightData } from "./util/fetchFightData";
import { Fight, handleFightData } from "./util/handleFightData";
import FetchingStatus, { FetchStatus } from "../generic/FetchingStatus";
import useWCLUrlInputStore from "../../zustand/WCLUrlInputStore";
import useFightBoxesStore from "../../zustand/fightBoxesStore";
import useStatusStore from "../../zustand/statusStore";
import { FormattedTimeSkipIntervals } from "../../util/types";
import FightButtons from "../FightButtons";
import CustomFightParameters from "../fightParameters/CustomFightParameters";
import useFightParametersStore from "../../zustand/fightParametersStore";

export type AbilityFilters = {
  noScaling: number[];
  noEMScaling: number[];
  noShiftingScaling: number[];
  blacklist: number[];
};

export type Weights = {
  ebonMightWeight: number;
  shiftingSandsWeight: number;
  prescienceWeight: number;
};

const fights: Fight[] = [];
const fetchedFightDataSets: FightDataSet[] = [];
const enemyTracker = new Map<number, number>();

const EventNormalizer = () => {
  const [wclTableContent, setWclTableContent] = useState<JSX.Element | null>(
    null
  );
  const [intervalsContent, setIntervalsContent] = useState<JSX.Element | null>(
    null
  );
  const [normalizeStatus, setNormalizeStatus] = useState<
    FetchStatus | undefined
  >();
  const [progress, setProgress] = useState(0);
  const [amountOfFightsToFetch, setAmountOfFightsToFetch] = useState(0);

  const WCLReport = useWCLUrlInputStore((state) => state.fightReport);
  const selectedFights = useFightBoxesStore((state) => state.selectedIds);
  const {
    parameterError,
    timeSkipIntervals,
    abilityNoEMScaling,
    abilityBlacklist,
    abilityNoScaling,
    enemyBlacklist,
    abilityNoShiftingScaling,
    intervalEbonMightWeight,
    intervalTimer,
    deathCountFilter,
    ebonMightWeight,
    shiftingSandsWeight,
    prescienceWeight,
  } = useFightParametersStore();
  const { isFetching, setIsFetching, setHasAuth } = useStatusStore();

  useEffect(() => {
    enemyTracker.clear();

    if (WCLReport && WCLReport.masterData && WCLReport.masterData.actors) {
      WCLReport.masterData.actors
        .filter((actor) => actor.type === "NPC")
        .forEach((actor) => {
          enemyTracker.set(actor.id, actor.gameID ?? -1);
        });
    }
  }, [WCLReport]);

  useEffect(() => {
    // TODO: This should be revisited, but in general it should be fine
    fights.splice(0, fights.length);
  }, [abilityNoEMScaling, abilityNoScaling, abilityNoShiftingScaling]);

  const attemptNormalize = async () => {
    if (selectedFights.length === 0) {
      alert("No fight selected!");
      return;
    }
    if (parameterError) {
      alert(parameterError);
      return;
    }
    if (!WCLReport?.fights) {
      alert("No fight report found");
      return;
    }

    setIsFetching(true);
    setNormalizeStatus(FetchStatus.FETCHING);

    const abilityFilters: AbilityFilters = {
      noScaling: abilityNoScaling.split(",").map(Number),
      noEMScaling: abilityNoEMScaling.split(",").map(Number),
      noShiftingScaling: abilityNoShiftingScaling.split(",").map(Number),
      blacklist: abilityBlacklist.split(",").map(Number),
    };

    const weights: Weights = {
      ebonMightWeight,
      shiftingSandsWeight,
      prescienceWeight,
    };

    const fightsToFetch = selectedFights.filter(
      (id) => !fetchedFightDataSets.map((f) => f.fight.id).includes(id)
    );
    setAmountOfFightsToFetch(fightsToFetch.length);

    const fightDataGenerator = fetchFightData(WCLReport, fightsToFetch);

    try {
      let fightNumber = 0;
      for await (const fightData of fightDataGenerator) {
        fightNumber++;
        /** Artificial pause to allow re-render */
        await new Promise((resolve) => {
          setProgress(fightNumber);
          setTimeout(resolve, 100);
        });
        fetchedFightDataSets.push(fightData);
      }

      /** Artificial pause to allow re-render */
      await new Promise((resolve) => {
        setNormalizeStatus(FetchStatus.ANALYZING);
        setTimeout(resolve, 400);
      });
    } catch (error) {
      console.error(error);
      setHasAuth(false);
    } finally {
      const fightsToHandle = fetchedFightDataSets.filter(
        (id) => !fights.map((f) => f.fightId).includes(id.fight.id)
      );

      const newFights = handleFightData(
        WCLReport,
        fightsToHandle,
        abilityFilters,
        weights
      );

      fights.push(...newFights);

      const fightsToRender = fights.filter(
        (fight) =>
          selectedFights.includes(fight.fightId) &&
          fight.reportCode === WCLReport.code
      );

      const wclTableContent = tableRenderer(
        fightsToRender,
        enemyTracker,
        abilityBlacklist.split(",").map(Number),
        enemyBlacklist,
        Number(deathCountFilter)
      );

      const formattedTimeSkipIntervals: FormattedTimeSkipIntervals[] = [];
      for (const interval of timeSkipIntervals) {
        const formattedStartTime = formatTime(interval.start);
        const formattedEndTime = formatTime(interval.end);
        if (formattedStartTime && formattedEndTime) {
          formattedTimeSkipIntervals.push({
            start: formattedStartTime,
            end: formattedEndTime,
          });
        }
      }

      const intervals = getAverageIntervals(
        fightsToRender,
        selectedFights,
        WCLReport.code,
        formattedTimeSkipIntervals,
        enemyTracker,
        abilityFilters,
        intervalEbonMightWeight,
        intervalTimer,
        enemyBlacklist,
        Number(deathCountFilter)
      );

      const combinedCombatants: Combatant[] = [];

      fightsToRender.forEach((fight) => {
        const combatants = fight.combatants;

        combatants.forEach((combatant) => {
          const isUnique = !combinedCombatants.some(
            (unique) => unique.id === combatant.id
          );

          if (isUnique) {
            combinedCombatants.push(combatant);
          }
        });
      });

      const intervalContent = intervalRenderer(intervals, combinedCombatants);

      setWclTableContent(wclTableContent);
      setIntervalsContent(intervalContent);
      setNormalizeStatus(undefined);
      setIsFetching(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex gap column pad">
      {parameterError && (
        <ErrorBear
          error={ReportParseError.INVALID_FILTER}
          customMsg={parameterError}
        />
      )}
      <FightButtons
        isFetching={isFetching}
        handleButtonClick={attemptNormalize}
      />
      <CustomFightParameters />
      {isFetching && (
        <FetchingStatus
          status={normalizeStatus}
          customMsg={
            normalizeStatus === FetchStatus.FETCHING
              ? `Fetching fights - ${progress}/${amountOfFightsToFetch}`
              : ""
          }
        />
      )}
      {!isFetching && wclTableContent}
      {!isFetching && intervalsContent}
    </div>
  );
};

export default EventNormalizer;
