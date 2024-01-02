import { AnyEvent } from "../../wcl/events/types";
import { WCLReport } from "../../wcl/types/graphql/queryTypes";
import { ReportFight } from "../../wcl/types/report/report";
import { SummaryTable } from "../../wcl/types/report/summaryTable";
import { getFilter } from "../../wcl/util/filters";
import {
  EventVariables,
  getEvents,
  getSummaryTable,
} from "../../wcl/util/queryWCL";

export type FightDataSet = {
  fight: ReportFight & { reportCode: string };
  summaryTable: SummaryTable;
  events: AnyEvent[];
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
): AsyncIterable<FightDataSet> {
  const fightsToGenerate = WCLReport.fights.filter((fight) =>
    fightsToFetch.has(fight.id)
  );

  const fetchPromises = fightsToGenerate.map(async (fight) => {
    const variables: EventVariables = {
      reportID: WCLReport.code,
      fightIDs: [fight.id],
      startTime: fight.startTime,
      endTime: fight.endTime,
      limit: 10000,
    };
    const summaryTable = await getSummaryTable(variables);

    variables.filterExpression = getFilter();
    const events = await getEvents(variables);

    return {
      fight: { ...fight, reportCode: WCLReport.code },
      summaryTable: summaryTable,
      events: events,
    };
  });

  for (const fetchPromise of fetchPromises) {
    yield await fetchPromise;
  }
}
