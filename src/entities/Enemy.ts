import type { IEntity, Rect } from "../types";

export class Enemy implements IEntity {
  public readonly id: string;
  public readonly row: number;
  public readonly scoreValue: number;
  public rect: Rect;
  public isAlive = true;

  public constructor(
    id: string,
    row: number,
    scoreValue: number,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    this.id = id;
    this.row = row;
    this.scoreValue = scoreValue;
    this.rect = { x, y, width, height };
  }

  public update(): void {
    // Enemy movement is owned by the formation service to keep responsibilities isolated.
  }
}
