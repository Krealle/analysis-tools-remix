import { useEffect, useState } from "react";
import tableRenderer from "../analysis/renders/tableRenderer";
import { formatTime } from "../util/format";
import { getAverageIntervals } from "../analysis/interval/intervals";
import intervalRenderer from "../analysis/renders/intervalRenderer";
import { Combatant, Combatants } from "../analysis/combatant/combatants";
import ErrorBear from "./generic/ErrorBear";
import { ReportParseError, reportParseErrorMap } from "../wcl/util/parseWCLUrl";
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

const EventNormalizer: React.FC = () => {
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
  const [parseError, setParseError] = useState<JSX.Element | undefined>();
  const [defaultParseError, setDefaultParseError] = useState<ReportParseError>(
    ReportParseError.BAD_RESPONSE
  );

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
  const { isFetching, setIsFetching } = useStatusStore();

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

  const attemptNormalize = async (): Promise<void> => {
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
    setParseError(undefined);
    setDefaultParseError(ReportParseError.BAD_RESPONSE);

    const fightsToFetch = new Set(
      Array.from(selectedFights).filter(
        (id) =>
          !fetchedFightDataSets.some(
            (f) => f.fight.id === id && f.fight.reportCode === WCLReport.code
          )
      )
    );
    setAmountOfFightsToFetch(fightsToFetch.size);

    const fightDataGenerator = fetchFightData(WCLReport, fightsToFetch);
    const errors: Map<ReportParseError, number[]> = new Map();

      let fightNumber = 0;

      for await (const fightData of fightDataGenerator) {
        fightNumber += 1;
        await new Promise((resolve) => {
          setProgress(fightNumber);
          requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
          });
        });
      if ("error" in fightData) {
        console.log(fightData.error);
        const currErrors = errors.get(fightData.error) || [];
        errors.set(fightData.error, [...currErrors, fightData.fight]);
      } else {
        fetchedFightDataSets.push(fightData);
      }
      }

      await new Promise((resolve) => {
        setNormalizeStatus(FetchStatus.ANALYZING);
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });

      const fightsToHandle = fetchedFightDataSets.filter(
        (id) =>
          !fights.map((f) => f.fightId).includes(id.fight.id) &&
          id.fight.reportCode === WCLReport.code
      );

      const formattedAbilityFilters = Object.fromEntries(
        Object.entries(abilityFilters).map(([key, value]) => {
          return [key, value.split(",").map(Number)];
        })
      ) as AbilityFilters<number[]>;

      console.time("handleFightData");
      const newFights = handleFightData(
        WCLReport,
        fightsToHandle,
        formattedAbilityFilters,
        weights
      );
      console.timeEnd("handleFightData");

      fights.push(...newFights);

      const fightsToRender = fights.filter(
        (fight) =>
        selectedFights.has(fight.fightId) && fight.reportCode === WCLReport.code
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

      // If all fights are the same we can use phases for Intervals
      const isSameBoss = fightsToRender.every(
        (fight, i, arr) => i === 0 || fight.bossName === arr[i - 1].bossName
      );
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
        Number(deathCountFilter),
        isSameBoss
      );

      const combinedCombatants: Combatants = new Map<number, Combatant>();

      fightsToRender.forEach((fight) => {
        const combatants = fight.combatants;

        combatants.forEach((combatant) => {
          if (!combinedCombatants.has(combatant.id)) {
            combinedCombatants.set(combatant.id, combatant);
          }
        });
      });

      const intervalContent = intervalRenderer(
        intervals,
        combinedCombatants,
        fightsToRender.length
      );

    if (errors.size > 0) {
      const errs: JSX.Element[] = [];
      errors.forEach((fights, error) => {
        if (error === ReportParseError.MISSING_AUTHORIZATION) {
          setDefaultParseError(ReportParseError.MISSING_AUTHORIZATION);
        }
        errs.push(
          <p key={error}>
            {reportParseErrorMap[error]} on fights: {fights.join(", ")}
          </p>
        );
      });

      const errContent = errs.reduce((prev, curr) => {
        return (
          <div>
            {prev}
            {curr}
          </div>
        );
      }, <p key="parseError">The following fights could not be fetched due to these errors:</p>);

      console.log(errContent);
      setParseError(errContent);
    } else {
      setParseError(undefined);
    }

      setWclTableContent(wclTableContent);
      setIntervalsContent(intervalContent);
      setNormalizeStatus(undefined);
      setIsFetching(false);
      setProgress(0);
  };

  return (
    <div className="flex gap column pad">
      {parseError && (
        <ErrorBear
          error={defaultParseError}
          customMsg=""
          customHTMLMsg={parseError}
        />
      )}
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
