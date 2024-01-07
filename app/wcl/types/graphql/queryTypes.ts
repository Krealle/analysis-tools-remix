import { Static, Type } from "@sinclair/typebox";
import { Actor } from "../report/masterData";
import { BaseWCLReport } from "../report/report";
import Ajv, { ErrorObject } from "ajv";

export const GetSummaryTableQuery = Type.Pick(BaseWCLReport, ["table"]);
export type SummaryTableResponse = Static<typeof GetSummaryTableQuery>;

export const GetEventsQuery = Type.Pick(BaseWCLReport, ["events"]);
export type EventsResponse = Static<typeof GetEventsQuery>;

export const GetWCLReportQuery = Type.Intersect([
  Type.Pick(BaseWCLReport, [
    "title",
    "code",
    "startTime",
    "endTime",
    "fights",
    "visibility",
  ]),
  Type.Object({
    masterData: Type.Intersect([
      Type.Object({
        actors: Type.Array(
          Type.Pick(Actor, [
            "gameID",
            "id",
            "name",
            "type",
            "subType",
            "petOwner",
          ])
        ),
      }),
    ]),
  }),
]);
export type WCLReport = Static<typeof GetWCLReportQuery>;

export type AnyReport = Static<AnyReportQuery>;
export type AnyReportQuery =
  | typeof GetWCLReportQuery
  | typeof GetSummaryTableQuery
  | typeof GetEventsQuery;

export type RootReportResponse<T extends AnyReport> = {
  reportData: {
    report: T;
  };
};

export function validateData<T extends AnyReport>(
  data: unknown,
  schema: AnyReportQuery
): {
  data?: RootReportResponse<T>;
  errors?: ErrorObject[] | null | undefined;
} {
  const ajv = new Ajv();

  const validationSchema = Type.Object({
    reportData: Type.Object({
      report: schema,
    }),
  });

  const validate = ajv.compile(validationSchema);
  const valid = validate(data);

  if (!valid) {
    return { errors: validate.errors };
  }

  return { data: data as RootReportResponse<T> };
}

export function isGraphQLError(
  data: unknown
): data is typeof GraphQLErrorResponse {
  const ajv = new Ajv();
  const validate = ajv.compile(GraphQLErrorResponse);

  return validate(data);
}

const GraphQLErrorResponse = Type.Object({
  error: Type.Any(),
});
