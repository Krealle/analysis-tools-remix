export enum ReportParseError {
  INVALID_HOST = "INVALID_HOST",
  INVALID_REPORT_ID = "INVALID_REPORT_ID",
  INVALID_URL = "INVALID_URL",
  INVALID_FILTER = "INVALID_FILTER",
  EMPTY_REPORT = "EMPTY_REPORT",
  NETWORK_ERROR = "NETWORK_ERROR",
  MISSING_AUTHORIZATION = "MISSING_AUTHORIZATION",
  BAD_RESPONSE = "BAD_RESPONSE",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  UNKNOWN_GRAPHQL_ERROR = "UNKNOWN_GRAPHQL_ERROR",
  MISSING_REDIRECT_URI = "MISSING_REDIRECT_URI",
}

export const reportParseErrorMap: Record<ReportParseError, string> = {
  INVALID_HOST: "This doesn't seem to be a Warcraft Logs link.",
  INVALID_REPORT_ID: "The report ID seems to be malformed.",
  INVALID_URL: "This doesn't seem to be a valid URL.",
  INVALID_FILTER: "This filter is not valid.",
  EMPTY_REPORT: "This report appears to be empty.",
  NETWORK_ERROR:
    "Failed to fetch fights from WCL. You might need to re-authorize.",
  MISSING_AUTHORIZATION:
    "Failed to fetch fights from WCL due to: Missing authorization",
  BAD_RESPONSE: "Bad data response from WCL",
  UNKNOWN_ERROR: "Unknown error",
  UNKNOWN_GRAPHQL_ERROR: "Unknown GraphQL error",
  MISSING_REDIRECT_URI: "Redirect URL not found, try again.",
};

export const reportParseErrorIconMap: Record<ReportParseError, string> = {
  INVALID_HOST: "/static/bear/cry-48.png",
  INVALID_REPORT_ID: "/static/bear/concern-48.png",
  INVALID_URL: "/static/bear/bonk-48.png",
  INVALID_FILTER: "/static/bear/shrug-48.png",
  EMPTY_REPORT: "/static/bear/lost-48.png",
  NETWORK_ERROR: "/static/bear/dead-48.png",
  MISSING_AUTHORIZATION: "/static/bear/dead-48.png",
  BAD_RESPONSE: "/static/bear/dead-48.png",
  UNKNOWN_ERROR: "/static/bear/dead-48.png",
  UNKNOWN_GRAPHQL_ERROR: "/static/bear/dead-48.png",
  MISSING_REDIRECT_URI: "/static/bear/lost-48.png",
};

export const parseWCLUrl = (
  maybeURL: string
): {
  reportCode: string | null;
  error: ReportParseError | null;
} => {
  if (isValidReportId(maybeURL)) {
    return {
      reportCode: maybeURL,
      error: null,
    };
  }

  try {
    const { pathname, host, hash } = new URL(maybeURL);

    // not a WCL url
    if (
      !host.includes("warcraftlogs.com") ||
      !pathname.startsWith("/reports/")
    ) {
      return {
        reportCode: null,
        error: ReportParseError.INVALID_HOST,
      };
    }

    const maybeReportID = pathname.replace("/reports/", "").replace("/", "");

    // WCL url, but doesn't point to reports
    if (!isValidReportId(maybeReportID)) {
      return {
        reportCode: null,
        error: ReportParseError.INVALID_REPORT_ID,
      };
    }

    // WCL url, points to reports, but no fight selected
    if (!hash) {
      return {
        reportCode: maybeReportID,
        error: null,
      };
    }

    const maybeFightID = new URLSearchParams(hash.slice(1)).get("fight");

    // no fightID at all
    if (!maybeFightID) {
      return {
        reportCode: maybeReportID,
        error: null,
      };
    }

    // fightID may be `last` or numeric
    if (maybeFightID === "last" || Number.parseInt(maybeFightID) > 0) {
      return {
        reportCode: maybeReportID,
        error: null,
      };
    }

    return {
      reportCode: maybeReportID,
      error: null,
    };
  } catch {
    return {
      reportCode: null,
      error: ReportParseError.INVALID_URL,
    };
  }
};

const isValidReportId = (id?: string | string[]): id is string => {
  if (!id || Array.isArray(id) || id.includes(".")) {
    return false;
  }

  return (id.startsWith("a:") && id.length === 18) || id.length === 16;
};
