export type QueryTypes = typeof Queries;

export const Queries = {
  getWCLReportQuery: `
query getReport($reportID: String!) {
  reportData {
    report(code: $reportID) {
      title
      code
      startTime
      endTime
      fights(translate: true) {
        id
        startTime
        endTime
        gameZone {
          id
        }
        name
        keystoneLevel
        keystoneTime
        fightPercentage
        lastPhase
        lastPhaseIsIntermission
        difficulty
        kill
        friendlyPlayers
      }
      masterData(translate: true) {
        actors(
          type: "",
          subType: ""
        ) {
          gameID
          id
          name
          petOwner
          subType
          type
        }
      }
      visibility
    }
  }
}
`,

  getPlayerDetailsQuery: `
query getReport($reportID: String!, $fightIDs: [Int]!) {
  reportData {
    report(code: $reportID) {
      playerDetails(fightIDs: $fightIDs)
    }
  }
}
`,

  getEventsQuery: `
  query getEvents(
    $reportID: String!
    $startTime: Float!
    $endTime: Float!
    $limit: Int
    $filterExpression: String
  ) {
    reportData {
      report(code: $reportID) {
        events(
          startTime: $startTime
          endTime: $endTime
          limit: $limit
          filterExpression: $filterExpression
        ) {
          data
          nextPageTimestamp
        }
      }
    }
  }`,

  getSummaryTableQuery: ` query getTable(
    $reportID: String!
    $fightIDs: [Int]!
  ) {
    reportData {
      report(code: $reportID) {
        table(dataType: Summary, fightIDs: $fightIDs)
      }
    }
  }`,
} as const;
