import { z } from "zod";
import { WCLReportSchema } from "../report/report";
import { ActorSchema, ReportMasterDataSchema } from "../report/masterData";

export type AnyReport =
  | WCLReport
  | SummaryTableResponse
  | PlayerDetailsResponse
  | EventsResponse;

export const ReportDataSchema = z.object({
  report: WCLReportSchema,
});
export type ReportData = z.infer<typeof ReportDataSchema>;

export const RootReportSchema = z.object({
  reportData: ReportDataSchema,
});
export type RootReport = z.infer<typeof RootReportSchema>;

export const GetSummaryTableQuerySchema = WCLReportSchema.pick({
  table: true,
});
export type SummaryTableResponse = z.infer<typeof GetSummaryTableQuerySchema>;

export const GetPlayerDetailsQuerySchema = WCLReportSchema.pick({
  playerDetails: true,
});
export type PlayerDetailsResponse = z.infer<typeof GetPlayerDetailsQuerySchema>;

export const GetEventsQuerySchema = WCLReportSchema.pick({
  events: true,
});
export type EventsResponse = z.infer<typeof GetEventsQuerySchema>;

export const GetWCLReportQuerySchema = WCLReportSchema.pick({
  title: true,
  code: true,
  startTime: true,
  endTime: true,
  fights: true,
  masterData: true,
  visibility: true,
}).extend({
  masterData: ReportMasterDataSchema.pick({ actors: true }).extend({
    actors: z.array(
      ActorSchema.pick({
        gameID: true,
        id: true,
        name: true,
        type: true,
        subType: true,
        petOwner: true,
      })
    ),
  }),
});
export type WCLReport = z.infer<typeof GetWCLReportQuerySchema>;
