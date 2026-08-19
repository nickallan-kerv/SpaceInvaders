import { describe, expect, it } from "vitest";
import { GAME_CONFIG } from "../src/config";
import { Game } from "../src/core/Game";
import { Projectile } from "../src/entities/Projectile";
import type { IInputProvider } from "../src/types";

class InputStub implements IInputProvider {
  public moveLeft = false;
  public moveRight = false;
  public shoot = false;
  public start = false;
  public pause = false;
  public debug = false;
  public crt = false;
  public hard = false;

  public isMoveLeftPressed(): boolean { return this.moveLeft; }
  public isMoveRightPressed(): boolean { return this.moveRight; }
  public isShootPressed(): boolean { return this.shoot; }
  public isStartPressed(): boolean { return this.start; }
  public isPausePressed(): boolean { return this.pause; }
  public isToggleDebugPressed(): boolean { return this.debug; }
  public isToggleCrtPressed(): boolean { return this.crt; }
  public isToggleHardModePressed(): boolean { return this.hard; }
}

function rendererStub() {
  return {
    clear() {},
    drawBackground() {},
    beginWorld() {},
    drawPlayer() {},
    drawEnemies() {},
    drawBarriers() {},
    drawProjectiles() {},
    drawParticles() {},
    endWorld() {},
    drawHud() {},
    drawOverlay() {},
    drawCrtOverlay() {},
    drawDebugOverlay() {},
  };
}

describe("Game state transitions", () => {
  it("starts in ready and transitions to countdown then playing", () => {
    const input = new InputStub();
    const game = new Game(rendererStub() as never, input);

    expect((game as any).status).toBe("ready");

    input.start = true;
    (game as any).update(0.016);
    expect((game as any).status).toBe("countdown");

    input.start = false;
    (game as any).update(3);
    expect((game as any).status).toBe("playing");
  });

  it("pauses and resumes from playing state", () => {
    const input = new InputStub();
    const game = new Game(rendererStub() as never, input);

    (game as any).status = "playing";

    input.pause = true;
    (game as any).update(0.016);
    expect((game as any).status).toBe("paused");

    input.pause = false;
    (game as any).update(0.016);

    input.pause = true;
    (game as any).update(0.016);
    expect((game as any).status).toBe("playing");
  });

  it("applies a respawn float cue after a non-fatal player hit", () => {
    const input = new InputStub();
    const game = new Game(rendererStub() as never, input);

    (game as any).status = "playing";

    const player = (game as any).player;
    const enemyShot = new Projectile(
      "enemy-test",
      "enemy",
      player.rect.x + player.rect.width / 2,
      player.rect.y + player.rect.height / 2,
    );
    (game as any).projectiles = [enemyShot];

    (game as any).update(0.016);
    expect((game as any).lives).toBe(2);
    expect((game as any).respawnFloatRemaining).toBeGreaterThan(0);

    (game as any).update(GAME_CONFIG.player.respawnFloatSeconds + 0.1);
    expect((game as any).respawnFloatRemaining).toBe(0);
  });

  it("continues moving briefly after releasing horizontal input", () => {
    const input = new InputStub();
    const game = new Game(rendererStub() as never, input);
    (game as any).status = "playing";

    const player = (game as any).player;
    const startX = player.rect.x;

    input.moveRight = true;
    (game as any).update(0.05);
    input.moveRight = false;

    const xAtRelease = player.rect.x;
    (game as any).update(Math.max(0.02, GAME_CONFIG.player.movementGraceSeconds * 0.5));
    expect(player.rect.x).toBeGreaterThan(xAtRelease);

    (game as any).update(GAME_CONFIG.player.movementGraceSeconds + 0.3);
    const xAfterDriftWindow = player.rect.x;
    (game as any).update(0.2);
    expect(player.rect.x - xAfterDriftWindow).toBeLessThanOrEqual(0.1);
    expect(player.rect.x).toBeGreaterThan(startX);
  });
});
