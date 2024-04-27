/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { LoaderFunction, json } from "@remix-run/node";
import {
  EventVariables,
  fetchReportData,
  getEvents,
  getSummaryTable,
} from "../wcl/util/queryWCL";
import { getFilter } from "../wcl/util/filters";
import { SummaryTableResponse } from "../wcl/types/graphql/queryTypes";
import { AccessSession, getSession } from "./sessions";
/* import { ReportParseError } from "../wcl/util/parseWCLUrl"; */

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const variables = url.searchParams.get("variables");
  const phaseEventVariables = url.searchParams.get("phaseEventVariables");

  const session = await getSession(request.headers.get("Cookie"));
  const accessSession = session.get("accToken") as AccessSession;

  if (!variables) {
    return json({ error: "Missing variables" });
  }
  if (!phaseEventVariables) {
    return json({ error: "Missing phaseEventVariables" });
  }
  if (!accessSession) {
    return json({ error: "Missing authorization" });
  }

  const parsedVariables = JSON.parse(variables) as EventVariables;
  /* const parsedPhaseEventVariables = JSON.parse(
    phaseEventVariables
  ) as EventVariables; */

  try {
    /* const summaryTable = await getSummaryTable(parsedVariables); */
    /* const summaryTable = await fetchReportData<SummaryTableResponse>(
      "summaryTable",
      parsedVariables
    ); */

    const queryParams = new URLSearchParams({
      requestType: "getSummaryTableQuery",
      variables: JSON.stringify(parsedVariables),
      session: JSON.stringify(accessSession),
    });
    const baseUrl = process.env.BASE_URL;
    const response = await fetch(
      `${baseUrl}/api/graphqlClient?` + queryParams.toString()
    );
    const data = await response.json();

    /* parsedVariables.filterExpression = getFilter();
    const events = await getEvents(parsedVariables);
    const phaseEvents = await getEvents(parsedPhaseEventVariables); */

    return data;
    /* return {
      summaryTable: summaryTable.table.data,
      events: events,
      phaseEvents: phaseEvents,
    }; */
  } catch (error) {
    return error; /* {
      error: error as ReportParseError,
      fight: parsedVariables?.fightIDs?.[0] || -1,
    }; */
  }
};
