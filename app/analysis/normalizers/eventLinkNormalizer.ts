import {
  AnyDebuffEvent,
  ApplyDebuffEvent,
  CastEvent,
  DamageEvent,
  EventType,
  RefreshDebuffEvent,
  RemoveDebuffEvent,
} from "../../wcl/events/types";

/**
 * The goal of this normalizer is to link dot ticks up with their application
 * this is needed so we can know what buffs to snapshot along with our dots
 *
 * the way this works is that we link the "parent" event to the "child" event
 * aka. the event that applied/refreshed the dot.
 *
 * This way we can reference the parent event and grab our buff count from that event!
 *
 * This is mainly only needed for the very few dots left in the game that snapshot.
 * Where the attribution part is always calculated on Debuff Apply or Debuff Refresh.
 *
 * An example of this is BM hunters - Master Marksman
 * https://www.wowhead.com/spell=260309/master-marksman
 * https://www.warcraftlogs.com/reports/X2yBtArq6RbVkD1Z#fight=5&type=damage-done&start=1285631&end=1285631&view=events
 *
 */
export function eventLinkNormalizer(
  events: (AnyDebuffEvent | DamageEvent | CastEvent)[]
): DamageEvent[] {
  const linkedEvents: DamageEvent[] = [];

  const parentDotEventRecord = new Map<
    string,
    ApplyDebuffEvent | RefreshDebuffEvent | undefined
  >();
  const parentCastEventRecord = new Map<string, CastEvent | undefined>();
  const parentDotEventRemovedRecord = new Map<
    string,
    ApplyDebuffEvent | RefreshDebuffEvent | undefined
  >();

  let lastDebuffRemoveTimestamp = 0;

  for (const event of events) {
    const key = getKey(event);

    if (event.type === EventType.RemoveDebuffEvent) {
      parentDotEventRemovedRecord.set(key, parentDotEventRecord.get(key));
      parentDotEventRecord.delete(key);
      lastDebuffRemoveTimestamp = event.timestamp;
    }
    if (event.type === EventType.CastEvent) {
      const castKey = getCastKey(event);
      parentCastEventRecord.set(castKey, event);
    }

    if (
      event.type === EventType.ApplyDebuffEvent ||
      event.type === EventType.RefreshDebuffEvent
    ) {
      parentDotEventRecord.set(key, event);
    }
    if (event.type === EventType.DamageEvent) {
      const castKey = getCastKey(event);
      event.parentDotEvent = parentDotEventRecord.get(key);
      event.castEvent = parentCastEventRecord.get(castKey);

      if (!event.parentDotEvent) {
        if (lastDebuffRemoveTimestamp === event.timestamp) {
          event.parentDotEvent = parentDotEventRemovedRecord.get(key);
        }
      }

      linkedEvents.push(event);
    }
  }

  return linkedEvents;
}

function getKey(
  event:
    | DamageEvent
    | ApplyDebuffEvent
    | RefreshDebuffEvent
    | RemoveDebuffEvent
    | CastEvent
): string {
  let key = `${event.targetID}_${event.abilityGameID}`;
  if (event.targetInstance) key += `_${event.targetInstance}`;

  key += `_${event.sourceID}`;
  if (event.sourceInstance) key += `_${event.sourceInstance}`;

  return key;
}

function getCastKey(event: CastEvent | DamageEvent): string {
  /**
   * We need to do some manual linking due to some spells damage Ids
   * not being the same as their cast Ids :))
   */
  const spellId =
    event.abilityGameID === 257045 // Rapid Fire Damage
      ? 257044 // Rapid Fire Cast
      : event.abilityGameID === 191043 // Wind Arrow
      ? 19434 // Aimed shot
      : event.abilityGameID;
  let key = `${spellId}`;

  key += `_${event.sourceID}`;
  if (event.sourceInstance) key += `_${event.sourceInstance}`;

  return key;
}
