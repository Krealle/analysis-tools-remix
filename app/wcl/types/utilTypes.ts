import { z } from "zod";
import {
  AnyReport,
  RootReport,
  RootReportSchema,
  ReportDataSchema,
} from "./graphql/queryTypes";

/** So much Typescript magic happening below */
export type RootReportResponseType<T extends AnyReport> = {
  reportData: {
    report: T;
  };
} & Omit<RootReport, "reportData">;

export type RootReportResponseValidationSchema = z.ZodSchema<
  RootReportResponseType<AnyReport>
>;
export const createRootReportResponseSchema = (
  report: z.ZodSchema<AnyReport>
): RootReportResponseValidationSchema => {
  return RootReportSchema.extend({
    reportData: ReportDataSchema.extend({
      report: report,
    }),
  });
};
