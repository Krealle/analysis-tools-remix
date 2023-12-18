import { ChangeEvent, FormEvent, useState } from "react";
import "../styles/WCLUrlInput.css";
import { ReportParseError, parseWCLUrl } from "../wcl/util/parseWCLUrl";
import useWCLUrlInputStore from "../zustand/WCLUrlInputStore";
import ErrorBear from "./generic/ErrorBear";
import useStatusStore from "../zustand/statusStore";
import { WCLAuthorization } from "./WCLAuthorization";
import { getFights } from "../wcl/util/queryWCL";
import useFightBoxesStore from "../zustand/fightBoxesStore";

export const WCLUrlInput = () => {
  const [url, setUrl] = useState<string>("");
  const [errorBear, setErrorBear] = useState<ReportParseError | undefined>();

  const WCLReport = useWCLUrlInputStore();
  const status = useStatusStore();
  const { setSelectedIds } = useFightBoxesStore();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const { reportCode, error } = parseWCLUrl(url);
    if (!reportCode || error) {
      if (error) {
        setErrorBear(error);
      }
      return;
    }
    setErrorBear(undefined);
    status.setIsFetching(true);
    try {
      const newFightReport = await getFights({ reportID: reportCode });

      if (newFightReport?.code !== WCLReport.fightReport?.code) {
        setSelectedIds([]);
      }
      console.log(newFightReport);

      WCLReport.setFightReport(newFightReport);
    } catch (error) {
      // Handle errors here
    } finally {
      status.setIsFetching(false);
    }
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
            {status.isFetching ? "Fetching..." : "Fetch Fights"}
          </button>
        </div>
      </form>
      {errorBear && <ErrorBear error={errorBear} />}
      {!status.hasAuth && <WCLAuthorization />}
    </>
  );
};
