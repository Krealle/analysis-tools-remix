import { /* HeadersFunction, */ LoaderFunction, json } from "@vercel/remix";
import { GraphQLClient } from "graphql-request";
import { Queries, QueryTypes } from "../wcl/types/graphql/queries";
import { Variables } from "../wcl/util/queryWCL";
import { AccessSession, getSession } from "./sessions";

/** Cache for storing reports, to not have to re-fetch data after a refresh */
/* const CACHE = new Map<string, unknown>(); */

/* const cacheControl = "Cache-Control";

export const headers: HeadersFunction = () => {
  const headers: HeadersInit = {};

  headers[cacheControl] = `public, s-maxage=100`;
  headers["CDN-Cache-Control"] = `public, s-maxage=60`;
  headers["Vercel-CDN-Cache-Control"] = `public, s-maxage=300`;

  return headers;
}; */

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const requestType = url.searchParams.get("requestType") as keyof QueryTypes;
  const variables = url.searchParams.get("variables");
  const session = await getSession(request.headers.get("Cookie"));

  if (!requestType) {
    return json({ error: `Missing request type` });
  }
  if (!variables) {
    return json({ error: "Missing variables" });
  }
  if (!(requestType in Queries)) {
    return json({ error: `Invalid request type` });
  }

  /* const cacheKey = `${requestType}-${variables}`;
  const cachedData = CACHE.get(cacheKey); */
  /** Make sure we allow for fetching new fights */
  /* if (cachedData && requestType !== "getWCLReportQuery") {
    return cachedData;
  } */

  const parsedVariables = JSON.parse(variables) as Variables;

  const accessSession = session.get("accToken") as AccessSession;
  if (
    !accessSession ||
    !accessSession.expirationTime ||
    accessSession.expirationTime < Math.floor(Date.now() / 1000)
  ) {
    return json({ error: `Missing authorization` });
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

    /* if (requestType !== "getWCLReportQuery") { */
    client.setHeader("Vercel-CDN-Cache-Control", "max-age=3600");
    client.setHeader("CDN-Cache-Control", "max-age=60");
    client.setHeader("Cache-Control", "max-age=100");
    /* } */

    const data = await client.request(
      Queries[requestType as keyof QueryTypes],
      parsedVariables
    );
    /* CACHE.set(cacheKey, data); */

    return data;
  } catch (error) {
    return json({ error: `Failed query ${(error as Error).toString()}` });
  }
};
