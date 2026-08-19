import { GAME_CONFIG } from "../config";
import type { Rect } from "../types";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  lifeSeconds: number;
  maxLifeSeconds: number;
  size: number;
  color: string;
}

export class EffectsService {
  private shakeTimeRemaining = 0;
  private shakeMagnitudePx: number = GAME_CONFIG.effects.shakeMagnitudePx;
  private playerFlashRemaining = 0;
  private recoilRemaining = 0;
  private readonly enemyFlashRemaining = new Map<string, number>();
  private readonly particles: Particle[] = [];

  public update(deltaTimeSeconds: number): void {
    this.shakeTimeRemaining = Math.max(0, this.shakeTimeRemaining - deltaTimeSeconds);
    this.playerFlashRemaining = Math.max(0, this.playerFlashRemaining - deltaTimeSeconds);
    this.recoilRemaining = Math.max(0, this.recoilRemaining - deltaTimeSeconds);

    for (const [id, time] of this.enemyFlashRemaining.entries()) {
      const next = Math.max(0, time - deltaTimeSeconds);
      if (next <= 0) {
        this.enemyFlashRemaining.delete(id);
      } else {
        this.enemyFlashRemaining.set(id, next);
      }
    }

    for (const particle of this.particles) {
      particle.lifeSeconds -= deltaTimeSeconds;
      particle.x += particle.vx * deltaTimeSeconds;
      particle.y += particle.vy * deltaTimeSeconds;
      particle.vy += 180 * deltaTimeSeconds;
    }
  }

  public removeExpiredParticles(): void {
    for (let index = this.particles.length - 1; index >= 0; index -= 1) {
      if (this.particles[index] && this.particles[index].lifeSeconds <= 0) {
        this.particles.splice(index, 1);
      }
    }
  }

  public onEnemyHit(enemyId: string, targetRect: Rect): void {
    this.shakeTimeRemaining = GAME_CONFIG.effects.shakeDurationSeconds;
    this.shakeMagnitudePx = GAME_CONFIG.effects.shakeMagnitudePx;
    this.enemyFlashRemaining.set(enemyId, GAME_CONFIG.effects.flashDurationSeconds);

    this.spawnBurst(
      targetRect,
      GAME_CONFIG.effects.particleBurstCount,
      GAME_CONFIG.effects.particleLifeSeconds,
      70,
      150,
      "#ffe6a0",
    );
  }

  public onPlayerHit(targetRect: Rect): void {
    this.playerFlashRemaining = GAME_CONFIG.effects.flashDurationSeconds;
    this.shakeTimeRemaining = GAME_CONFIG.effects.playerHitShakeDurationSeconds;
    this.shakeMagnitudePx = GAME_CONFIG.effects.playerHitShakeMagnitudePx;

    this.spawnBurst(
      targetRect,
      GAME_CONFIG.effects.playerHitParticleBurstCount,
      GAME_CONFIG.effects.playerHitParticleLifeSeconds,
      GAME_CONFIG.effects.playerHitParticleSpeedMin,
      GAME_CONFIG.effects.playerHitParticleSpeedMax,
      "#ff8f9a",
    );

    // Add a second hot-core burst so player hits read as a major event.
    this.spawnBurst(
      targetRect,
      Math.floor(GAME_CONFIG.effects.playerHitParticleBurstCount * 0.45),
      GAME_CONFIG.effects.playerHitParticleLifeSeconds * 0.8,
      GAME_CONFIG.effects.playerHitParticleSpeedMin * 0.7,
      GAME_CONFIG.effects.playerHitParticleSpeedMax * 0.9,
      "#ffd3d8",
    );
  }

  public onPlayerShoot(): void {
    this.recoilRemaining = GAME_CONFIG.effects.flashDurationSeconds;
  }

  public getCameraOffset(): { x: number; y: number } {
    if (this.shakeTimeRemaining <= 0) {
      return { x: 0, y: 0 };
    }

    const magnitude = this.shakeMagnitudePx;
    return {
      x: (Math.random() * 2 - 1) * magnitude,
      y: (Math.random() * 2 - 1) * magnitude,
    };
  }

  public getPlayerFlashAlpha(): number {
    return this.playerFlashRemaining > 0 ? 0.6 : 0;
  }

  public isEnemyFlashing(enemyId: string): boolean {
    return (this.enemyFlashRemaining.get(enemyId) ?? 0) > 0;
  }

  public getPlayerRecoilOffsetPx(): number {
    return this.recoilRemaining > 0 ? GAME_CONFIG.player.recoilDistancePx : 0;
  }

  public getParticles(): ReadonlyArray<Particle> {
    return this.particles;
  }

  private spawnBurst(
    targetRect: Rect,
    count: number,
    lifeSeconds: number,
    speedMin: number,
    speedMax: number,
    color: string,
  ): void {
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = speedMin + Math.random() * (speedMax - speedMin);
      this.particles.push({
        x: targetRect.x + targetRect.width / 2,
        y: targetRect.y + targetRect.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        lifeSeconds,
        maxLifeSeconds: lifeSeconds,
        size: 2 + Math.random() * 2.6,
        color,
      });
    }
  }
}
