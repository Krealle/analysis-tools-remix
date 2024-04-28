import {
  json,
  TypedResponse,
  type MetaFunction,
  LoaderFunctionArgs,
  HeadersFunction,
} from "@remix-run/node";
import "../styles/index.css";
import WCLUrlInput from "../components/WCLUrlInput";
import Footer from "../components/Footer";
import useWCLUrlInputStore from "../zustand/WCLUrlInputStore";
import FightBoxes from "../components/FightBoxes";
import SelectFightButtons from "../components/SelectFightButtons";
import EventNormalizer from "../components/EventNormalizer";
import { useLoaderData } from "@remix-run/react";
import useStatusStore from "../zustand/statusStore";
import { useEffect } from "react";
import { AccessSession, getSession } from "./sessions";
import WCLAuthorization from "../components/WCLAuthorization";
import Information from "../components/Information";
import { GameVersions } from "../wcl/types/report/masterData";

export const meta: MetaFunction = () => {
  return [{ title: "Analysis Tools" }];
};

type LoaderData = {
  hasAccessToken: boolean;
};

const cacheControl = "Cache-Control";
const expires = "Expires";

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const loaderCache = loaderHeaders.get(cacheControl);

  const headers: HeadersInit = {};

  const expiresDate = loaderHeaders.get(expires);

  if (expiresDate) {
    // gets overwritten by cacheControl if present anyways
    headers.Expires = expiresDate;
  }

  if (loaderCache) {
    headers[cacheControl] = loaderCache;
    headers["CDN-Cache-Control"] = loaderCache;
    headers["Vercel-CDN-Cache-Control"] = loaderCache;
  } else if (expiresDate) {
    const diff = Math.round(
      (new Date(expiresDate).getTime() - Date.now()) / 1000 - 10
    );

    if (diff > 0) {
      headers[cacheControl] = `public, s-maxage=${diff}`;
      headers["CDN-Cache-Control"] = headers[cacheControl];
      headers["Vercel-CDN-Cache-Control"] = headers[cacheControl];
    }
  } else {
    headers[cacheControl] = `public, s-maxage=1`;
    headers["CDN-Cache-Control"] = `public, s-maxage=60`;
    headers["Vercel-CDN-Cache-Control"] = `public, s-maxage=300`;
  }
  headers["Vary"] = "Cookie";

  console.info(`Headers: ${JSON.stringify(headers)}`);

  return headers;
};

/** Check if we have a proper Authorization cookie */
export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<TypedResponse<LoaderData>> => {
  const session = await getSession(request.headers.get("Cookie"));
  const accessSession = session.get("accToken") as AccessSession;

  const hasValidToken: boolean =
    accessSession &&
    Boolean(accessSession.accessToken) &&
    accessSession.expirationTime > Math.floor(Date.now() / 1000);

  console.info(`Has valid token: ${hasValidToken}`);

  return json({ hasAccessToken: hasValidToken ? true : false });
};

export default function Index(): JSX.Element {
  const fightReport = useWCLUrlInputStore((state) => state.fightReport);
  const { hasAccessToken } = useLoaderData<typeof loader>();
  const { setHasAuth } = useStatusStore();

  console.log(hasAccessToken);

  useEffect(() => {
    setHasAuth(hasAccessToken);
  }, [hasAccessToken, setHasAuth]);

  return (
    <>
      {hasAccessToken ? (
        <>
          <h1>WCL URL</h1>
          <WCLUrlInput />
          {fightReport && (
            <>
              {fightReport.masterData.gameVersion === GameVersions.Retail ? (
                <>
                  <h2>Select fights to analyze</h2>
                  <SelectFightButtons />
                  <FightBoxes />
                  <EventNormalizer />
                </>
              ) : (
                <>
                  <h2>
                    This application only support retail logs, for obvious
                    reasons.
                  </h2>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <Information />
          <WCLAuthorization />
        </>
      )}
      <Footer />
    </>
  );
}
