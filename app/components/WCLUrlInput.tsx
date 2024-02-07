import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import "../styles/WCLUrlInput.css";
import { ReportParseError, parseWCLUrl } from "../wcl/util/parseWCLUrl";
import useWCLUrlInputStore from "../zustand/WCLUrlInputStore";
import ErrorBear from "./generic/ErrorBear";
import useStatusStore from "../zustand/statusStore";
import { getWCLReport } from "../wcl/util/queryWCL";
import useFightBoxesStore from "../zustand/fightBoxesStore";
import useIntervalParametersStore from "../zustand/intervalParametersStore";

const WCLUrlInput: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [errorBear, setErrorBear] = useState<ReportParseError | null>();

  const WCLReport = useWCLUrlInputStore();
  const status = useStatusStore();
  const { setSelectedIds } = useFightBoxesStore();
  const { restoreFromLocalStorage } = useIntervalParametersStore();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const { reportCode, error } = parseWCLUrl(url);
      if (!reportCode || error) {
        setErrorBear(error);
        return;
      }

      setErrorBear(null);
      status.setIsFetching(true);

      try {
        const newFightReport = await getWCLReport({ reportID: reportCode });

        if (!newFightReport?.fights?.length) {
          throw new Error(ReportParseError.EMPTY_REPORT);
        }

        if (newFightReport.code !== WCLReport.fightReport?.code) {
          setSelectedIds([]);
        }

        WCLReport.setFightReport(newFightReport);
      } catch (error) {
        if (error instanceof Error) {
          setErrorBear(error.message as ReportParseError);
        }
      } finally {
        status.setIsFetching(false);
        restoreFromLocalStorage();
      }
    },
    [url, WCLReport, status, setSelectedIds, restoreFromLocalStorage]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
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
    </>
  );
};

export default WCLUrlInput;
