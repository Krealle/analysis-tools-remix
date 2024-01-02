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
