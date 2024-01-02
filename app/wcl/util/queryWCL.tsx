import { AnyEvent, EventType } from "../events/types";
import {
  AnyReport,
  WCLReport,
  ReportQueries,
  SummaryTableResponse,
  PlayerDetailsResponse,
  PlayerDetails,
  EventsResponse,
  SummaryTable,
} from "../gql/reportTypes";
import { z } from "zod";
/* import { getMockData } from "../__test__/getMockData"; */

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
 * Fetches report data from a GraphQL API.
 *
 * @template T - The type of report data to fetch.
 * @param {keyof typeof ReportQueries} type - The type of report data to fetch.
 * @param {Variables} variables - The variables to be sent along with the GraphQL request.
 * @returns {Promise<T>}  A Promise that resolves to the fetched report data.
 * @throws Will throw an error if the GraphQL request fails after maximum retries.
 */
export async function fetchReportData<T extends AnyReport>(
  type: keyof typeof ReportQueries,
  variables: Variables
): Promise<T> {
  /* if (process.env.NODE_ENV === "development") {
    try {
      const mockData = getMockData(variables, requestType);

      const rootReport = mockData as RootReport;
      const report = rootReport.reportData.report;

      return report;
    } catch (error) {
      console.error("Failed to get mock data:", error);
    }
  } */
  const MAX_RETRIES = 3;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const { requestType, schema } = ReportQueries[type];

      const queryParams = new URLSearchParams({
        requestType: requestType,
        variables: JSON.stringify(variables),
      });
      const response = await fetch(
        "api/graphqlClient?" + queryParams.toString()
      );

      const data: unknown = await response.json();
      const rootReport = schema.parse(data);

      return rootReport.reportData.report as T;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          console.log(err.message);
          console.log(err.path);
        });
      }
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
  const response = await fetchReportData<SummaryTableResponse>(
    "summaryTable",
    variables
  );

  return response.table.data;
}

export async function getWCLReport(variables: Variables): Promise<WCLReport> {
  try {
    const response = await fetchReportData<WCLReport>("WCLReport", variables);
    return response;
  } catch (error) {
    throw new Error("Failed to get fights");
  }
}

export async function getPlayerDetails(
  variables: Variables
): Promise<PlayerDetails> {
  const response = await fetchReportData<PlayerDetailsResponse>(
    "playerDetails",
    variables
  );

  return response.playerDetails.data.playerDetails;
}

export async function getEvents<T extends AnyEvent>(
  variables: EventVariables,
  eventType?: EventType,
  previousEvents?: T[],
  recurse: boolean = false
): Promise<T[]> {
  /* if (process.env.NODE_ENV === "development") {
    try {
      const mockData = getMockData(variables, "getEventsQuery");
      return mockData as T[];
    } catch (error) {
      console.error("Failed to get mock data:", error);
    }
  } */
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

  const response = await fetchReportData<EventsResponse>("events", variables);

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
