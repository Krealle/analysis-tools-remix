import { Static, Type } from "@sinclair/typebox";
import { ReportMasterData } from "./masterData";
import { PlayerDetailsRoot } from "./playerDetails";
import { SummaryTable } from "./summaryTable";
import { BaseEvent } from "../events/eventTypes";

/** The User represents a user on the site. */
export const User = Type.Object({
  __typename: Type.Optional(Type.Literal("User")),
  /** The battle tag of the user if they have linked it. */
  battleTag: Type.Optional(Type.String()),
  /** The ID of the user. */
  id: Type.Number(),
  /** The name of the user. */
  name: Type.String(),
});

export const ReportEventPaginator = Type.Object({
  /**  The list of events obtained.
   * The reason we only use BaseEvent, is that for speeding up validation.
   * We won't to ensure that our data is "clean", but if we were to search using
   * AnyEvent, it becomes a very complex check and slows the validation down, a lot.
   * So therefore we only check if they fit the BaseEvent format:
   * Type + Timestamp - All events need these, so if any events doesn't have these
   * We can consider them "unclean". */
  data: Type.Array(BaseEvent),
  // A timestamp to pass in as the start time when fetching the next page of data.
  nextPageTimestamp: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
});

export const GameZone = Type.Object({
  id: Type.Number(),
});

export const PhaseTransition = Type.Object({
  id: Type.Number(),
  startTime: Type.Number(),
});
export type PhaseTransition = Static<typeof PhaseTransition>;

export const ReportFight = Type.Object({
  id: Type.Number(),
  startTime: Type.Number(),
  endTime: Type.Number(),
  gameZone: GameZone,
  fightPercentage: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  keystoneLevel: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  keystoneTime: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  lastPhase: Type.Optional(Type.Number()),
  lastPhaseIsIntermission: Type.Optional(Type.Boolean()),
  phaseTransitions: Type.Optional(
    Type.Union([Type.Array(PhaseTransition), Type.Null()])
  ),
  name: Type.Optional(Type.String()),
  difficulty: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  kill: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
  friendlyPlayers: Type.Optional(Type.Array(Type.Number())),
});
export type ReportFight = Static<typeof ReportFight>;

export const ReportArchiveStatus = Type.Object({
  __typename: Type.Optional(Type.Literal("ReportArchiveStatus")),
  /** The date on which the report was archived (if it has been archived). */
  archiveDate: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  /** Whether the current user can access the report. Always true if the report is not archived, and always false if not using user authentication. */
  isAccessible: Type.Boolean(),
  /** Whether the report has been archived. */
  isArchived: Type.Boolean(),
});

export const Character = Type.Object({
  __typename: Type.Optional(Type.Literal("Character")),
  /** The canonical ID of the character. If a character renames or transfers, then the canonical id can be used to identify the most recent version of the character. */
  canonicalID: Type.Number(),
  /** The class id of the character. */
  classID: Type.Number(),
  /** Encounter rankings information for a character, filterable to specific zones, bosses, metrics, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  encounterRankings: Type.Optional(Type.Unknown()), // JSON type, replace with actual  if available

  /** Cached game data such as gear for the character. This data was fetched from the appropriate source (Blizzard APIs for WoW, Lodestone for FF). This call will only return a cached copy of the data if it exists already. It will not go out to Blizzard or Lodestone to fetch a new copy. */
  gameData: Type.Optional(Type.Unknown()), // JSON type, replace with actual  if available

  /** The guild rank of the character in their primary guild. This is not the user rank on the site, but the rank according to the game data, e.g., a Warcraft guild rank or an FFXIV Free Company rank. */
  guildRank: Type.Number(),
  /** All guilds that the character belongs to. */
  //guilds?: Guild[];
  /** Whether or not the character has all its rankings hidden. */
  hidden: Type.Boolean(),
  /** The ID of the character. */
  id: Type.Number(),
  /** The level of the character. */
  level: Type.Number(),
  /** The name of the character. */
  name: Type.String(),
  /** Recent reports for the character. */
  //recentReports?: ReportPagination;
  /** The server that the character belongs to. */
  //server: Server;
  /** Rankings information for a character, filterable to specific zones, bosses, metrics, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  zoneRankings: Type.Optional(Type.Unknown()), // JSON type, replace with actual  if available
});

export const BaseWCLReport = Type.Object({
  __typename: Type.Optional(Type.Literal("Report")),
  archiveStatus: Type.Optional(ReportArchiveStatus),
  title: Type.String(),
  code: Type.String(),
  endTime: Type.Number(),
  startTime: Type.Number(),
  graph: Type.Optional(Type.Unknown()), // JSON response
  masterData: Type.Optional(ReportMasterData),
  events: ReportEventPaginator,
  fights: Type.Array(ReportFight),
  owner: Type.Optional(User),
  playerDetails: PlayerDetailsRoot,
  rankedCharacters: Type.Optional(Type.Array(Character)),
  rankings: Type.Optional(Type.Unknown()), // JSON response
  revision: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  segments: Type.Optional(Type.Number()),
  table: Type.Object({ data: SummaryTable }),
  visibility: Type.Optional(Type.String()),
  exportedSegments: Type.Optional(Type.Number()),
  zone: Type.Optional(GameZone),
});
export type BaseWCLReport = Static<typeof BaseWCLReport>;

export const ReportData = Type.Object({
  report: BaseWCLReport,
});

export const RootReport = Type.Object({
  reportData: ReportData,
});
