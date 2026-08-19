import type { IEntity, Rect } from "../types";

export class BarrierCell implements IEntity {
  public readonly id: string;
  public rect: Rect;
  public isAlive = true;
  public durability: number;

  public constructor(id: string, rect: Rect, durability: number) {
    this.id = id;
    this.rect = rect;
    this.durability = durability;
  }

  public update(): void {
    // Barrier cells are static and updated only when taking damage.
  }

  public applyDamage(amount: number): void {
    this.durability = Math.max(0, this.durability - amount);
    this.isAlive = this.durability > 0;
  }
}
