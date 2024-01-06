import { Static, Type } from "@sinclair/typebox";

/** The ReportAbility represents a single ability that occurs in the report. */
export const ReportAbility = Type.Object({
  __typename: Type.Optional(Type.Literal("ReportAbility")),
  /** The game ID of the ability. */
  gameID: Type.Optional(Type.Number()),
  /** An icon to use for the ability. */
  icon: Type.Optional(Type.String()),
  /** The name of the actor. */
  name: Type.Optional(Type.String()),
  /** The type of the ability. This represents the type of damage (e.g., the spell school in WoW). */
  type: Type.Optional(Type.String()),
});

/** The ReportActor represents a single player, pet or NPC that occurs in the report. */
export const Actor = Type.Object({
  __typename: Type.Optional(Type.Literal("ReportActor")),
  /** The game ID of the actor. */
  gameID: Type.Optional(Type.Number()),
  /** An icon to use for the actor. For pets and NPCs, this will be the icon the site chose to represent that actor. */
  icon: Type.Optional(Type.String()),
  /** The report ID of the actor. This ID is used in events to identify sources and targets. */
  id: Type.Number(),
  /** The name of the actor. */
  name: Type.Optional(Type.String()),
  /** The report ID of the actor's owner if the actor is a pet. */
  petOwner: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  /** The normalized server name of the actor. */
  server: Type.Optional(Type.String()),
  /** The sub-type of the actor, for players it's their class, and for NPCs, they are further subdivided into normal NPCs and bosses. */
  subType: Type.Optional(Type.String()),
  /** The type of the actor, i.e., if it is a player, pet or NPC. */
  type: Type.Optional(Type.String()),
});
export type Actor = Static<typeof Actor>;

/** The ReportMasterData object contains information about the log version of a report, as well as the actors and abilities used in the report. */
export const ReportMasterData = Type.Object({
  __typename: Type.Optional(Type.Literal("ReportMasterData")),
  /** A list of every ability that occurs in the report. */
  abilities: Type.Optional(Type.Array(ReportAbility)),
  /** A list of every actor (player, NPC, pet) that occurs in the report. */
  actors: Type.Optional(Type.Array(Actor)),
  /** The version of the game that generated the log file. Used to distinguish Classic and Retail Warcraft primarily. */
  gameVersion: Type.Optional(Type.Number()),
  /** The auto-detected locale of the report. This is the source language of the original log file. */
  lang: Type.Optional(Type.String()),
  /** The version of the client parser that was used to parse and upload this log file. */
  logVersion: Type.Optional(Type.Number()),
});
export type ReportMasterData = Static<typeof ReportMasterData>;
