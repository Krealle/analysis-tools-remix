export enum EnemyType {
  Boss = "boss",
  Add = "add",
  Trash = "trash",
  Custom = "custom",
}
export type Enemy = {
  id: number;
  name: string;
  type: EnemyType;
};
export type Encounter = {
  name: string;
  id: number;
  enemies: Enemy[];
  image?: string;
  wclPhases?: Record<string, string | undefined>;
  intervalPhases?: string[];
};
export type EncounterMap = Map<string, Encounter>;
