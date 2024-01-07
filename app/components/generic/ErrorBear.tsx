import React from "react";
import "../../styles/genericStyling.css";
import {
  ReportParseError,
  reportParseErrorIconMap,
  reportParseErrorMap,
} from "../../wcl/util/parseWCLUrl";
import WCLAuthorization from "../WCLAuthorization";

interface ErrorBearProps {
  error: ReportParseError;
  customMsg?: string;
  customHTMLMsg?: JSX.Element;
}

const ErrorBear: React.FC<ErrorBearProps> = ({
  error,
  customMsg = reportParseErrorMap[error],
  customHTMLMsg,
}) => (
  <>
    <div className="error-bear-container">
      <img
        src={reportParseErrorIconMap[error]}
        loading="lazy"
        width="48"
        height="48"
        alt="An error occurred:"
      />
      {customHTMLMsg && customHTMLMsg}
      {customMsg && <p>{customMsg}</p>}
    </div>
    {error === ReportParseError.MISSING_AUTHORIZATION && <WCLAuthorization />}
  </>
);

export default ErrorBear;
