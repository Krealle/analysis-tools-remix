import { LoaderFunction, json } from "@remix-run/node";
import { GraphQLClient } from "graphql-request";
import { Queries, QueryTypes } from "../wcl/gql/queries";
import { Variables } from "../wcl/util/queryWCL";

const cache = new Map<string, unknown>();

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const requestType = url.searchParams.get("requestType") as keyof QueryTypes;
  const variables = url.searchParams.get("variables");

  if (!requestType) return json({ error: `Missing request type` });
  if (!variables) return json({ error: "Missing variables" });

  const cacheKey = `${requestType}-${variables}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return { data: cachedData };
  }

  const parsedVariables = JSON.parse(variables) as Variables;

  const cookieHeader = request.headers.get("cookie");

  const cookies = cookieHeader?.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split("=");
    acc[name] = value;
    return acc;
  }, {} as Record<string, string>);

  const accessToken = cookies?.accessToken;

  if (!accessToken) return json({ error: `Missing authorization` });

  try {
    const API_URL = "https://www.warcraftlogs.com/api/v2/user";
    const client = new GraphQLClient(API_URL, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await client.request(Queries[requestType], parsedVariables);
    cache.set(cacheKey, data);

    return { data };
  } catch (error) {
    return json({ error: `Failed query ${error}` });
  }
};
