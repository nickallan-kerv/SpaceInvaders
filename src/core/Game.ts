import { GAME_CONFIG } from "../config";
import { BarrierCell } from "../entities/BarrierCell";
import { Enemy } from "../entities/Enemy";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { CanvasRenderer } from "../render/CanvasRenderer";
import { BarrierSystem } from "../systems/BarrierSystem";
import { CollisionService } from "../systems/CollisionService";
import { EffectsService } from "../systems/EffectsService";
import { EnemyFireSystem } from "../systems/EnemyFireSystem";
import { EnemyFormationService } from "../systems/EnemyFormationService";
import { ScoreService } from "../systems/ScoreService";
import type { GameStatus, IInputProvider } from "../types";

export class Game {
  private status: GameStatus = "ready";
  private readonly player: Player;
  private enemies: Enemy[] = [];
  private barrierCells: BarrierCell[] = [];
  private projectiles: Projectile[] = [];

  private lastFrameTime = 0;
  private elapsedSeconds = 0;
  private lives = 3;
  private fireCooldownRemaining = 0;
  private shootBufferRemaining = 0;
  private projectileSequence = 0;
  private countdownRemaining = 0;
  private waveIndex = 0;
  private waveEnemyStartCount = 0;
  private highScore = 0;
  private newHighScoreAchieved = false;
  private hardModeEnabled = false;
  private crtEnabled: boolean = GAME_CONFIG.visual.enableCrtByDefault;
  private debugOverlayEnabled = false;

  private moveGraceRemaining = 0;
  private lastMoveDirection = 0;
  private respawnFloatRemaining = 0;
  private streakCount = 0;
  private streakTimeoutRemaining = 0;

  private previousShootPressed = false;
  private previousStartPressed = false;
  private previousPausePressed = false;
  private previousDebugPressed = false;
  private previousCrtPressed = false;
  private previousHardModePressed = false;

  private readonly barrierSystem = new BarrierSystem();
  private readonly collisionService = new CollisionService();
  private readonly effectsService = new EffectsService();
  private readonly enemyFireSystem = new EnemyFireSystem();
  private readonly enemyFormationService = new EnemyFormationService();
  private readonly scoreService = new ScoreService();

  public constructor(
    private readonly renderer: CanvasRenderer,
    private readonly input: IInputProvider,
  ) {
    this.player = new Player(
      (GAME_CONFIG.width - GAME_CONFIG.player.width) / 2,
      GAME_CONFIG.height - 52,
    );
    this.prepareWave(0);
    this.barrierCells = this.barrierSystem.createBarriers();
  }

  public start(): void {
    requestAnimationFrame((timestamp) => this.tick(timestamp));
  }

  private tick(timestampMs: number): void {
    const deltaTimeSeconds = this.lastFrameTime === 0 ? 0 : (timestampMs - this.lastFrameTime) / 1000;
    this.lastFrameTime = timestampMs;
    this.elapsedSeconds += deltaTimeSeconds;

    this.update(deltaTimeSeconds);
    this.render();

    requestAnimationFrame((nextTimestamp) => this.tick(nextTimestamp));
  }

  private update(deltaTimeSeconds: number): void {
    this.effectsService.update(deltaTimeSeconds);
    this.effectsService.removeExpiredParticles();
    this.updateRespawnFloat(deltaTimeSeconds);

    this.handleInputEdges();

    this.streakTimeoutRemaining = Math.max(0, this.streakTimeoutRemaining - deltaTimeSeconds);
    if (this.streakTimeoutRemaining <= 0) {
      this.streakCount = 0;
    }

    if (this.status === "countdown") {
      this.countdownRemaining = Math.max(0, this.countdownRemaining - deltaTimeSeconds);
      if (this.countdownRemaining <= 0) {
        this.status = "playing";
      }
      return;
    }

    if (this.status !== "playing") {
      return;
    }

    this.updatePlayerMovement(deltaTimeSeconds);
    this.updateShooting(deltaTimeSeconds);

    for (const projectile of this.projectiles) {
      projectile.update(deltaTimeSeconds);
      if (projectile.rect.y + projectile.rect.height < 0 || projectile.rect.y > GAME_CONFIG.height) {
        projectile.isAlive = false;
      }
    }

    const speedMultiplier = this.enemyFormationService.getSpeedMultiplier(
      this.enemies.length,
      this.waveEnemyStartCount,
    );
    this.enemyFormationService.advance(this.enemies, deltaTimeSeconds, GAME_CONFIG.width, speedMultiplier);

    this.resolveCollisions();

    this.projectiles = this.projectiles.filter((projectile) => projectile.isAlive);
    this.enemies = this.enemies.filter((enemy) => enemy.isAlive);
    this.barrierCells = this.barrierCells.filter((cell) => cell.isAlive);

    this.handleLoseLine();
    this.handleWaveProgression();
  }

  private updatePlayerMovement(deltaTimeSeconds: number): void {
    const rawDirection = Number(this.input.isMoveRightPressed()) - Number(this.input.isMoveLeftPressed());

    if (rawDirection !== 0) {
      this.lastMoveDirection = rawDirection;
      this.moveGraceRemaining = GAME_CONFIG.player.movementGraceSeconds;
    } else {
      this.moveGraceRemaining = Math.max(0, this.moveGraceRemaining - deltaTimeSeconds);
    }

    const direction = rawDirection !== 0 ? rawDirection : this.moveGraceRemaining > 0 ? this.lastMoveDirection : 0;

    this.player.setMoveDirection(direction);
    this.player.update(deltaTimeSeconds);
    this.player.clampToBounds(0, GAME_CONFIG.width);
  }

  private updateRespawnFloat(deltaTimeSeconds: number): void {
    this.respawnFloatRemaining = Math.max(0, this.respawnFloatRemaining - deltaTimeSeconds);
  }

  private triggerRespawnFloat(): void {
    this.respawnFloatRemaining = GAME_CONFIG.player.respawnFloatSeconds;
  }

  private getRespawnFloatOffsetPx(): number {
    if (this.respawnFloatRemaining <= 0) {
      return 0;
    }

    const progress = this.respawnFloatRemaining / GAME_CONFIG.player.respawnFloatSeconds;
    return GAME_CONFIG.player.respawnFloatDistancePx * progress;
  }

  private updateShooting(deltaTimeSeconds: number): void {
    this.fireCooldownRemaining = Math.max(0, this.fireCooldownRemaining - deltaTimeSeconds);
    this.shootBufferRemaining = Math.max(0, this.shootBufferRemaining - deltaTimeSeconds);

    if (this.shootBufferRemaining > 0 && this.fireCooldownRemaining <= 0) {
      const projectileX = this.player.rect.x + this.player.rect.width / 2 - GAME_CONFIG.projectile.width / 2;
      const projectileY = this.player.rect.y - GAME_CONFIG.projectile.height;
      this.projectiles.push(this.createProjectile("player", projectileX, projectileY));
      this.effectsService.onPlayerShoot();
      this.fireCooldownRemaining = GAME_CONFIG.player.fireCooldownSeconds;
      this.shootBufferRemaining = 0;
    }

    const cooldownScale = this.hardModeEnabled ? GAME_CONFIG.enemyFire.hardModeMultiplier : 1;
    const enemyShot = this.enemyFireSystem.updateAndMaybeShoot(
      this.enemies,
      deltaTimeSeconds,
      `p-${this.projectileSequence}`,
      cooldownScale,
    );
    if (enemyShot) {
      this.projectiles.push(enemyShot);
      this.projectileSequence += 1;
    }
  }

  private resolveCollisions(): void {
    for (const projectile of this.projectiles) {
      if (!projectile.isAlive) {
        continue;
      }

      for (const barrierCell of this.barrierCells) {
        if (!barrierCell.isAlive) {
          continue;
        }
        if (this.collisionService.overlaps(projectile.rect, barrierCell.rect)) {
          barrierCell.applyDamage(1);
          projectile.isAlive = false;
          break;
        }
      }

      if (!projectile.isAlive || projectile.owner !== "player") {
        continue;
      }

      for (const enemy of this.enemies) {
        if (!enemy.isAlive) {
          continue;
        }
        if (this.collisionService.overlaps(projectile.rect, enemy.rect)) {
          projectile.isAlive = false;
          enemy.isAlive = false;
          this.effectsService.onEnemyHit(enemy.id, enemy.rect);
          this.incrementHitStreak();
          this.scoreService.add(Math.round(enemy.scoreValue * this.getCurrentStreakMultiplier()));
          break;
        }
      }
    }

    let playerHitByEnemyShot = false;
    for (const projectile of this.projectiles) {
      if (!projectile.isAlive || projectile.owner !== "enemy" || playerHitByEnemyShot) {
        continue;
      }
      if (this.collisionService.overlaps(projectile.rect, this.player.rect)) {
        projectile.isAlive = false;
        playerHitByEnemyShot = true;
      }
    }

    if (playerHitByEnemyShot) {
      this.effectsService.onPlayerHit(this.player.rect);
      this.streakCount = 0;
      this.lives = Math.max(0, this.lives - 1);
      this.player.rect.x = (GAME_CONFIG.width - GAME_CONFIG.player.width) / 2;
      this.player.resetMotion();
      if (this.lives > 0) {
        this.triggerRespawnFloat();
      }
      if (this.lives === 0) {
        this.finishRound("lost");
      }
    }
  }

  private handleLoseLine(): void {
    const loseLineY = GAME_CONFIG.height - GAME_CONFIG.loseLineOffset;
    const enemyReachedLoseLine = this.enemies.some((enemy) => enemy.rect.y + enemy.rect.height >= loseLineY);

    if (!enemyReachedLoseLine) {
      return;
    }

    this.lives = Math.max(0, this.lives - 1);
    this.streakCount = 0;

    if (this.lives === 0) {
      this.finishRound("lost");
      return;
    }

    this.prepareWave(this.waveIndex);
    this.projectiles = [];
    this.player.resetMotion();
    this.beginCountdown();
  }

  private handleWaveProgression(): void {
    if (this.enemies.length > 0) {
      return;
    }

    if (this.waveIndex + 1 >= GAME_CONFIG.waves.total) {
      this.finishRound("won");
      return;
    }

    this.waveIndex += 1;
    this.prepareWave(this.waveIndex);
    this.projectiles = [];
    this.beginCountdown();
  }

  private prepareWave(waveIndex: number): void {
    this.enemies = this.enemyFormationService.createWave(waveIndex);
    this.waveEnemyStartCount = this.enemies.length;
    this.enemyFireSystem.reset();
  }

  private beginCountdown(): void {
    this.countdownRemaining = GAME_CONFIG.countdownSeconds;
    this.status = "countdown";
  }

  private handleInputEdges(): void {
    const startPressed = this.input.isStartPressed();
    const pausePressed = this.input.isPausePressed();
    const shootPressed = this.input.isShootPressed();
    const debugPressed = this.input.isToggleDebugPressed();
    const crtPressed = this.input.isToggleCrtPressed();
    const hardModePressed = this.input.isToggleHardModePressed();

    const startJustPressed = startPressed && !this.previousStartPressed;
    const pauseJustPressed = pausePressed && !this.previousPausePressed;
    const shootJustPressed = shootPressed && !this.previousShootPressed;
    const debugJustPressed = debugPressed && !this.previousDebugPressed;
    const crtJustPressed = crtPressed && !this.previousCrtPressed;
    const hardModeJustPressed = hardModePressed && !this.previousHardModePressed;

    if (debugJustPressed) {
      this.debugOverlayEnabled = !this.debugOverlayEnabled;
    }

    if (crtJustPressed) {
      this.crtEnabled = !this.crtEnabled;
    }

    if (hardModeJustPressed && this.status === "ready") {
      this.hardModeEnabled = !this.hardModeEnabled;
    }

    if (shootJustPressed) {
      this.shootBufferRemaining = GAME_CONFIG.player.shootInputBufferSeconds;
    }

    if (startJustPressed && (this.status === "ready" || this.status === "won" || this.status === "lost")) {
      this.resetRound();
    }

    if (pauseJustPressed && this.status === "playing") {
      this.status = "paused";
    } else if ((pauseJustPressed || startJustPressed) && this.status === "paused") {
      this.status = "playing";
    }

    this.previousStartPressed = startPressed;
    this.previousPausePressed = pausePressed;
    this.previousShootPressed = shootPressed;
    this.previousDebugPressed = debugPressed;
    this.previousCrtPressed = crtPressed;
    this.previousHardModePressed = hardModePressed;
  }

  private resetRound(): void {
    this.status = "countdown";
    this.scoreService.reset();
    this.newHighScoreAchieved = false;
    this.lives = 3;
    this.waveIndex = 0;
    this.streakCount = 0;
    this.streakTimeoutRemaining = 0;
    this.projectiles = [];
    this.fireCooldownRemaining = 0;
    this.shootBufferRemaining = 0;
    this.projectileSequence = 0;
    this.moveGraceRemaining = 0;
    this.lastMoveDirection = 0;
    this.respawnFloatRemaining = 0;
    this.player.rect.x = (GAME_CONFIG.width - GAME_CONFIG.player.width) / 2;
    this.player.resetMotion();

    this.prepareWave(this.waveIndex);
    this.barrierCells = this.barrierSystem.createBarriers();
    this.countdownRemaining = GAME_CONFIG.countdownSeconds;
  }

  private finishRound(result: "won" | "lost"): void {
    this.status = result;
    const currentScore = this.scoreService.current();
    this.newHighScoreAchieved = currentScore > this.highScore;
    this.highScore = Math.max(this.highScore, currentScore);
  }

  private incrementHitStreak(): void {
    this.streakCount += 1;
    this.streakTimeoutRemaining = 2.2;
  }

  private getCurrentStreakMultiplier(): number {
    return Math.min(2.5, 1 + this.streakCount * 0.08);
  }

  private render(): void {
    const cameraOffset = this.effectsService.getCameraOffset();

    this.renderer.clear();
    this.renderer.drawBackground(this.elapsedSeconds);

    this.renderer.beginWorld(cameraOffset);
    this.renderer.drawPlayer(
      this.player,
      this.effectsService.getPlayerRecoilOffsetPx() + this.getRespawnFloatOffsetPx(),
      this.effectsService.getPlayerFlashAlpha(),
    );
    this.renderer.drawEnemies(this.enemies, (id) => this.effectsService.isEnemyFlashing(id));
    this.renderer.drawBarriers(this.barrierCells);
    this.renderer.drawProjectiles(this.projectiles);
    this.renderer.drawParticles(this.effectsService.getParticles());
    this.renderer.endWorld();

    this.renderer.drawHud(
      this.scoreService.current(),
      this.lives,
      this.waveIndex + 1,
      this.hardModeEnabled,
      this.getCurrentStreakMultiplier(),
    );

    this.renderer.drawOverlay(
      this.status,
      this.countdownRemaining,
      this.newHighScoreAchieved,
      this.highScore,
      this.hardModeEnabled,
    );

    this.renderer.drawCrtOverlay(this.crtEnabled);
    this.renderer.drawDebugOverlay(this.debugOverlayEnabled, [
      "Req IDs: RQ-014..RQ-040",
      `Status: ${this.status}`,
      `Enemies: ${this.enemies.length}`,
      `Effects particles: ${this.effectsService.getParticles().length}`,
      `Hard mode: ${this.hardModeEnabled ? "ON" : "OFF"}`,
    ]);
  }

  private createProjectile(owner: "player" | "enemy", x: number, y: number): Projectile {
    const projectile = new Projectile(`p-${this.projectileSequence}`, owner, x, y);
    this.projectileSequence += 1;
    return projectile;
  }
}
