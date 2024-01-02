import { z } from "zod";

/** The ReportAbility represents a single ability that occurs in the report. */
export const ReportAbilitySchema = z.object({
  __typename: z.literal("ReportAbility").optional(),
  /** The game ID of the ability. */
  gameID: z.number().optional(),
  /** An icon to use for the ability. */
  icon: z.string().optional(),
  /** The name of the actor. */
  name: z.string().optional(),
  /** The type of the ability. This represents the type of damage (e.g., the spell school in WoW). */
  type: z.string().optional(),
});
export type ReportAbility = z.infer<typeof ReportAbilitySchema>;

/** The ReportActor represents a single player, pet or NPC that occurs in the report. */
export const ActorSchema = z.object({
  __typename: z.literal("ReportActor").optional(),
  /** The game ID of the actor. */
  gameID: z.number().optional(),
  /** An icon to use for the actor. For pets and NPCs, this will be the icon the site chose to represent that actor. */
  icon: z.string().optional(),
  /** The report ID of the actor. This ID is used in events to identify sources and targets. */
  id: z.number(),
  /** The name of the actor. */
  name: z.string().optional(),
  /** The report ID of the actor's owner if the actor is a pet. */
  petOwner: z.number().nullable(),
  /** The normalized server name of the actor. */
  server: z.string().optional(),
  /** The sub-type of the actor, for players it's their class, and for NPCs, they are further subdivided into normal NPCs and bosses. */
  subType: z.string().optional(),
  /** The type of the actor, i.e., if it is a player, pet or NPC. */
  type: z.string().optional(),
});
export type Actor = z.infer<typeof ActorSchema>;

/** The ReportMasterData object contains information about the log version of a report, as well as the actors and abilities used in the report. */
export const ReportMasterDataSchema = z.object({
  __typename: z.literal("ReportMasterData").optional(),
  /** A list of every ability that occurs in the report. */
  abilities: z.array(ReportAbilitySchema).optional(),
  /** A list of every actor (player, NPC, pet) that occurs in the report. */
  actors: z.array(ActorSchema).optional(),
  /** The version of the game that generated the log file. Used to distinguish Classic and Retail Warcraft primarily. */
  gameVersion: z.number().optional(),
  /** The auto-detected locale of the report. This is the source language of the original log file. */
  lang: z.string().optional(),
  /** The version of the client parser that was used to parse and upload this log file. */
  logVersion: z.number().optional(),
});
export type ReportMasterData = z.infer<typeof ReportMasterDataSchema>;

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

export const StatSchema = z.object({
  min: z.number(),
  max: z.number(),
});
export type Stat = z.infer<typeof StatSchema>;

export const StatsSchema = z.object({
  Speed: StatSchema.optional(),
  Dodge: StatSchema.optional(),
  Mastery: StatSchema,
  Stamina: StatSchema.optional(),
  Haste: StatSchema,
  Leech: StatSchema.optional(),
  Armor: StatSchema.optional(),
  Agility: StatSchema.optional(),
  Crit: StatSchema,
  "Item Level": StatSchema.optional(),
  Parry: StatSchema.optional(),
  Avoidance: StatSchema.optional(),
  Versatility: StatSchema,
  Intellect: StatSchema.optional(),
  Strength: StatSchema.optional(),
});
export type Stats = z.infer<typeof StatsSchema>;

export const TalentSchema = z.object({
  name: z.string(),
  guid: z.number(),
  type: z.number(),
  abilityIcon: z.string(),
});
export type Talent = z.infer<typeof TalentSchema>;

export const CustomPowerSetSchema = z.object({
  name: z.string(),
  guid: z.number(),
  type: z.number(),
  abilityIcon: z.string(),
  total: z.number(),
});
export type CustomPowerSet = z.infer<typeof CustomPowerSetSchema>;

export const ItemQualitySchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
export enum ItemQuality {
  POOR = 1,
  COMMON = 2,
  RARE = 3,
  SUPERIOR = 4,
  LEGENDARY = 5,
}

export const GemSchema = z.object({
  id: z.number(),
  itemLevel: z.number(),
  icon: z.string(),
});
export type Gem = z.infer<typeof GemSchema>;

export const ItemSchema = z.object({
  id: z.number(),
  slot: z.number(),
  quality: ItemQualitySchema.optional(),
  icon: z.string(),
  name: z.string().nullable().optional(),
  itemLevel: z.number(),
  bonusIDs: z.array(z.number()).nullable().optional(),
  gems: z.array(GemSchema).nullable().optional(),
  permanentEnchant: z.number().nullable().optional(),
  permanentEnchantName: z.string().nullable().optional(),
  onUseEnchant: z.number().nullable().optional(),
  onUseEnchantName: z.string().nullable().optional(),
  effectID: z.number().nullable().optional(),
  effectIcon: z.string().nullable().optional(),
  effectName: z.string().nullable().optional(),
  temporaryEnchant: z.number().nullable().optional(),
  temporaryEnchantName: z.string().nullable().optional(),
});
export type Item = z.infer<typeof ItemSchema>;

export const SecondaryCustomPowerSetSchema = z.object({
  name: z.string(),
  guid: z.number(),
  type: z.number(),
  abilityIcon: z.string(),
  total: z.number(),
});
export type SecondaryCustomPowerSet = z.infer<
  typeof SecondaryCustomPowerSetSchema
>;

export const CombatantInfoSchema = z.object({
  stats: StatsSchema,
  talents: z.array(TalentSchema),
  gear: z.array(ItemSchema),
  customPowerSet: z.array(CustomPowerSetSchema).optional(),
  secondaryCustomPowerSet: z.array(SecondaryCustomPowerSetSchema).optional(),
  tertiaryCustomPowerSet: z.array(z.unknown()).optional(),
  specIDs: z.array(z.number()),
  factionID: z.number(),
  covenantID: z.number().nullable().optional(),
  soulbindID: z.number().nullable().optional(),
});
export type CombatantInfo = z.infer<typeof CombatantInfoSchema>;

export const PlayerSchema = z.object({
  name: z.string(),
  id: z.number(),
  guid: z.number(),
  type: z.string(),
  server: z.string().optional(),
  icon: z.string(),
  specs: z.array(z.string()),
  minItemLevel: z.number(),
  maxItemLevel: z.number(),
  potionUse: z.number(),
  healthstoneUse: z.number(),
  /**
   * in report K9Mfcb2CtjZ7pX6q fight 45, combatantInfo is an empty array
   * for a single player
   */
  combatantInfo: CombatantInfoSchema /* | never[]; */,
});
export type Player = z.infer<typeof PlayerSchema>;

export const PlayerDetailsSchema = z.object({
  healers: z.array(PlayerSchema),
  tanks: z.array(PlayerSchema),
  dps: z.array(PlayerSchema),
});
export type PlayerDetails = z.infer<typeof PlayerDetailsSchema>;

export const PlayerDetailsRootSchema = z.object({
  data: z.object({
    playerDetails: PlayerDetailsSchema,
  }),
});
export type PlayerDetailsRoot = z.infer<typeof PlayerDetailsRootSchema>;

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

export const SpecSchema = z.object({
  spec: z.string(),
  count: z.number().optional(),
});
export type Spec = z.infer<typeof SpecSchema>;

export const CompositionTableSchema = z.object({
  name: z.string(),
  id: z.number(),
  guid: z.number(),
  type: z.string(),
  specs: z.array(SpecSchema),
});
export type CompositionTable = z.infer<typeof CompositionTableSchema>;

export const DamageDoneTableSchema = z.object({
  name: z.string(),
  id: z.number(),
  guid: z.number(),
  type: z.string(),
  icon: z.string(),
  total: z.number(),
});
export type DamageDoneTable = z.infer<typeof DamageDoneTableSchema>;

export const HealingDoneTableSchema = z.object({
  name: z.string(),
  id: z.number(),
  guid: z.number(),
  type: z.string(),
  icon: z.string(),
  total: z.number(),
});
export type HealingDoneTable = z.infer<typeof HealingDoneTableSchema>;

export const DamageTakenTakenSchema = z.object({
  name: z.string(),
  guid: z.number(),
  type: z.number(),
  abilityIcon: z.string(),
  total: z.number(),
  composite: z.boolean().optional(),
});
export type DamageTakenTable = z.infer<typeof DamageTakenTakenSchema>;

export const DeathEventTableSchema = z.object({
  name: z.string(),
  id: z.number(),
  guid: z.number(),
  type: z.string(),
  icon: z.string(),
  deathTime: z.number(),
  ability: z.object({
    name: z.string(),
    guid: z.number(),
    type: z.number(),
    abilityIcon: z.string().optional(),
  }),
});

export const SummaryTableSchema = z.object({
  totalTime: z.number(),
  itemLevel: z.number(),
  composition: z.array(CompositionTableSchema),
  damageDone: z.array(DamageDoneTableSchema),
  healingDone: z.array(HealingDoneTableSchema),
  damageTaken: z.array(DamageTakenTakenSchema),
  deathEvents: z.array(DeathEventTableSchema),
  playerDetails: PlayerDetailsSchema,
  logVersion: z.number(),
  gameVersion: z.number(),
});
export type SummaryTable = z.infer<typeof SummaryTableSchema>;

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
/* export type WCLReport = z.infer<typeof WCLReportSchema>; */

export const ReportDataSchema = z.object({
  report: WCLReportSchema,
});
export type ReportData = z.infer<typeof ReportDataSchema>;

export const RootReportSchema = z.object({
  reportData: ReportDataSchema,
});
export type RootReport = z.infer<typeof RootReportSchema>;

/** Query Types
 * These are the various object structures that can be returned from the WCL API
 * depending on the query type.
 */
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

export type AnyReport =
  | WCLReport
  | SummaryTableResponse
  | PlayerDetailsResponse
  | EventsResponse;

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

export const ReportQueries = {
  summaryTable: {
    requestType: "getSummaryTableQuery",
    schema: createRootReportResponseSchema(GetSummaryTableQuerySchema),
  },
  playerDetails: {
    requestType: "getPlayerDetailsQuery",
    schema: createRootReportResponseSchema(GetPlayerDetailsQuerySchema),
  },
  events: {
    requestType: "getEventsQuery",
    schema: createRootReportResponseSchema(GetEventsQuerySchema),
  },
  WCLReport: {
    requestType: "getWCLReportQuery",
    schema: createRootReportResponseSchema(GetWCLReportQuerySchema),
  },
} as const;
