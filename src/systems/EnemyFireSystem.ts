import { GAME_CONFIG } from "../config";
import { Enemy } from "../entities/Enemy";
import { Projectile } from "../entities/Projectile";

export class EnemyFireSystem {
  private cooldownRemainingSeconds = 0;
  private jitterRemainingSeconds = 0;

  public reset(): void {
    this.cooldownRemainingSeconds = GAME_CONFIG.enemyFire.baseCooldownSeconds;
    this.jitterRemainingSeconds = 0;
  }

  public updateAndMaybeShoot(
    enemies: Enemy[],
    deltaTimeSeconds: number,
    nextProjectileId: string,
    cooldownScale: number = 1,
  ): Projectile | null {
    this.cooldownRemainingSeconds = Math.max(0, this.cooldownRemainingSeconds - deltaTimeSeconds);
    this.jitterRemainingSeconds = Math.max(0, this.jitterRemainingSeconds - deltaTimeSeconds);

    if (this.cooldownRemainingSeconds > 0 || this.jitterRemainingSeconds > 0) {
      return null;
    }

    const shooters = this.getEligibleShooters(enemies);
    if (shooters.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * shooters.length);
    const shooter = shooters[randomIndex];
    if (!shooter) {
      return null;
    }

    this.cooldownRemainingSeconds = GAME_CONFIG.enemyFire.baseCooldownSeconds * cooldownScale;
    this.jitterRemainingSeconds = Math.random() * GAME_CONFIG.enemyFire.cooldownJitterSeconds;

    const projectileX = shooter.rect.x + shooter.rect.width / 2 - GAME_CONFIG.projectile.width / 2;
    const projectileY = shooter.rect.y + shooter.rect.height;
    return new Projectile(nextProjectileId, "enemy", projectileX, projectileY);
  }

  public getEligibleShooters(enemies: Enemy[]): Enemy[] {
    if (enemies.length === 0) {
      return [];
    }

    const columns = new Map<number, Enemy>();
    const columnWidth = GAME_CONFIG.enemy.width + GAME_CONFIG.enemy.horizontalGap;

    for (const enemy of enemies) {
      const columnIndex = Math.round((enemy.rect.x - GAME_CONFIG.enemy.startX) / columnWidth);
      const existing = columns.get(columnIndex);
      if (!existing || enemy.rect.y > existing.rect.y) {
        columns.set(columnIndex, enemy);
      }
    }

    return [...columns.values()];
  }
}
