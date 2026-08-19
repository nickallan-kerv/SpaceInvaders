import { GAME_CONFIG } from "../config";
import { Enemy } from "../entities/Enemy";

export class EnemyFormationService {
  private horizontalDirection = 1;

  public createWave(waveIndex: number): Enemy[] {
    const enemies: Enemy[] = [];
    const enemyConfig = GAME_CONFIG.enemy;

    for (let row = 0; row < enemyConfig.rows; row += 1) {
      for (let column = 0; column < enemyConfig.columns; column += 1) {
        if (!this.shouldSpawnEnemy(waveIndex, row, column)) {
          continue;
        }

        const x = enemyConfig.startX + column * (enemyConfig.width + enemyConfig.horizontalGap);
        const y = enemyConfig.startY + row * (enemyConfig.height + enemyConfig.verticalGap);
        const scoreValue = enemyConfig.scoreByRow[row] ?? 10;
        enemies.push(new Enemy(`enemy-${waveIndex}-${row}-${column}`, row, scoreValue, x, y, enemyConfig.width, enemyConfig.height));
      }
    }

    return enemies;
  }

  public advance(
    enemies: Enemy[],
    deltaTimeSeconds: number,
    playfieldWidth: number,
    speedMultiplier: number,
  ): void {
    if (enemies.length === 0) {
      return;
    }

    const movement =
      this.horizontalDirection * GAME_CONFIG.enemy.horizontalSpeed * speedMultiplier * deltaTimeSeconds;
    for (const enemy of enemies) {
      enemy.rect.x += movement;
    }

    const hitRightWall = enemies.some((enemy) => enemy.rect.x + enemy.rect.width >= playfieldWidth - 8);
    const hitLeftWall = enemies.some((enemy) => enemy.rect.x <= 8);

    if (hitRightWall || hitLeftWall) {
      this.horizontalDirection *= -1;
      for (const enemy of enemies) {
        enemy.rect.y += GAME_CONFIG.enemy.descendStep;
      }
    }
  }

  public getSpeedMultiplier(aliveEnemies: number, totalWaveEnemies: number): number {
    if (totalWaveEnemies <= 0) {
      return 1;
    }

    const defeatRatio = 1 - aliveEnemies / totalWaveEnemies;
    return 1 + defeatRatio * GAME_CONFIG.enemy.speedRampFactor;
  }

  private shouldSpawnEnemy(waveIndex: number, row: number, column: number): boolean {
    const normalizedWave = waveIndex % GAME_CONFIG.waves.total;

    if (normalizedWave === 0) {
      return true;
    }

    if (normalizedWave === 1) {
      const center = (GAME_CONFIG.enemy.columns - 1) / 2;
      return Math.abs(column - center) <= row + 1;
    }

    const staggeredGap = (row + column) % 3 === 0;
    return !staggeredGap;
  }
}
