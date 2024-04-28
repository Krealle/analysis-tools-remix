import { LoaderFunction, json } from "@remix-run/node";
import { GraphQLClient } from "graphql-request";
import { Queries, QueryTypes } from "../wcl/types/graphql/queries";
import { Variables } from "../wcl/util/queryWCL";
import { AccessSession, getSession } from "./sessions";

export const loader: LoaderFunction = async ({ request }) => {
  console.info("Requesting...");
  const url = new URL(request.url);
  const requestType = url.searchParams.get("requestType") as keyof QueryTypes;
  const variables = url.searchParams.get("variables");
  const session = await getSession(request.headers.get("Cookie"));
  /* const maybeAccessSession = url.searchParams.get("foo"); */

  console.info("We do be requesting", requestType);
  /*   console.info("maybeAccessSession", maybeAccessSession); */

  if (!requestType) {
    return json({ error: `Missing request type` });
  }
  if (!variables) {
    return json({ error: "Missing variables" });
  }
  if (!(requestType in Queries)) {
    return json({ error: `Invalid request type` });
  }

  const parsedVariables = JSON.parse(variables) as Variables;

  const accessSession = session.get("accToken") as AccessSession;

  if (!accessSession) {
    /* if (!maybeAccessSession) { */
    return json({ error: `Missing authorization` });
    /* }

    const parsedMaybeSession = JSON.parse(maybeAccessSession) as AccessSession;
    accessSession = parsedMaybeSession; */
  }

  console.info(accessSession);

  if (
    !accessSession.expirationTime ||
    accessSession.expirationTime < Math.floor(Date.now() / 1000)
  ) {
    return json({ error: `Authorization expired` });
  }

  try {
    const API_URL =
      process.env.NODE_ENV !== "development"
        ? "https://www.warcraftlogs.com/api/v2/user"
        : "https://www.warcraftlogs.com/api/v2/client";
    const client = new GraphQLClient(API_URL, {
      headers: {
        authorization: `Bearer ${accessSession.accessToken}`,
      },
    });

    const data = await client.request(
      Queries[requestType as keyof QueryTypes],
      parsedVariables
    );

    return data;
  } catch (error) {
    return json({ error: `Failed query ${(error as Error).toString()}` });
  }
};
