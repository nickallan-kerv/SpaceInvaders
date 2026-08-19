import { GAME_CONFIG } from "../config";
import type { IEntity, ProjectileOwner, Rect } from "../types";

export class Projectile implements IEntity {
  public readonly id: string;
  public readonly owner: ProjectileOwner;
  public rect: Rect;
  public isAlive = true;

  private readonly speed = GAME_CONFIG.projectile.speed;

  public constructor(id: string, owner: ProjectileOwner, x: number, y: number) {
    this.id = id;
    this.owner = owner;
    this.rect = {
      x,
      y,
      width: GAME_CONFIG.projectile.width,
      height: GAME_CONFIG.projectile.height,
    };
  }

  public update(deltaTimeSeconds: number): void {
    const direction = this.owner === "player" ? -1 : 1;
    this.rect.y += direction * this.speed * deltaTimeSeconds;
  }
}
