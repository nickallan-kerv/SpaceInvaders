import { GAME_CONFIG } from "../config";
import { BarrierCell } from "../entities/BarrierCell";
import { Enemy } from "../entities/Enemy";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import type { GameStatus } from "../types";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}

export class CanvasRenderer {
  private readonly farStars: Star[];
  private readonly nearStars: Star[];

  public constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly width: number,
    private readonly height: number,
  ) {
    this.farStars = this.createStars(48, 0.16, 1.1);
    this.nearStars = this.createStars(34, 0.28, 1.9);
  }

  public clear(): void {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  public beginWorld(cameraOffset: { x: number; y: number }): void {
    this.context.save();
    this.context.translate(cameraOffset.x, cameraOffset.y);
  }

  public endWorld(): void {
    this.context.restore();
  }

  public drawBackground(timeSeconds: number): void {
    this.context.fillStyle = "#060912";
    this.context.fillRect(0, 0, this.width, this.height);

    this.drawStarLayer(this.farStars, timeSeconds, "#3a4f7a");
    this.drawStarLayer(this.nearStars, timeSeconds, "#7fbee7");
  }

  public drawPlayer(player: Player, recoilOffsetPx: number, flashAlpha: number): void {
    const x = player.rect.x;
    const y = player.rect.y + recoilOffsetPx;
    const body = [
      "00111100",
      "01111110",
      "11111111",
      "11111111",
      "01100110",
      "11000011",
    ];

    this.drawPixelShape(body, x, y, player.rect.width / 8, "#72f8ff");
    if (flashAlpha > 0) {
      this.context.fillStyle = `rgb(255 220 220 / ${flashAlpha})`;
      this.context.fillRect(player.rect.x, player.rect.y, player.rect.width, player.rect.height);
    }
  }

  public drawEnemies(enemies: Enemy[], isFlashing: (id: string) => boolean): void {
    const enemySprite = [
      "00111100",
      "11111111",
      "11011011",
      "11111111",
      "01100110",
      "11000011",
    ];

    for (const enemy of enemies) {
      const baseColor = this.getEnemyRowColor(enemy.row);
      this.drawPixelShape(enemySprite, enemy.rect.x, enemy.rect.y, enemy.rect.width / 8, baseColor);

      if (isFlashing(enemy.id)) {
        this.context.fillStyle = "rgb(255 255 255 / 0.65)";
        this.context.fillRect(enemy.rect.x, enemy.rect.y, enemy.rect.width, enemy.rect.height);
      }
    }
  }

  public drawProjectiles(projectiles: Projectile[]): void {
    for (const projectile of projectiles) {
      this.context.fillStyle = projectile.owner === "player" ? "#ffd76e" : "#ff8f9a";
      this.context.fillRect(
        projectile.rect.x,
        projectile.rect.y,
        projectile.rect.width,
        projectile.rect.height,
      );
    }
  }

  public drawBarriers(barrierCells: BarrierCell[]): void {
    for (const cell of barrierCells) {
      this.context.fillStyle = cell.durability > 1 ? "#6CFF78" : "#3FAF4E";
      this.context.fillRect(cell.rect.x, cell.rect.y, cell.rect.width, cell.rect.height);
    }
  }

  public drawParticles(
    particles: ReadonlyArray<{
      x: number;
      y: number;
      size: number;
      lifeSeconds: number;
      maxLifeSeconds: number;
      color: string;
    }>,
  ): void {
    for (const particle of particles) {
      const alpha = Math.max(0.18, Math.min(1, particle.lifeSeconds / particle.maxLifeSeconds));
      this.context.fillStyle = this.hexToRgba(particle.color, alpha);
      this.context.fillRect(particle.x, particle.y, particle.size, particle.size);
    }
  }

  public drawHud(score: number, lives: number, wave: number, hardMode: boolean, streakMultiplier: number): void {
    this.context.fillStyle = "#f5f7ff";
    this.context.font = '18px "Trebuchet MS", sans-serif';
    this.context.fillText(`Score: ${score}`, 16, 28);
    this.context.fillText(`Lives: ${lives}`, 680, 28);
    this.context.fillText(`Wave: ${wave}`, 16, 54);
    this.context.fillText(`Streak x${streakMultiplier.toFixed(1)}`, 128, 54);
    if (hardMode) {
      this.context.fillStyle = "#ff9ca8";
      this.context.fillText("HARD", 740, 54);
      this.context.fillStyle = "#f5f7ff";
    }

    this.context.strokeStyle = "#2d3e78";
    this.context.beginPath();
    this.context.moveTo(0, 40);
    this.context.lineTo(this.width, 40);
    this.context.stroke();

    this.context.strokeStyle = "#68393f";
    this.context.setLineDash([8, 6]);
    const loseLineY = this.height - GAME_CONFIG.loseLineOffset;
    this.context.beginPath();
    this.context.moveTo(0, loseLineY);
    this.context.lineTo(this.width, loseLineY);
    this.context.stroke();
    this.context.setLineDash([]);
  }

  public drawOverlay(
    status: GameStatus,
    countdownSeconds: number,
    newHighScore: boolean,
    highScore: number,
    hardMode: boolean,
  ): void {
    if (status === "playing") {
      return;
    }

    this.context.fillStyle = "rgb(0 0 0 / 0.45)";
    this.context.fillRect(0, 0, this.width, this.height);

    this.context.fillStyle = "#ffffff";
    this.context.font = '36px "Trebuchet MS", sans-serif';
    this.context.textAlign = "center";

    const title =
      status === "ready"
        ? "Press Enter to Start"
        : status === "countdown"
          ? `Starting in ${Math.ceil(countdownSeconds)}`
          : status === "paused"
            ? "Paused"
            : status === "won"
              ? "You Win"
              : "Game Over";
    this.context.fillText(title, this.width / 2, this.height / 2 - 8);

    this.context.font = '20px "Trebuchet MS", sans-serif';
    if (status === "ready") {
      this.context.fillText("Objective: Clear all waves and survive", this.width / 2, this.height / 2 + 30);
      this.context.fillText("Controls: Move A/D, Shoot Space, Pause Esc", this.width / 2, this.height / 2 + 58);
      this.context.fillText(
        `Toggle Hard Mode with H (currently ${hardMode ? "ON" : "OFF"})`,
        this.width / 2,
        this.height / 2 + 86,
      );
    } else if (status === "paused") {
      this.context.fillText("Press Esc or Enter to Resume", this.width / 2, this.height / 2 + 30);
    } else if (status === "countdown") {
      this.context.fillText("Get Ready", this.width / 2, this.height / 2 + 30);
    } else {
      this.context.fillText("Press Enter to Play Again", this.width / 2, this.height / 2 + 30);
      this.context.fillText(`High Score: ${highScore}`, this.width / 2, this.height / 2 + 58);
      if (newHighScore) {
        this.context.fillStyle = "#98ffbe";
        this.context.fillText("New High Score!", this.width / 2, this.height / 2 + 86);
      }
    }

    this.context.textAlign = "start";
  }

  public drawCrtOverlay(enabled: boolean): void {
    if (!enabled) {
      return;
    }

    this.context.fillStyle = "rgb(20 180 130 / 0.04)";
    this.context.fillRect(0, 0, this.width, this.height);

    this.context.fillStyle = "rgb(0 0 0 / 0.12)";
    for (let y = 0; y < this.height; y += 4) {
      this.context.fillRect(0, y, this.width, 1);
    }
  }

  public drawDebugOverlay(enabled: boolean, lines: string[]): void {
    if (!enabled) {
      return;
    }

    this.context.fillStyle = "rgb(0 0 0 / 0.62)";
    this.context.fillRect(10, 72, 430, 22 + lines.length * 18);

    this.context.fillStyle = "#c8ffe0";
    this.context.font = '14px "Trebuchet MS", sans-serif';
    lines.forEach((line, index) => {
      this.context.fillText(line, 18, 92 + index * 18);
    });
  }

  private drawPixelShape(pattern: string[], x: number, y: number, pixelSize: number, color: string): void {
    this.context.fillStyle = color;
    for (let row = 0; row < pattern.length; row += 1) {
      for (let col = 0; col < pattern[row]?.length; col += 1) {
        if (pattern[row]?.[col] === "1") {
          this.context.fillRect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  }

  private createStars(count: number, minSpeed: number, maxSpeed: number): Star[] {
    const stars: Star[] = [];
    for (let i = 0; i < count; i += 1) {
      stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: 1 + Math.random() * 1.5,
        speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
      });
    }
    return stars;
  }

  private drawStarLayer(stars: Star[], timeSeconds: number, color: string): void {
    this.context.fillStyle = color;
    for (const star of stars) {
      const y = (star.y + timeSeconds * 60 * star.speed) % this.height;
      this.context.fillRect(star.x, y, star.size, star.size);
    }
  }

  private getEnemyRowColor(row: number): string {
    if (row === 0) {
      return "#ff8da1";
    }
    if (row === 1) {
      return "#ffd76e";
    }
    if (row === 2) {
      return "#9ee67b";
    }
    return "#79ccff";
  }

  private hexToRgba(hex: string, alpha: number): string {
    const clean = hex.replace("#", "");
    const normalized = clean.length === 3
      ? clean.split("").map((ch) => `${ch}${ch}`).join("")
      : clean;

    const red = Number.parseInt(normalized.slice(0, 2), 16);
    const green = Number.parseInt(normalized.slice(2, 4), 16);
    const blue = Number.parseInt(normalized.slice(4, 6), 16);
    return `rgb(${red} ${green} ${blue} / ${alpha})`;
  }
}
