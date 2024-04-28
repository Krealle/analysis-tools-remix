/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { LoaderFunction, json } from "@remix-run/node";
import { EventVariables } from "../wcl/util/queryWCL";
import { AccessSession, getSession } from "./sessions";
import {
  SummaryTableResponse,
  validateData,
} from "../wcl/types/graphql/queryTypes";
import { isGraphQLError } from "../util/typeChecks";
import { ReportParseError } from "../wcl/util/parseWCLUrl";
import {
  ReportQueries,
  ReportQueryKey,
  ReportQueryKeys,
} from "../wcl/types/graphql/queries";

const YEAR_IN_SECONDS = 31536000;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const variables = url.searchParams.get("variables");
  const type = url.searchParams.get("type") as ReportQueryKey;

  const session = await getSession(request.headers.get("Cookie"));
  const accessSession = session.get("accToken") as AccessSession;

  if (!variables) {
    return json({ error: "Missing variables" });
  }
  if (!accessSession) {
    return json({ error: "Missing authorization" });
  }
  if (!type) {
    return json({ error: "Missing type" });
  }

  const parsedVariables = JSON.parse(variables) as EventVariables;

  try {
    const { requestType, responseType } = ReportQueries[type];

    const queryParams = new URLSearchParams({
      requestType: requestType,
      variables: JSON.stringify(parsedVariables),
      session: JSON.stringify(accessSession),
    });
    const baseUrl = url.origin;
    const response = await fetch(
      `${baseUrl}/api/graphqlClient?` + queryParams.toString()
    );

    if (response.ok) {
      const data = await response.json();

      if (type === ReportQueryKeys.WCLReport) return data;

      return json(data, {
        headers: {
          "Cache-Control": "max-age=0, s-maxage=300",
        },
      });

      /* const maybeRootReport = validateData(data, responseType);

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

      return maybeRootReport.data.reportData.report; json(data, {
        headers: {
          "Cache-Control": "max-age=0, s-maxage=300",
        },
      }); */
    }

    console.info(response);

    return {
      msg: "Bad response",
      status: response.status,
      statusText: response.statusText,
      uri: `${baseUrl}/api/graphqlClient?`,
    };
  } catch (error) {
    return json({ error: `Failed fetch ${(error as Error).toString()}` });
  }
};
