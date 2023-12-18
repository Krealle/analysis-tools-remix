import { RootReport } from "../gql/types";
/* import {
  getEventsQuery,
  getFightsQuery,
  getPlayerDetailsQuery,
  getSummaryTableQuery,
} from "../gql/queries"; */
import { AnyEvent, EventType } from "../events/types";
import { QueryTypes } from "../gql/queries";

export type Variables = {
  reportID: string;
  fightIDs?: number[];
  startTime?: number;
  endTime?: number;
  limit?: number;
  filterExpression?: string;
};

export type EventVariables = Variables & {
  startTime: number;
  endTime: number;
};

export async function fetchReportData(
  requestType: keyof QueryTypes,
  variables: Variables
) {
  try {
    const queryParams = new URLSearchParams({
      requestType: requestType,
      variables: JSON.stringify(variables),
    });
    const response = await fetch(`api/graphqlClient?${queryParams}`);
    console.time(".json");
    const data = await response.json();
    console.timeEnd(".json");
    const rootReport = data.data as RootReport;

    const report = rootReport.reportData.report;

    return report;
  } catch (error) {
    console.error("GraphQL request error:", error);
    throw new Error("GraphQL request error");
  }
}

export async function getSummaryTable(variables: Variables) {
  const response = await fetchReportData("getSummaryTableQuery", variables);
  if (!response.table) {
    throw new Error("No summary table found");
  }

  return response.table.data;
}

export async function getFights(variables: Variables) {
  const response = await fetchReportData("getFightsQuery", variables);
  if (!response) {
    return;
  }
  return response;
}

export async function getPlayerDetails(variables: Variables) {
  const response = await fetchReportData("getPlayerDetailsQuery", variables);
  if (!response.playerDetails) {
    return;
  }

  return response.playerDetails.data.playerDetails;
}

export async function getEvents<T extends AnyEvent>(
  variables: EventVariables,
  eventType?: EventType,
  previousEvents?: T[],
  recurse?: boolean
) {
  /** Xeph should fix so I don't need to do this.
   * Rare edge case where you hit your limit and only get parsed some of the events on the endTime timestamp.
   * If nextPageTimestamp then is equal to endTime, WCL will throw a hissy fit. */
  if (variables.startTime === variables.endTime) {
    variables.endTime += 1;
  }

  /** Add event type filter if eventType is provided. */
  if (!recurse) {
    if (eventType) {
      const eventFilter = `type = "${eventType}"`;
      variables.filterExpression += variables.filterExpression
        ? ` AND ` + eventFilter
        : eventFilter;
      console.log(`added type: "` + eventType + `" to filter`);
    }
    //console.log("filter for fetching Events:", variables.filterExpression);
  }

  const response = await fetchReportData("getEventsQuery", variables);

  console.log("Event response:", response);

  const { data = [], nextPageTimestamp = null } = response?.events ?? {};

  const allEvents: T[] = [...(previousEvents ?? []), ...(data as T[])];

  if (nextPageTimestamp) {
    return getEvents(
      { ...variables, startTime: nextPageTimestamp },
      eventType,
      allEvents,
      true
    );
  }

  return allEvents.sort((a, b) => a.timestamp - b.timestamp) as T[];
}
