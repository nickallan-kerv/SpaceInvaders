export type GameStatus = "ready" | "countdown" | "playing" | "paused" | "won" | "lost";
export type ProjectileOwner = "player" | "enemy";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IEntity {
  readonly id: string;
  rect: Rect;
  isAlive: boolean;
  update(deltaTimeSeconds: number): void;
}

export interface IInputProvider {
  isMoveLeftPressed(): boolean;
  isMoveRightPressed(): boolean;
  isShootPressed(): boolean;
  isStartPressed(): boolean;
  isPausePressed(): boolean;
  isToggleDebugPressed(): boolean;
  isToggleCrtPressed(): boolean;
  isToggleHardModePressed(): boolean;
}

export interface ICollisionService {
  overlaps(a: Rect, b: Rect): boolean;
}
