import React from "react";
import "../../styles/genericStyling.css";
import {
  ReportParseError,
  reportParseErrorIconMap,
  reportParseErrorMap,
} from "../../wcl/util/parseWCLUrl";

interface ErrorBearProps {
  error: ReportParseError;
  customMsg?: string;
}

const ErrorBear: React.FC<ErrorBearProps> = ({
  error,
  customMsg = reportParseErrorMap[error],
}) => (
  <div className="error-bear-container">
    <img
      src={reportParseErrorIconMap[error]}
      loading="lazy"
      width="48"
      height="48"
      alt="An error occurred:"
    />
    <p>{customMsg}</p>
  </div>
);

export default ErrorBear;
