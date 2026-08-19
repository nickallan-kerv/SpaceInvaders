import { describe, expect, it } from "vitest";
import { GAME_CONFIG } from "../src/config";
import { BarrierSystem } from "../src/systems/BarrierSystem";

describe("BarrierSystem", () => {
  it("creates classic segmented barriers with notch gaps", () => {
    const system = new BarrierSystem();
    const cells = system.createBarriers();

    const baseCellsPerBarrier = GAME_CONFIG.barrier.rows * GAME_CONFIG.barrier.columns;
    const notchCellsPerBarrier = 8;
    const expectedCount = (baseCellsPerBarrier - notchCellsPerBarrier) * GAME_CONFIG.barrier.count;

    expect(cells.length).toBe(expectedCount);
  });

  it("barrier cells degrade and are removed at zero durability", () => {
    const system = new BarrierSystem();
    const cells = system.createBarriers();
    const target = cells[0];

    expect(target).toBeDefined();
    expect(target?.durability).toBe(GAME_CONFIG.barrier.cellDurability);

    target?.applyDamage(1);
    expect(target?.isAlive).toBe(true);

    target?.applyDamage(GAME_CONFIG.barrier.cellDurability);
    expect(target?.durability).toBe(0);
    expect(target?.isAlive).toBe(false);
  });
});
