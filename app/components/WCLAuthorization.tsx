import { useState } from "react";
import { WclAuthUrl } from "../routes/_auth.wclAuth";
import ErrorBear from "./generic/ErrorBear";
import { ReportParseError } from "../wcl/util/parseWCLUrl";

const WCLAuthorization: React.FC = () => {
  const [authorizationUrl, setAuthorizationUrl] = useState<string | null>(null);
  const [errorBear, setErrorBear] = useState<ReportParseError | null>();

  const handleAuthorization = async (): Promise<string | undefined> => {
    setErrorBear(null);
    const response = await fetch("/wclAuth?init");

    /** Dev token set */
    if (response.redirected) return (window.location.href = response.url);

    const data = (await response.json()) as WclAuthUrl;

    if (response.ok && data.authorizationUrl) {
      setAuthorizationUrl(data.authorizationUrl);
    } else {
      setErrorBear(ReportParseError.MISSING_REDIRECT_URI);
      throw new Error("No authorizationUrl in response");
    }
  };

  if (authorizationUrl) {
    window.location.href = authorizationUrl;
  }

  return (
    <>
      <h2>Warcraft Logs Authorization</h2>
      <button
        onClick={() => {
          const res = handleAuthorization();

          if (res instanceof Promise) {
            res.catch((err) => console.error(err));
          }
        }}
      >
        Get WCL Auth
      </button>
      {errorBear && <ErrorBear error={errorBear} />}
    </>
  );
};

export default WCLAuthorization;
