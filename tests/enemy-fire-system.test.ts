import { describe, expect, it, vi } from "vitest";
import { GAME_CONFIG } from "../src/config";
import { Enemy } from "../src/entities/Enemy";
import { EnemyFireSystem } from "../src/systems/EnemyFireSystem";

describe("EnemyFireSystem", () => {
  it("returns only bottom-most invaders as eligible shooters per column", () => {
    const system = new EnemyFireSystem();
    const columnWidth = GAME_CONFIG.enemy.width + GAME_CONFIG.enemy.horizontalGap;

    const enemies = [
      new Enemy("c0-top", 0, 40, GAME_CONFIG.enemy.startX, 100, GAME_CONFIG.enemy.width, GAME_CONFIG.enemy.height),
      new Enemy("c0-bottom", 1, 30, GAME_CONFIG.enemy.startX, 140, GAME_CONFIG.enemy.width, GAME_CONFIG.enemy.height),
      new Enemy("c1-top", 0, 40, GAME_CONFIG.enemy.startX + columnWidth, 110, GAME_CONFIG.enemy.width, GAME_CONFIG.enemy.height),
      new Enemy("c1-bottom", 1, 30, GAME_CONFIG.enemy.startX + columnWidth, 150, GAME_CONFIG.enemy.width, GAME_CONFIG.enemy.height),
    ];

    const shooters = system.getEligibleShooters(enemies);
    const shooterIds = shooters.map((enemy) => enemy.id).sort();

    expect(shooterIds).toEqual(["c0-bottom", "c1-bottom"]);
  });

  it("spawns enemy projectiles from eligible shooters only", () => {
    const system = new EnemyFireSystem();
    system.reset();

    const columnWidth = GAME_CONFIG.enemy.width + GAME_CONFIG.enemy.horizontalGap;
    const enemies = [
      new Enemy("c0-top", 0, 40, GAME_CONFIG.enemy.startX, 100, GAME_CONFIG.enemy.width, GAME_CONFIG.enemy.height),
      new Enemy("c0-bottom", 1, 30, GAME_CONFIG.enemy.startX, 140, GAME_CONFIG.enemy.width, GAME_CONFIG.enemy.height),
      new Enemy("c1-bottom", 1, 30, GAME_CONFIG.enemy.startX + columnWidth, 150, GAME_CONFIG.enemy.width, GAME_CONFIG.enemy.height),
    ];

    vi.spyOn(Math, "random").mockReturnValue(0);

    const shot = system.updateAndMaybeShoot(enemies, 2, "enemy-shot-1");

    expect(shot).not.toBeNull();
    expect(shot?.owner).toBe("enemy");
    expect(shot?.rect.y).toBe(140 + GAME_CONFIG.enemy.height);

    vi.restoreAllMocks();
  });
});
