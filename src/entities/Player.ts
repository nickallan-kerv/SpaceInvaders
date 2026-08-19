import { GAME_CONFIG } from "../config";
import type { IEntity, Rect } from "../types";

export class Player implements IEntity {
  public readonly id = "player";
  public rect: Rect;
  public isAlive = true;

  private readonly speed = GAME_CONFIG.player.speed;
  private readonly acceleration = GAME_CONFIG.player.acceleration;
  private readonly deceleration = GAME_CONFIG.player.deceleration;
  private moveDirection = 0;
  private velocityX = 0;

  public constructor(initialX: number, initialY: number) {
    this.rect = {
      x: initialX,
      y: initialY,
      width: GAME_CONFIG.player.width,
      height: GAME_CONFIG.player.height,
    };
  }

  public setMoveDirection(direction: number): void {
    this.moveDirection = Math.max(-1, Math.min(1, direction));
  }

  public update(deltaTimeSeconds: number): void {
    const targetVelocity = this.moveDirection * this.speed;
    const velocityDelta = targetVelocity - this.velocityX;
    const rate = Math.abs(targetVelocity) > Math.abs(this.velocityX) ? this.acceleration : this.deceleration;
    const maxVelocityStep = rate * deltaTimeSeconds;

    if (Math.abs(velocityDelta) <= maxVelocityStep) {
      this.velocityX = targetVelocity;
    } else {
      this.velocityX += Math.sign(velocityDelta) * maxVelocityStep;
    }

    this.rect.x += this.velocityX * deltaTimeSeconds;
  }

  public clampToBounds(minX: number, maxX: number): void {
    this.rect.x = Math.max(minX, Math.min(maxX - this.rect.width, this.rect.x));
    if (this.rect.x <= minX || this.rect.x >= maxX - this.rect.width) {
      this.velocityX = 0;
    }
  }

  public resetMotion(): void {
    this.moveDirection = 0;
    this.velocityX = 0;
  }
}
