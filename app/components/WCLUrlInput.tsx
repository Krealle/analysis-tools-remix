import { ChangeEvent, FormEvent, useState } from "react";
import "../styles/WCLUrlInput.css";
import { ReportParseError, parseWCLUrl } from "../wcl/gql/util/parseWCLUrl";
import useWCLUrlInputStore from "../zustand/WCLUrlInputStore";
import ErrorBear from "./generic/ErrorBear";
import useStatusStore from "../zustand/statusStore";
import { WCLAuthorization } from "./WCLAuthorization";

export const WCLUrlInput = () => {
  const [url, setUrl] = useState<string>("");
  const [errorBear, setErrorBear] = useState<ReportParseError | undefined>();

  const WCLReport = useWCLUrlInputStore();
  const status = useStatusStore();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const { reportCode, error } = parseWCLUrl(url);
    if (!reportCode || error) {
      if (error) {
        setErrorBear(error);
      }
      return;
    }
    status.setIsFetching(true);

    setErrorBear(undefined);
    status.setIsFetching(false);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex">
        <div className="flex">
          <div>
            <input
              type="text"
              placeholder="Enter WCL URL"
              className="wclUrlInput"
              value={url}
              onChange={handleChange}
              disabled={status.isFetching}
            />
          </div>
          <button
            type="submit"
            disabled={status.isFetching}
            className="wclUrlButton"
          >
            {/* isSubmitting ? "Fetching..." : */ "Fetch Fights"}
          </button>
        </div>
      </form>
      {errorBear && <ErrorBear error={errorBear} />}
      {!status.hasAuth && <WCLAuthorization />}
      {/* {!hasAuth && <HandleUserAuthorization />}*/}
    </>
  );
};
