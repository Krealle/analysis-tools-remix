import { useEffect, useState } from "react";
import tableRenderer from "../analysis/renders/tableRenderer";
import { formatTime } from "../util/format";
import { getAverageIntervals } from "../analysis/interval/intervals";
import intervalRenderer from "../analysis/renders/intervalRenderer";
import { Combatant } from "../analysis/combatant/combatants";
import ErrorBear from "./generic/ErrorBear";
import { ReportParseError } from "../wcl/util/parseWCLUrl";
import { FightDataSet, fetchFightData } from "../analysis/util/fetchFightData";
import { Fight, handleFightData } from "../analysis/util/handleFightData";
import FetchingStatus, { FetchStatus } from "./generic/FetchingStatus";
import useWCLUrlInputStore from "../zustand/WCLUrlInputStore";
import useFightBoxesStore from "../zustand/fightBoxesStore";
import useStatusStore from "../zustand/statusStore";
import { FormattedTimeSkipIntervals } from "../util/types";
import FightButtons from "./FightButtons";
import CustomFightParameters from "./fightParameters/CustomFightParameters";
import useFightParametersStore, {
  AbilityFilters,
} from "../zustand/fightParametersStore";

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
    abilityFilters,
    enemyBlacklist,
    intervalEbonMightWeight,
    intervalTimer,
    deathCountFilter,
    weights,
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
  }, [abilityFilters]);

  const attemptNormalize = async () => {
    if (selectedFights.size === 0) {
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

    const fightsToFetch = new Set(
      Array.from(selectedFights).filter(
        (id) => !fetchedFightDataSets.some((f) => f.fight.id === id)
      )
    );
    setAmountOfFightsToFetch(fightsToFetch.size);

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

      const formattedAbilityFilters = Object.fromEntries(
        Object.entries(abilityFilters).map(([key, value]) => {
          return [key, value.split(",").map(Number)];
        })
      ) as AbilityFilters<number[]>;

      const newFights = handleFightData(
        WCLReport,
        fightsToHandle,
        formattedAbilityFilters,
        weights
      );

      fights.push(...newFights);

      const fightsToRender = fights.filter(
        (fight) =>
          selectedFights.has(fight.fightId) &&
          fight.reportCode === WCLReport.code
      );

      const wclTableContent = tableRenderer(
        fightsToRender,
        enemyTracker,
        formattedAbilityFilters.blacklist,
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
        formattedAbilityFilters,
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
      {!isFetching && (
        <>
          {wclTableContent} {intervalsContent}
        </>
      )}
    </div>
  );
};

export default EventNormalizer;
