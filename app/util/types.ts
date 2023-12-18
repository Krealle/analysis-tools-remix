import {
  ApplyBuffEvent,
  DamageEvent,
  RemoveBuffEvent,
} from "../wcl/events/types";

export type FightTracker = {
  fightId: number;
  reportCode: string;
  startTime: number;
  endTime: number;
  actors: number[];
  damageEvents: DamageEvent[];
  buffEvents: (ApplyBuffEvent | RemoveBuffEvent)[];
};

export type WindowEvent = {
  sourceId: number;
  start: number;
  end: number;
};

export type EventGroup = {
  [abilityId: string]: WindowEvent[];
};

export type PlayerBuffEvents = {
  [targetId: string]: EventGroup;
};

export type TotInterval = {
  currentInterval: number;
  start: number;
  end: number;
  intervalEntries: IntervalSet[];
};

export type IntervalSet = IntervalEntry[];

export type IntervalEntry = {
  id: number;
  damage: number;
};

export type TimeSkipIntervals = {
  start: string;
  end: string;
};

export type FormattedTimeSkipIntervals = {
  start: number;
  end: number;
};

export type TimeIntervals = {
  start: string;
  end: string;
};

export type FightParameters = {
  timeIntervals: TimeIntervals[];
  customBlacklist: string;
};

export type EnemyTracker = Map<number, number>;
