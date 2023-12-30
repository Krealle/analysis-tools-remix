import {
  json,
  TypedResponse,
  type MetaFunction,
  LoaderFunctionArgs,
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

export const meta: MetaFunction = () => {
  return [{ title: "Analysis Tools" }];
};

type LoaderData = {
  hasAccessToken: boolean;
};
/** Check if we have a proper Authorization cookie */
export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<TypedResponse<LoaderData>> => {
  const session = await getSession(request.headers.get("Cookie"));
  const accessSession = session.get("accToken") as AccessSession;

  const hasValidToken: boolean =
    accessSession &&
    !!accessSession.accessToken &&
    accessSession.expirationTime > Math.floor(Date.now() / 1000);

  return json({ hasAccessToken: hasValidToken ? true : false });
};

export default function Index(): JSX.Element {
  const fightReport = useWCLUrlInputStore((state) => state.fightReport);
  const { hasAccessToken } = useLoaderData<typeof loader>();
  const { setHasAuth } = useStatusStore();

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
              <h2>Select fights to analyze</h2>
              <SelectFightButtons />
              <FightBoxes />
              <EventNormalizer />
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
