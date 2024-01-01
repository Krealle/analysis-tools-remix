import {
  PlayerDetails,
  RootReport,
  SummaryTable,
  WCLReport,
} from "../gql/types";
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

/**
 * Fetches report data from the server.
 * @param requestType - The type of the query request.
 * @param variables - The variables to be passed in the query request.
 * @returns A WCLReport containing information based on the requestType.
 * @throws An error if all retries fail.
 */
export async function fetchReportData(
  requestType: keyof QueryTypes,
  variables: Variables
): Promise<WCLReport> {
  const MAX_RETRIES = 3;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const queryParams = new URLSearchParams({
        requestType: requestType,
        variables: JSON.stringify(variables),
      });
      const response = await fetch(
        "api/graphqlClient?" + queryParams.toString()
      );
      const data = await response.json();
      const rootReport = data.data as RootReport;

      const report = rootReport.reportData.report;

      return report;
    } catch (error) {
      console.error("GraphQL request error:", error);
      attempts += 1;
    }
  }

  // If all retries fail, throw an error
  throw new Error("GraphQL request error");
}

export async function getSummaryTable(
  variables: Variables
): Promise<SummaryTable> {
  const response = await fetchReportData("getSummaryTableQuery", variables);
  if (!response.table) {
    throw new Error("No summary table found");
  }

  return response.table.data;
}

export async function getFights(variables: Variables): Promise<WCLReport> {
  try {
    const response = await fetchReportData("getFightsQuery", variables);
    return response;
  } catch (error) {
    throw new Error("Failed to get fights");
  }
}

export async function getPlayerDetails(
  variables: Variables
): Promise<PlayerDetails | undefined> {
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
  recurse: boolean = false
): Promise<T[]> {
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
      //console.log(`added type: "` + eventType + `" to filter`);
    }
    //console.log("filter for fetching Events:", variables.filterExpression);
  }

  const response = await fetchReportData("getEventsQuery", variables);

  //console.log("Event response:", response);

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

  return allEvents;
}
