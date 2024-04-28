/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { LoaderFunction, json } from "@remix-run/node";
import { EventVariables } from "../wcl/util/queryWCL";
import { AccessSession, getSession } from "./sessions";

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

  try {
    const queryParams = new URLSearchParams({
      requestType: "getSummaryTableQuery",
      variables: JSON.stringify(parsedVariables),
      session: JSON.stringify(accessSession),
    });
    const baseUrl = url.origin;

    console.info(`${baseUrl}/api/graphqlClient?`);

    const response = await fetch(
      `${baseUrl}/api/graphqlClient?` + queryParams.toString(),
      { credentials: "include" }
    );

    if (response.ok) {
      const data = await response.json();
      return {
        msg: "Good response",
        uri: `${baseUrl}/api/graphqlClient?`,
        data: data,
      };
    }
    console.info(
      `${response.status} - ${response.statusText} - ${response.type}`
    );
    console.info(response);
    return {
      msg: "Bad response",
      status: response.status,
      statusText: response.statusText,
      uri: `${baseUrl}/api/graphqlClient?`,
    };
  } catch (error) {
    console.error((error as Error).toString());
    return error;
  }
};
