import {
  EventsResponse,
  SummaryTableResponse,
  WCLReport,
} from "../../wcl/types/graphql/queryTypes";
import { AnyEvent } from "../../wcl/types/events/eventTypes";
import { ReportFight } from "../../wcl/types/report/report";
import { SummaryTable } from "../../wcl/types/report/summaryTable";
import { getFilter } from "../../wcl/util/filters";
import {
  EventVariables,
  getEvents,
  getEventsNew,
  getSummaryTable,
} from "../../wcl/util/queryWCL";
import { ReportParseError } from "../../wcl/util/parseWCLUrl";
import { getEventTriggerFilter } from "./generatePhaseEvents";
import { EncounterPhaseTriggers } from "../../util/encounters/encounters";
import { ReportQueryKeys } from "../../wcl/types/graphql/queries";

export type FightDataSet = {
  fight: ReportFight & { reportCode: string };
  summaryTable: SummaryTable;
  events: AnyEvent[];
  phaseEvents: AnyEvent[];
};

/**
 * Fetches fight data from a WCLReport for the specified fights.
 * @param WCLReport - The WCLReport object containing the fights.
 * @param fightsToFetch - An array of fight IDs to fetch.
 * @returns An async iterable of FightDataSet objects.
 */
export async function* fetchFightData(
  WCLReport: WCLReport,
  fightsToFetch: Set<number>
): AsyncIterable<FightDataSet | { error: ReportParseError; fight: number }> {
  const fightsToGenerate = WCLReport.fights.filter((fight) =>
    fightsToFetch.has(fight.id)
  );

  const fetchPromises = fightsToGenerate.map(async (fight) => {
    try {
      const variables: EventVariables = {
        reportID: WCLReport.code,
        fightIDs: [fight.id],
        startTime: fight.startTime,
        endTime: fight.endTime,
        limit: 10000,
      };

      const activeTriggers = EncounterPhaseTriggers.filter(
        (trigger) =>
          (!trigger.isActive || trigger.isActive(fight)) &&
          trigger.bossName === fight.name
      );
      /* const phaseEventVariables = getEventTriggerFilter(activeTriggers); */

      const queryParams = new URLSearchParams({
        variables: JSON.stringify(variables),
        type: ReportQueryKeys.summaryTable,
      });

      /* const summaryTableRes = await fetch(
        "api/fightData?" + queryParams.toString()
      );
      const summaryTable =
        (await summaryTableRes.json()) as SummaryTableResponse;
      console.log(summaryTable); */

      const summaryTable = await getSummaryTable(variables);

      variables.filterExpression = getFilter();
      /* const eventQueryParams = new URLSearchParams({
        variables: JSON.stringify(variables),
        type: ReportQueryKeys.events,
      }); */
      const events = await getEventsNew(variables);
      /* const eventsRes = await fetch(
        "api/fightData?" + eventQueryParams.toString()
      );
      const events = (await eventsRes.json()) as EventsResponse; */
      /* console.log(events); */

      /** Split from events to reduce complexity */
      variables.filterExpression = getEventTriggerFilter(activeTriggers);
      /* const phaseEventQueryParams = new URLSearchParams({
        variables: JSON.stringify(variables),
        type: ReportQueryKeys.events,
      }); */
      const phaseEvents = await getEventsNew(variables);

      //const events = await getEvents(variables);
      /* const phaseEventsRes = await fetch(
        "api/fightData?" + phaseEventQueryParams.toString()
      );
      const phaseEvents = (await phaseEventsRes.json()) as EventsResponse; */
      /* console.log(phaseEvents); */

      return {
        fight: { ...fight, reportCode: WCLReport.code },
        summaryTable: summaryTable /* .table.data */,
        events: events,
        phaseEvents: phaseEvents,
      };
    } catch (error) {
      return { error: error as ReportParseError, fight: fight.id };
    }
  });

  for (const fetchPromise of fetchPromises) {
    yield await fetchPromise;
  }
}
