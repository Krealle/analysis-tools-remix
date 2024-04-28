import { ReportQueries } from "../types/graphql/queries";
import { EventType } from "../types/events/eventEnums";
import {
  AnyReport,
  EventsResponse,
  SummaryTableResponse,
  WCLReport,
  validateData,
} from "../types/graphql/queryTypes";
import { isGraphQLError } from "../../util/typeChecks";
import { AnyEvent } from "../types/events/eventTypes";
import { SummaryTable } from "../types/report/summaryTable";
import { ReportParseError } from "./parseWCLUrl";

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
  const MAX_RETRIES = 3;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const { requestType, responseType } = ReportQueries[type];

      const queryParams = new URLSearchParams({
        requestType: requestType,
        variables: JSON.stringify(variables),
      });
      const response = await fetch(
        "api/graphqlClient?" + queryParams.toString()
      );

      const data: unknown = await response.json();
      const maybeRootReport = validateData<T>(data, responseType);

      if (!maybeRootReport.data) {
        if (isGraphQLError(data)) {
          if (
            data.error === "Missing authorization" ||
            data.error === "Authorization expired"
          ) {
            throw new Error(ReportParseError.MISSING_AUTHORIZATION);
          }
          throw new Error(ReportParseError.UNKNOWN_GRAPHQL_ERROR);
        }

        if (maybeRootReport.errors) {
          throw new Error(ReportParseError.BAD_RESPONSE);
        }
        throw new Error(ReportParseError.UNKNOWN_ERROR);
      }

      console.log(maybeRootReport.data.reportData.report);
      return maybeRootReport.data.reportData.report;
    } catch (error) {
      attempts += 1;
      console.log(error);

      if (attempts >= MAX_RETRIES) {
        console.log(error);
        throw error;
      }
    }
  }
  // If all retries fail, throw an error
  throw new Error(ReportParseError.UNKNOWN_ERROR);
}

export async function getSummaryTable(
  variables: Variables
): Promise<SummaryTable> {
  try {
    const response = await fetchReportData<SummaryTableResponse>(
      "summaryTable",
      variables
    );

    return response.table.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
    throw ReportParseError.UNKNOWN_ERROR;
  }
}

export async function getWCLReport(variables: Variables): Promise<WCLReport> {
  try {
    const response = await fetchReportData<WCLReport>("WCLReport", variables);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
    throw ReportParseError.UNKNOWN_ERROR;
  }
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
    }
  }

  try {
    const response = await fetchReportData<EventsResponse>("events", variables);

    const { data = [], nextPageTimestamp = null } = response.events ?? {};

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
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
    throw ReportParseError.UNKNOWN_ERROR;
  }
}
