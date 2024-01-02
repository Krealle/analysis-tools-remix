import { z } from "zod";

import { ReportMasterDataSchema } from "./masterData";
import { PlayerDetailsRootSchema } from "./playerDetails";
import { SummaryTableSchema } from "./summaryTable";

export const UserSchema = z.object({
  __typename: z.literal("User").nullable(),
  /** The battle tag of the user if they have linked it. */
  battleTag: z.string().nullable(),
  /** The ID of the user. */
  id: z.number(),
  /** The name of the user. */
  name: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const ReportEventPaginatorSchema = z.object({
  // The list of events obtained.
  data: z.any(),
  // A timestamp to pass in as the start time when fetching the next page of data.
  nextPageTimestamp: z.number().nullable(),
});
export type ReportEventPaginator = z.infer<typeof ReportEventPaginatorSchema>;

export const GameZoneSchema = z.object({
  id: z.number(),
});
export type GameZone = z.infer<typeof GameZoneSchema>;

export const ReportFightSchema = z.object({
  id: z.number(),
  startTime: z.number(),
  endTime: z.number(),
  gameZone: GameZoneSchema,
  fightPercentage: z.number().optional().nullable(),
  keystoneLevel: z.number().optional().nullable(),
  keystoneTime: z.number().optional().nullable(),
  lastPhase: z.number().optional(),
  lastPhaseIsIntermission: z.boolean().optional(),
  name: z.string().optional(),
  difficulty: z.number().optional().nullable(),
  kill: z.boolean().optional().nullable(),
  friendlyPlayers: z.array(z.number()).optional(),
});
export type ReportFight = z.infer<typeof ReportFightSchema>;

export const ReportArchiveStatusSchema = z.object({
  __typename: z.literal("ReportArchiveStatus").nullable(),
  /** The date on which the report was archived (if it has been archived). */
  archiveDate: z.number().nullable(),
  /** Whether the current user can access the report. Always true if the report is not archived, and always false if not using user authentication. */
  isAccessible: z.boolean(),
  /** Whether the report has been archived. */
  isArchived: z.boolean(),
});
export type ReportArchiveStatus = z.infer<typeof ReportArchiveStatusSchema>;

export const CharacterSchema = z.object({
  __typename: z.literal("Character").nullable(),
  /** The canonical ID of the character. If a character renames or transfers, then the canonical id can be used to identify the most recent version of the character. */
  canonicalID: z.number(),
  /** The class id of the character. */
  classID: z.number(),
  /** Encounter rankings information for a character, filterable to specific zones, bosses, metrics, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  encounterRankings: z.unknown().nullable(), // JSON type, replace with actual schema if available

  /** Cached game data such as gear for the character. This data was fetched from the appropriate source (Blizzard APIs for WoW, Lodestone for FF). This call will only return a cached copy of the data if it exists already. It will not go out to Blizzard or Lodestone to fetch a new copy. */
  gameData: z.unknown().nullable(), // JSON type, replace with actual schema if available

  /** The guild rank of the character in their primary guild. This is not the user rank on the site, but the rank according to the game data, e.g., a Warcraft guild rank or an FFXIV Free Company rank. */
  guildRank: z.number(),
  /** All guilds that the character belongs to. */
  //guilds?: Guild[];
  /** Whether or not the character has all its rankings hidden. */
  hidden: z.boolean(),
  /** The ID of the character. */
  id: z.number(),
  /** The level of the character. */
  level: z.number(),
  /** The name of the character. */
  name: z.string(),
  /** Recent reports for the character. */
  //recentReports?: ReportPagination;
  /** The server that the character belongs to. */
  //server: Server;
  /** Rankings information for a character, filterable to specific zones, bosses, metrics, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  zoneRankings: z.unknown().nullable(), // JSON type, replace with actual schema if available
});
export type Character = z.infer<typeof CharacterSchema>;

export const WCLReportSchema = z.object({
  __typename: z.literal("Report").nullable(),
  archiveStatus: ReportArchiveStatusSchema.nullable(),
  title: z.string(),
  code: z.string(),
  endTime: z.number(),
  startTime: z.number(),
  graph: z.any().nullable(), // JSON response
  masterData: ReportMasterDataSchema.nullable(),
  events: ReportEventPaginatorSchema.nullable(),
  fights: z.array(ReportFightSchema),
  owner: UserSchema.nullable(),
  playerDetails: PlayerDetailsRootSchema,
  rankedCharacters: z.array(CharacterSchema).nullable(),
  rankings: z.any().nullable(), // JSON response
  revision: z.number().nullable(),
  segments: z.number().nullable(),
  table: z.object({ data: SummaryTableSchema }),
  visibility: z.string().nullable(),
  exportedSegments: z.number().nullable(),
  zone: GameZoneSchema.nullable(),
});
